"""General-purpose helper utilities."""
from datetime import datetime
from bson import ObjectId


def mongo_doc_to_dict(doc: dict) -> dict:
    """Convert a MongoDB document to a JSON-serialisable dict."""
    if doc is None:
        return {}
    result = {}
    for k, v in doc.items():
        if k == "_id":
            result["id"] = str(v)
        elif isinstance(v, ObjectId):
            result[k] = str(v)
        elif isinstance(v, datetime):
            result[k] = v.isoformat()
        else:
            result[k] = v
    return result


def normalize_skill(skill: str) -> str:
    """Lowercase and strip a skill string for comparison."""
    return skill.strip().lower()


def skills_overlap(user_skills: list[str], required_skills: list[str]) -> float:
    """Return fraction of required skills the user already has (0.0–1.0)."""
    if not required_skills:
        return 0.0
    user_lower = {normalize_skill(s) for s in user_skills}
    matched = sum(
        1 for r in required_skills
        if any(normalize_skill(r) in u or u in normalize_skill(r) for u in user_lower)
    )
    return matched / len(required_skills)


def truncate(text: str, max_len: int = 200) -> str:
    """Truncate a string to max_len characters."""
    if not text:
        return ""
    return text[:max_len] + ("..." if len(text) > max_len else "")
