"""
Core recommendation engine using sentence-transformers + cosine similarity
against the IT/Tech O*NET career database.
Embeds career title + description + skills for richer matching.
"""
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
from .onet_loader import load_career_database

print("Loading embedding model...")
_embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def _embed(text: str) -> np.ndarray:
    return _embedder.encode([text])[0]


@lru_cache(maxsize=1)
def _get_career_embeddings() -> tuple[list[dict], np.ndarray]:
    """
    Pre-compute embeddings for all IT careers.
    Embeds: title + description + top skills for richer semantic matching.
    Cached after first call.
    """
    careers = load_career_database()
    print(f"Pre-computing embeddings for {len(careers)} IT/Tech careers...")

    texts = []
    for c in careers:
        # Combine title + description + skills so the embedding captures
        # the full semantic meaning of the role, not just generic skill words
        skills_text = ", ".join(c["required_skills"][:20])
        combined = f"{c['title']}. {c.get('description', '')[:150]}. Skills: {skills_text}"
        texts.append(combined)

    embeddings = _embedder.encode(texts, batch_size=64, show_progress_bar=True)
    print("Embeddings ready.")
    return careers, embeddings


def recommend_careers(parsed_profile: dict, top_n: int = 5) -> list[dict]:
    """
    Match user profile against IT/Tech O*NET careers using cosine similarity.
    Returns top_n matches with skill gap analysis.
    """
    user_skills = parsed_profile.get("skills", [])
    user_interests = parsed_profile.get("interests", [])
    all_skills = list(set(user_skills + user_interests))

    if not all_skills:
        return []

    # Build a rich user query: skills + any inferred role context
    user_text = "Software developer with skills in: " + ", ".join(all_skills)
    user_vec = _embed(user_text).reshape(1, -1)

    careers, career_embeddings = _get_career_embeddings()
    scores = cosine_similarity(user_vec, career_embeddings)[0]

    # Get top candidates (3x buffer for dedup)
    top_indices = np.argsort(scores)[::-1][:top_n * 3]

    results = []
    seen_titles = set()

    for idx in top_indices:
        career = careers[idx]
        title = career["title"]

        if title in seen_titles:
            continue
        seen_titles.add(title)

        match_score = float(scores[idx])
        skill_gap = _compute_skill_gap(user_skills, career["required_skills"])
        matched = _compute_matched(user_skills, career["required_skills"])

        results.append({
            "title": title,
            "onet_code": career["onet_code"],
            "description": career.get("description", "")[:200],
            "match_score": round(match_score * 100, 1),
            "skill_gap": skill_gap[:8],
            "matched_skills": matched[:6],
            "required_skills": career["required_skills"][:10],
        })

        if len(results) >= top_n:
            break

    return results


def _compute_skill_gap(user_skills: list[str], required_skills: list[str]) -> list[str]:
    """Find required skills the user is missing."""
    user_lower = {s.lower() for s in user_skills}
    gaps = []
    for req in required_skills:
        req_lower = req.lower()
        if not any(req_lower in u or u in req_lower for u in user_lower):
            gaps.append(req)
    return gaps


def _compute_matched(user_skills: list[str], required_skills: list[str]) -> list[str]:
    """Find required skills the user already has."""
    user_lower = {s.lower() for s in user_skills}
    matched = []
    for req in required_skills:
        req_lower = req.lower()
        if any(req_lower in u or u in req_lower for u in user_lower):
            matched.append(req)
    return matched
