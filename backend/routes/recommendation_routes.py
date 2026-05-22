from fastapi import APIRouter, HTTPException
from services.recommendation.recommendation_engine import recommend_careers

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.post("/")
async def get_recommendations(data: dict):
    """Get career recommendations from skills/interests."""
    if not data.get("skills") and not data.get("interests"):
        raise HTTPException(400, "Provide at least skills or interests")
    results = recommend_careers(data, top_n=data.get("top_n", 5))
    return {"recommendations": results}
