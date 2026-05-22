"""Adzuna job market API client."""
import os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

load_dotenv()

_APP_ID = os.getenv("ADZUNA_APP_ID", "")
_API_KEY = os.getenv("ADZUNA_API_KEY", "")
_BASE_URL = "https://api.adzuna.com/v1/api/jobs"


def fetch_job_demand(job_title: str, country: str = "us") -> dict:
    """
    Fetch live job postings count and sample listings for a role.
    Returns a dict with open_positions and sample_jobs.
    """
    url = f"{_BASE_URL}/{country}/search/1"
    params = {
        "app_id": _APP_ID,
        "app_key": _API_KEY,
        "what": job_title,
        "results_per_page": 5,
        "content-type": "application/json",
    }
    try:
        resp = requests.get(url, params=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        return {
            "job_title": job_title,
            "open_positions": data.get("count", 0),
            "sample_jobs": [
                {
                    "title": j.get("title"),
                    "company": j.get("company", {}).get("display_name"),
                    "location": j.get("location", {}).get("display_name"),
                    "salary_min": j.get("salary_min"),
                    "salary_max": j.get("salary_max"),
                    "url": j.get("redirect_url"),
                }
                for j in data.get("results", [])[:5]
            ],
        }
    except Exception as e:
        return {
            "job_title": job_title,
            "open_positions": "N/A",
            "sample_jobs": [],
            "error": str(e),
        }


def fetch_demand_map(job_titles: list[str], country: str = "us", max_workers: int = 5) -> dict[str, int]:
    """
    Fetch open-position counts for multiple roles in parallel.
    Returns { title_lower: open_positions_int } — only includes roles
    where a valid integer count was returned.

    Used by the recommendation engine to boost high-demand careers (REQ-21).
    """
    demand: dict[str, int] = {}

    def _fetch(title: str) -> tuple[str, int]:
        result = fetch_job_demand(title, country)
        count = result.get("open_positions", "N/A")
        return title.lower(), count if isinstance(count, int) else 0

    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(_fetch, t): t for t in job_titles}
        for future in as_completed(futures):
            try:
                key, count = future.result()
                demand[key] = count
            except Exception:
                pass

    return demand
