"""Format parsed resume data for API responses."""


def format_parsed_profile(raw: dict) -> dict:
    """
    Normalise and clean a raw parsed profile dict from the LLM.
    Ensures all expected keys exist with sensible defaults.
    """
    return {
        "name": str(raw.get("name", "Unknown")).strip(),
        "skills": _clean_list(raw.get("skills", [])),
        "experience_years": _safe_int(raw.get("experience_years", 0)),
        "education": str(raw.get("education", "Not specified")).strip(),
        "current_role": str(raw.get("current_role", "Not specified")).strip(),
        "industries": _clean_list(raw.get("industries", [])),
        "interests": _clean_list(raw.get("interests", [])),
    }


def _clean_list(value) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(v).strip() for v in value if str(v).strip()]


def _safe_int(value) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0
