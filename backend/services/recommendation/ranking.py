"""Re-ranking utilities to boost or penalise career matches."""

import math


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


def rerank_by_market_demand(
    recommendations: list[dict],
    demand_map: dict[str, int],
    max_boost: float = 8.0,
) -> list[dict]:
    """
    Boost match scores using live Adzuna open-position counts (REQ-21).

    demand_map: { career_title_lower: open_positions_count }
    Boost is log-scaled so a role with 50k postings doesn't dwarf one with 5k.
    Max boost is capped at max_boost points.

    Also attaches market_demand metadata to each recommendation.
    """
    if not demand_map:
        return recommendations

    # Normalise: find the max count across all fetched roles for scaling
    max_count = max((v for v in demand_map.values() if isinstance(v, int)), default=1)
    if max_count == 0:
        max_count = 1

    for rec in recommendations:
        title_lower = rec["title"].lower()

        # Try exact match first, then partial match
        count = demand_map.get(title_lower)
        if count is None:
            for key, val in demand_map.items():
                if key in title_lower or title_lower in key:
                    count = val
                    break

        if count is None or not isinstance(count, int):
            rec.setdefault("market_demand", {"open_positions": "N/A", "demand_boost": 0})
            continue

        # Log-scale boost: log(count+1) / log(max+1) * max_boost
        boost = round((math.log(count + 1) / math.log(max_count + 1)) * max_boost, 2)
        rec["match_score"] = round(min(100.0, max(0.0, rec["match_score"] + boost)), 1)
        rec["market_demand"] = {
            "open_positions": count,
            "demand_boost": boost,
        }

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
