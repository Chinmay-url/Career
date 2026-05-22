"""
Loads and processes O*NET database files into a career database.
Files used: Occupation Data.txt, Skills.txt, Knowledge.txt, Work Activities.txt
"""
import os
import pandas as pd
from functools import lru_cache

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data")


def _load_tsv(filename: str) -> pd.DataFrame:
    path = os.path.join(DATA_DIR, filename)
    return pd.read_csv(path, sep="\t", encoding="utf-8", on_bad_lines="skip")


@lru_cache(maxsize=1)
def load_career_database() -> list[dict]:
    """
    Build career database from O*NET files.
    Returns list of dicts with: title, onet_code, required_skills, description
    """
    print("Loading O*NET occupation data...")
    occupations = _load_tsv("Occupation Data.txt")
    # columns: O*NET-SOC Code, Title, Description

    print("Loading O*NET skills data...")
    skills_df = _load_tsv("Skills.txt")
    # columns: O*NET-SOC Code, Element ID, Element Name, Scale ID, Data Value, ...

    print("Loading O*NET knowledge data...")
    knowledge_df = _load_tsv("Knowledge.txt")

    print("Loading O*NET work activities data...")
    activities_df = _load_tsv("Work Activities.txt")

    # Filter to importance scale (IM) and high importance (>= 3.0)
    def get_top_elements(df: pd.DataFrame, min_value: float = 3.0) -> dict:
        """Group elements by occupation, return top items per occupation."""
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
    for _, row in occupations.iterrows():
        code = row.get("O*NET-SOC Code", "")
        title = row.get("Title", "")
        description = row.get("Description", "")

        # Combine skills + knowledge + activities as "required skills"
        combined = (
            skills_map.get(code, []) +
            knowledge_map.get(code, []) +
            activities_map.get(code, [])
        )
        # Deduplicate and lowercase
        required_skills = list({s.lower() for s in combined if s})

        if not required_skills:
            continue  # skip occupations with no skill data

        careers.append({
            "title": title,
            "onet_code": code,
            "description": description,
            "required_skills": required_skills,
        })

    print(f"Loaded {len(careers)} occupations from O*NET.")
    return careers
