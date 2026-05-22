"""
Skill gap analysis service.
Compares user skills against a target career's required skills.
"""
from ..recommendation.onet_loader import load_career_database


def analyze_skill_gap(user_skills: list[str], target_role: str) -> dict:
    """
    Find skill gaps between user and a target role from O*NET.
    Returns matched skills, missing skills, and a completion percentage.
    """
    careers = load_career_database()
    user_lower = {s.lower() for s in user_skills}

    # Find best matching career by title
    target_lower = target_role.lower()
    matched_career = None
    for career in careers:
        if target_lower in career["title"].lower() or career["title"].lower() in target_lower:
            matched_career = career
            break

    if not matched_career:
        # Fuzzy fallback: find career with most word overlap
        target_words = set(target_lower.split())
        best_score = 0
        for career in careers:
            title_words = set(career["title"].lower().split())
            overlap = len(target_words & title_words)
            if overlap > best_score:
                best_score = overlap
                matched_career = career

    if not matched_career:
        return {
            "target_role": target_role,
            "error": "Career not found in O*NET database",
            "matched_skills": [],
            "missing_skills": [],
            "completion_pct": 0,
        }

    required = matched_career["required_skills"]
    matched = []
    missing = []

    for skill in required:
        skill_lower = skill.lower()
        if any(skill_lower in u or u in skill_lower for u in user_lower):
            matched.append(skill)
        else:
            missing.append(skill)

    total = len(required)
    completion_pct = round(len(matched) / total * 100, 1) if total > 0 else 0

    return {
        "target_role": matched_career["title"],
        "onet_code": matched_career["onet_code"],
        "matched_skills": matched,
        "missing_skills": missing[:15],  # top 15 gaps
        "completion_pct": completion_pct,
        "total_required": total,
    }
