"""
Loads and processes O*NET database files into a career database.
Filtered to IT/Technology occupations only (SOC codes 11, 13, 15, 17, 19).

Fix A: prefix-based code matching so base codes (15-2051.00) correctly
       resolve to sub-codes (15-2051.01, 15-2051.02) in Skills/Knowledge/
       Abilities/Work Activities files.
Fix D: Abilities.txt is now loaded and merged into required_skills,
       giving richer signal per occupation.
"""
import os
import pandas as pd
from functools import lru_cache

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data")

# O*NET SOC code prefixes for IT/Tech-relevant occupations
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
    "19-1029",  # Bioinformatics / Life Scientists
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
    "statistician", "bioinformatics", "operations research",
]


def _load_tsv(filename: str) -> pd.DataFrame:
    path = os.path.join(DATA_DIR, filename)
    return pd.read_csv(path, sep="\t", encoding="utf-8", on_bad_lines="skip")


def _is_it_occupation(code: str, title: str) -> bool:
    """Return True if this occupation is IT/tech related."""
    for prefix in IT_SOC_PREFIXES:
        if code.startswith(prefix):
            return True
    title_lower = title.lower()
    for kw in IT_TITLE_KEYWORDS:
        if kw in title_lower:
            return True
    return False


def _build_prefix_map(df: pd.DataFrame, min_value: float = 2.5) -> dict[str, list[str]]:
    """
    FIX A — Build a two-level lookup from an O*NET attribute file:
      1. exact_map:  { "15-2051.00": [...], "15-2051.01": [...] }
      2. prefix_map: { "15-2051":    [...merged from all sub-codes...] }

    When resolving a code we try exact first, then 7-char prefix fallback.
    This fixes the mismatch where Occupation Data uses base codes (.00) but
    Skills/Knowledge/Abilities use specialisation sub-codes (.01, .02, ...).
    """
    if "Scale ID" not in df.columns or "Data Value" not in df.columns:
        # File has no scale column — just group as-is
        exact: dict[str, list[str]] = {}
        for code, group in df.groupby("O*NET-SOC Code"):
            exact[str(code)] = group["Element Name"].dropna().unique().tolist()
        prefix: dict[str, list[str]] = {}
        for code, names in exact.items():
            p = code[:7]
            prefix.setdefault(p, [])
            prefix[p].extend(names)
        return exact, prefix

    filtered = df[df["Scale ID"] == "IM"].copy()
    filtered["Data Value"] = pd.to_numeric(filtered["Data Value"], errors="coerce")
    filtered = filtered[filtered["Data Value"] >= min_value]

    exact: dict[str, list[str]] = {}
    for code, group in filtered.groupby("O*NET-SOC Code"):
        exact[str(code)] = group["Element Name"].dropna().unique().tolist()

    # Build prefix map by merging all sub-codes under the 7-char stem
    prefix: dict[str, list[str]] = {}
    for code, names in exact.items():
        p = code[:7]          # e.g. "15-2051"
        prefix.setdefault(p, [])
        prefix[p].extend(names)

    return exact, prefix


def _resolve(code: str, exact: dict, prefix: dict) -> list[str]:
    """
    Return element names for a given SOC code.
    Tries exact match first; falls back to 7-char prefix merge.
    """
    if code in exact:
        return exact[code]
    p = code[:7]
    return prefix.get(p, [])


@lru_cache(maxsize=1)
def load_career_database() -> list[dict]:
    """
    Build IT/Tech career database from O*NET files.
    Returns list of dicts with: title, onet_code, required_skills, description

    Sources merged per occupation:
      - Skills.txt       (cognitive / technical skills)
      - Knowledge.txt    (domain knowledge areas)
      - Work Activities.txt (task-level activities)
      - Abilities.txt    (Fix D: cognitive & physical abilities — adds richer signal)
    """
    print("Loading O*NET occupation data...")
    occupations = _load_tsv("Occupation Data.txt")

    print("Loading O*NET skills data...")
    skills_exact, skills_prefix = _build_prefix_map(_load_tsv("Skills.txt"))

    print("Loading O*NET knowledge data...")
    know_exact, know_prefix = _build_prefix_map(_load_tsv("Knowledge.txt"))

    print("Loading O*NET work activities data...")
    act_exact, act_prefix = _build_prefix_map(_load_tsv("Work Activities.txt"))

    # Fix D — load Abilities.txt (was unused before)
    print("Loading O*NET abilities data...")
    ab_exact, ab_prefix = _build_prefix_map(_load_tsv("Abilities.txt"))

    careers = []
    skipped = 0
    recovered = 0  # count of roles saved by prefix fallback

    for _, row in occupations.iterrows():
        code = str(row.get("O*NET-SOC Code", ""))
        title = str(row.get("Title", ""))
        description = str(row.get("Description", ""))

        if not _is_it_occupation(code, title):
            skipped += 1
            continue

        # Fix A — use prefix-aware resolver for all four sources
        was_exact = code in skills_exact
        combined = (
            _resolve(code, skills_exact, skills_prefix) +
            _resolve(code, know_exact,   know_prefix)   +
            _resolve(code, act_exact,    act_prefix)    +
            _resolve(code, ab_exact,     ab_prefix)     # Fix D
        )

        if not was_exact and combined:
            recovered += 1

        required_skills = list({s.lower() for s in combined if s})

        if not required_skills:
            continue

        careers.append({
            "title": title,
            "onet_code": code,
            "description": description,
            "required_skills": required_skills,
        })

    print(
        f"Loaded {len(careers)} IT/Tech occupations from O*NET "
        f"(skipped {skipped} non-IT, recovered {recovered} via prefix fallback)."
    )
    return careers
