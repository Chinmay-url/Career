import requests
import os
from dotenv import load_dotenv

load_dotenv()

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "your_app_id")
ADZUNA_API_KEY = os.getenv("ADZUNA_API_KEY", "your_api_key")

def get_job_demand(job_title: str, country: str = "us") -> dict:
    """Fetch real-time job postings count for a role."""
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_API_KEY,
        "what": job_title,
        "results_per_page": 5
    }
    try:
        res = requests.get(url, params=params, timeout=5)
        data = res.json()
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
                }
                for j in data.get("results", [])[:3]
            ]
        }
    except Exception as e:
        return {"job_title": job_title, "open_positions": "N/A", "sample_jobs": [], "error": str(e)}

def get_onet_career_info(keyword: str) -> list:
    """Fetch career info from O*NET (no auth needed for basic search)."""
    url = "https://services.onetcenter.org/ws/online/search"
    params = {"keyword": keyword, "end": 5}
    headers = {"Accept": "application/json"}
    try:
        res = requests.get(url, params=params, headers=headers, timeout=5)
        data = res.json()
        return data.get("occupation", [])
    except:
        return []
