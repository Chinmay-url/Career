"""Trend analysis — aggregates Adzuna data into chart-ready structures."""
from .adzuna_client import fetch_job_demand


def analyze_trends_for_roles(roles: list[str]) -> dict:
    """
    Fetch job demand for multiple roles and return chart-ready data.
    """
    results = []
    for role in roles:
        data = fetch_job_demand(role)
        count = data.get("open_positions", 0)
        results.append({
            "role": role,
            "open_positions": count if isinstance(count, int) else 0,
            "sample_jobs": data.get("sample_jobs", []),
        })

    return {
        "roles": [r["role"] for r in results],
        "open_positions": [r["open_positions"] for r in results],
        "details": results,
        "chart": {
            "type": "bar",
            "labels": [r["role"] for r in results],
            "datasets": [{
                "label": "Open Positions",
                "data": [r["open_positions"] for r in results],
                "backgroundColor": "#534AB7",
                "borderRadius": 6,
            }],
        },
    }


def get_salary_estimates(role: str) -> dict:
    """
    Extract salary range from Adzuna sample jobs for a role.
    Returns min, max, and average salary estimates.
    """
    data = fetch_job_demand(role)
    jobs = data.get("sample_jobs", [])

    salaries = [
        j["salary_min"] for j in jobs if j.get("salary_min")
    ] + [
        j["salary_max"] for j in jobs if j.get("salary_max")
    ]

    if not salaries:
        return {"role": role, "salary_min": None, "salary_max": None, "salary_avg": None}

    return {
        "role": role,
        "salary_min": min(salaries),
        "salary_max": max(salaries),
        "salary_avg": round(sum(salaries) / len(salaries), 2),
    }
