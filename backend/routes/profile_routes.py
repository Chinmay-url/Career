from fastapi import APIRouter, HTTPException
from services.skill_gap.gap_analysis import analyze_skill_gap
from services.skill_gap.learning_recommender import recommend_learning_resources

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("/skill-gap")
async def skill_gap(data: dict):
    """Analyze skill gap for a target role."""
    skills = data.get("skills", [])
    target_role = data.get("target_role", "")
    if not target_role:
        raise HTTPException(400, "target_role is required")
    return analyze_skill_gap(skills, target_role)


@router.post("/learning-path")
async def learning_path(data: dict):
    """Get learning resources for skill gaps."""
    skill_gaps = data.get("skill_gaps", [])
    target_role = data.get("target_role", "")
    if not target_role:
        raise HTTPException(400, "target_role is required")
    return recommend_learning_resources(skill_gaps, target_role)
