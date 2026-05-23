from fastapi import APIRouter, HTTPException
from services.recommendation.collaborative_api import get_collaborative_recommendations
from services.skill_gap.gap_analysis import analyze_skill_gap
from services.dashboard.chart_data import build_dashboard_summary, build_skills_radar

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.post("/")
async def get_dashboard(data: dict):
    """
    Full dashboard data: recommendations + skill gap + chart data.
    Recommendations are ranked by semantic match + experience + live market demand (REQ-21).
    Expects: { skills, interests, target_role (optional), experience_years (optional) }
    """
    skills = data.get("skills", [])
    interests = data.get("interests", [])
    target_role = data.get("target_role", "")

    if not skills and not interests:
        raise HTTPException(400, "Provide skills or interests")

    recommendations = get_collaborative_recommendations(
        user_profile=data,
        top_n=5,
        boost_market_demand=True,
    )

    # Use top recommendation as target if not specified
    if not target_role and recommendations:
        target_role = recommendations[0]["title"]

    gap_analysis = analyze_skill_gap(skills, target_role) if target_role else {}
    radar_chart = build_skills_radar(skills, recommendations)
    summary = build_dashboard_summary(recommendations, gap_analysis)
    summary["charts"]["skills_radar"] = radar_chart

    return {
        "recommendations": recommendations,
        "gap_analysis": gap_analysis,
        "dashboard": summary,
    }
