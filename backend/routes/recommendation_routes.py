from fastapi import APIRouter, HTTPException
from services.recommendation.collaborative_api import get_collaborative_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.post("/")
async def get_recommendations(data: dict):
    """
    Get career recommendations from skills/interests.
    Results are ranked by semantic match + experience level + live market demand (REQ-21).
    """
    if not data.get("skills") and not data.get("interests"):
        raise HTTPException(400, "Provide at least skills or interests")

    results = get_collaborative_recommendations(
        user_profile=data,
        top_n=data.get("top_n", 5),
        boost_market_demand=data.get("boost_market_demand", True),
    )
    return {"recommendations": results}
