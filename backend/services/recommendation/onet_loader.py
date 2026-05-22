"""
Loads and processes O*NET database files into a career database.
Filtered to IT/Technology occupations only (SOC codes 11, 13, 15, 17, 19).
"""
import os
import pandas as pd
from functools import lru_cache

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data")

# O*NET SOC code prefixes for IT/Tech-relevant occupations
# 11-3  = Computer/IT Managers
# 13-1  = Management Analysts, Project Managers
# 15-   = Computer and Mathematical (ALL IT jobs live here)
# 17-2  = Engineers (Software, Electrical, Computer Hardware)
# 17-3  = Engineering Technicians
# 19-4  = Life/Physical/Social Science Technicians (Data Science adjacent)
IT_SOC_PREFIXES = (
    "11-3021",  # Computer and Information Systems Managers
    "11-3031",  # Financial Managers (data/analytics)
    "13-1111",  # Management Analysts
    "13-1161",  # Market Research Analysts
    "13-1199",  # Business Operations Specialists
    "15-",      # ALL Computer and Mathematical Occupations
    "17-2061",  # Computer Hardware Engineers
    "17-2071",  # Electrical Engineers
    "17-2072",  # Electronics Engineers
    "17-2112",  # Industrial Engineers
    "17-2141",  # Mechanical Engineers (robotics/automation)
    "17-3023",  # Electrical and Electronics Engineering Technologists
    "17-3024",  # Electro-Mechanical and Mechatronics Technologists
    "19-4041",  # Geological and Hydrological Technicians
    "43-9011",  # Computer Operators
    "43-9021",  # Data Entry Keyers
)

# Additional IT-related keywords to catch any missed titles
IT_TITLE_KEYWORDS = [
    "software", "developer", "engineer", "programmer", "data", "database",
    "network", "cyber", "security", "cloud", "devops", "machine learning",
    "artificial intelligence", "ai ", " ai", "analyst", "architect",
    "systems", "computer", "information technology", "it ", " it",
    "web", "mobile", "frontend", "backend", "full stack", "fullstack",
    "infrastructure", "platform", "sre", "reliability", "automation",
    "robotics", "embedded", "firmware", "hardware", "semiconductor",
    "blockchain", "iot", "internet of things", "quantum", "nlp",
    "deep learning", "neural", "algorithm", "api", "microservices",
    "kubernetes", "docker", "linux", "unix", "python", "java", "javascript",
    "product manager", "scrum", "agile", "technical", "digital",
    "telecommunications", "telecom", "wireless", "satellite",
]


def _load_tsv(filename: str) -> pd.DataFrame:
    path = os.path.join(DATA_DIR, filename)
    return pd.read_csv(path, sep="\t", encoding="utf-8", on_bad_lines="skip")


def _is_it_occupation(code: str, title: str) -> bool:
    """Return True if this occupation is IT/tech related."""
    # Check SOC code prefix
    for prefix in IT_SOC_PREFIXES:
        if code.startswith(prefix):
            return True
    # Check title keywords
    title_lower = title.lower()
    for kw in IT_TITLE_KEYWORDS:
        if kw in title_lower:
            return True
    return False


@lru_cache(maxsize=1)
def load_career_database() -> list[dict]:
    """
    Build IT/Tech career database from O*NET files.
    Returns list of dicts with: title, onet_code, required_skills, description
    """
    print("Loading O*NET occupation data...")
    occupations = _load_tsv("Occupation Data.txt")

    print("Loading O*NET skills data...")
    skills_df = _load_tsv("Skills.txt")

    print("Loading O*NET knowledge data...")
    knowledge_df = _load_tsv("Knowledge.txt")

    print("Loading O*NET work activities data...")
    activities_df = _load_tsv("Work Activities.txt")

    # Filter to importance scale (IM) and high importance (>= 2.5)
    def get_top_elements(df: pd.DataFrame, min_value: float = 2.5) -> dict:
        if "Scale ID" in df.columns and "Data Value" in df.columns:
            filtered = df[df["Scale ID"] == "IM"].copy()
            filtered["Data Value"] = pd.to_numeric(filtered["Data Value"], errors="coerce")
            filtered = filtered[filtered["Data Value"] >= min_value]
        else:
            filtered = df.copy()
        result = {}
        for code, group in filtered.groupby("O*NET-SOC Code"):
            result[code] = group["Element Name"].dropna().unique().tolist()
        return result

    skills_map = get_top_elements(skills_df)
    knowledge_map = get_top_elements(knowledge_df)
    activities_map = get_top_elements(activities_df)

    careers = []
    skipped = 0

    for _, row in occupations.iterrows():
        code = str(row.get("O*NET-SOC Code", ""))
        title = str(row.get("Title", ""))
        description = str(row.get("Description", ""))

        # ── FILTER: IT/Tech only ──────────────────────────────────────────
        if not _is_it_occupation(code, title):
            skipped += 1
            continue

        # Combine skills + knowledge + activities
        combined = (
            skills_map.get(code, []) +
            knowledge_map.get(code, []) +
            activities_map.get(code, [])
        )
        required_skills = list({s.lower() for s in combined if s})

        if not required_skills:
            continue

        careers.append({
            "title": title,
            "onet_code": code,
            "description": description,
            "required_skills": required_skills,
        })

    print(f"Loaded {len(careers)} IT/Tech occupations from O*NET (skipped {skipped} non-IT).")
    return careers
