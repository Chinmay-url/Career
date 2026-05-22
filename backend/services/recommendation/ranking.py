"""Re-ranking utilities to boost or penalise career matches."""


def rerank_by_experience(
    recommendations: list[dict],
    experience_years: int,
) -> list[dict]:
    """
    Adjust match scores based on the user's experience level.
    Entry-level roles get a boost for freshers; senior roles for experienced users.
    """
    ENTRY_KEYWORDS = {"junior", "entry", "associate", "intern", "trainee", "fresher"}
    SENIOR_KEYWORDS = {"senior", "lead", "principal", "staff", "architect", "manager", "director"}

    for rec in recommendations:
        title_lower = rec["title"].lower()
        boost = 0.0

        if experience_years <= 1:
            if any(kw in title_lower for kw in ENTRY_KEYWORDS):
                boost = 5.0
            elif any(kw in title_lower for kw in SENIOR_KEYWORDS):
                boost = -5.0
        elif experience_years >= 5:
            if any(kw in title_lower for kw in SENIOR_KEYWORDS):
                boost = 5.0
            elif any(kw in title_lower for kw in ENTRY_KEYWORDS):
                boost = -3.0

        rec["match_score"] = round(min(100.0, max(0.0, rec["match_score"] + boost)), 1)

    return sorted(recommendations, key=lambda r: r["match_score"], reverse=True)


def rerank_by_skill_coverage(recommendations: list[dict]) -> list[dict]:
    """
    Secondary sort: among equal match scores, prefer roles with fewer skill gaps
    (i.e. the user is closer to being fully qualified).
    """
    return sorted(
        recommendations,
        key=lambda r: (
            -r.get("match_score", 0),
            len(r.get("skill_gap", [])),
        ),
    )


def deduplicate(recommendations: list[dict]) -> list[dict]:
    """Remove duplicate career titles, keeping the highest-scoring entry."""
    seen: set[str] = set()
    unique = []
    for rec in recommendations:
        title = rec["title"].lower()
        if title not in seen:
            seen.add(title)
            unique.append(rec)
    return unique
