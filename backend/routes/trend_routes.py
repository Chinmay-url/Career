"""
Market trend routes.
Provides endpoints for job demand, salary estimates, multi-role comparison,
and trending skills — all powered by the Adzuna API (REQ-18 to REQ-21).
"""
from fastapi import APIRouter, HTTPException, Query
from services.trends.adzuna_client import fetch_job_demand
from services.trends.trend_analyzer import (
    analyze_trends_for_roles,
    get_salary_estimates,
    extract_trending_skills,
)

router = APIRouter(prefix="/api/trends", tags=["trends"])


@router.get("/{role}")
async def job_market(role: str, country: str = Query(default="us")):
    """
    Get real-time job market data for a single role via Adzuna.
    Returns open position count, salary range, and sample listings.
    """
    data = fetch_job_demand(role, country=country)
    return data


@router.get("/{role}/salary")
async def salary_estimate(role: str):
    """
    Get salary min/max/avg for a role derived from live Adzuna listings.
    """
    return get_salary_estimates(role)


@router.post("/compare")
async def compare_roles(data: dict):
    """
    Compare job demand and salary across multiple roles.
    Body: { "roles": ["Software Engineer", "Data Scientist", ...], "country": "us" }
    Returns chart-ready data sorted by demand (REQ-19, REQ-21).
    """
    roles = data.get("roles", [])
    if not roles:
        raise HTTPException(400, "Provide a list of roles to compare")
    if len(roles) > 10:
        raise HTTPException(400, "Maximum 10 roles per comparison")

    return analyze_trends_for_roles(roles)


@router.post("/trending-skills")
async def trending_skills(data: dict):
    """
    Identify trending skills from job listings across given roles (REQ-20).
    Body: { "roles": ["Software Engineer", "Data Scientist", ...] }
    Returns ranked skill keywords with mention counts and a chart payload.
    """
    roles = data.get("roles", [])
    if not roles:
        raise HTTPException(400, "Provide a list of roles")
    if len(roles) > 8:
        raise HTTPException(400, "Maximum 8 roles for skill extraction")

    return extract_trending_skills(roles)


@router.post("/recommendations-with-demand")
async def recommendations_with_demand(data: dict):
    """
    Convenience endpoint: get career recommendations already boosted by
    live market demand in a single call (REQ-21).
    Body: { "skills": [...], "interests": [...], "experience_years": 2 }
    """
    from services.recommendation.collaborative_api import get_collaborative_recommendations

    if not data.get("skills") and not data.get("interests"):
        raise HTTPException(400, "Provide at least skills or interests")

    results = get_collaborative_recommendations(
        user_profile=data,
        top_n=data.get("top_n", 5),
        boost_market_demand=True,
    )
    return {"recommendations": results}
