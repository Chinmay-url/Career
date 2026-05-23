"""Authentication routes — register, login, me."""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId

from models.user import UserRegister, UserLogin, UserOut, TokenResponse
from auth.password_utils import hash_password, verify_password
from auth.jwt_handler import create_access_token
from middleware.auth_middleware import get_current_user
from database.mongodb import users_col

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(body: UserRegister):
    """Create a new user account."""
    col = users_col()

    # Check duplicate email
    existing = await col.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(400, "Email already registered")

    user_doc = {
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "hashed_password": hash_password(body.password),
        "is_active": True,
        "created_at": datetime.utcnow(),
    }
    result = await col.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": user_id, "email": user_doc["email"]})
    return TokenResponse(
        access_token=token,
        user=UserOut(
            id=user_id,
            name=user_doc["name"],
            email=user_doc["email"],
            is_active=True,
        ),
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin):
    """Authenticate and return a JWT."""
    col = users_col()
    user = await col.find_one({"email": body.email.lower()})

    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(401, "Invalid email or password")

    if not user.get("is_active", True):
        raise HTTPException(403, "Account is disabled")

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id, "email": user["email"]})
    return TokenResponse(
        access_token=token,
        user=UserOut(
            id=user_id,
            name=user["name"],
            email=user["email"],
            is_active=user.get("is_active", True),
        ),
    )


@router.get("/me", response_model=UserOut)
async def get_me(payload: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    col = users_col()
    user_id = payload.get("sub")
    try:
        user = await col.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(404, "User not found")

    if not user:
        raise HTTPException(404, "User not found")

    return UserOut(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        is_active=user.get("is_active", True),
    )
