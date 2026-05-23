"""
Dashboard chart data service.
Prepares data structures ready for frontend charting.
"""


def build_match_chart(recommendations: list[dict]) -> dict:
    """Bar chart data: career titles vs match scores."""
    return {
        "type": "bar",
        "labels": [r["title"] for r in recommendations],
        "datasets": [
            {
                "label": "Match Score (%)",
                "data": [r["match_score"] for r in recommendations],
                "backgroundColor": [
                    "#4F46E5", "#7C3AED", "#2563EB", "#0891B2", "#059669"
                ][:len(recommendations)],
            }
        ],
    }


def build_skill_gap_chart(gap_analysis: dict) -> dict:
    """Doughnut chart: matched vs missing skills."""
    matched = len(gap_analysis.get("matched_skills", []))
    missing = len(gap_analysis.get("missing_skills", []))
    return {
        "type": "doughnut",
        "labels": ["Skills You Have", "Skills to Learn"],
        "datasets": [
            {
                "data": [matched, missing],
                "backgroundColor": ["#10B981", "#EF4444"],
            }
        ],
        "completion_pct": gap_analysis.get("completion_pct", 0),
    }


def build_skills_radar(user_skills: list[str], recommendations: list[dict]) -> dict:
    """Radar chart: user skill coverage across top career categories."""
    # Extract unique skill categories from top recommendations
    all_required = []
    for rec in recommendations[:3]:
        all_required.extend(rec.get("required_skills", [])[:5])

    categories = list(dict.fromkeys(all_required))[:8]  # unique, max 8
    user_lower = {s.lower() for s in user_skills}

    scores = []
    for cat in categories:
        has_skill = any(cat.lower() in u or u in cat.lower() for u in user_lower)
        scores.append(100 if has_skill else 0)

    return {
        "type": "radar",
        "labels": categories,
        "datasets": [
            {
                "label": "Your Skills",
                "data": scores,
                "backgroundColor": "rgba(79, 70, 229, 0.2)",
                "borderColor": "#4F46E5",
            }
        ],
    }


def build_dashboard_summary(recommendations: list[dict], gap_analysis: dict) -> dict:
    """Full dashboard data payload."""
    top_rec = recommendations[0] if recommendations else {}
    return {
        "top_match": {
            "title": top_rec.get("title", "N/A"),
            "score": top_rec.get("match_score", 0),
            "description": top_rec.get("description", ""),
        },
        "total_careers_analyzed": len(recommendations),
        "skill_completion": gap_analysis.get("completion_pct", 0),
        "skills_to_learn": len(gap_analysis.get("missing_skills", [])),
        "charts": {
            "match_scores": build_match_chart(recommendations),
            "skill_gap": build_skill_gap_chart(gap_analysis),
        },
    }
