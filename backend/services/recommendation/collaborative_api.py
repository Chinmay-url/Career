"""
Collaborative filtering stub.
Currently returns content-based results from the recommendation engine.
Can be extended with user-based collaborative filtering once user data grows.
"""
from .recommendation_engine import recommend_careers
from .ranking import rerank_by_experience, deduplicate


def get_collaborative_recommendations(
    user_profile: dict,
    top_n: int = 5,
) -> list[dict]:
    """
    Get recommendations using a hybrid approach:
    1. Content-based: sentence-transformer cosine similarity (O*NET)
    2. Experience re-ranking: boost/penalise by seniority level
    3. Deduplication

    Returns top_n career matches.
    """
    # Step 1: content-based recommendations
    recs = recommend_careers(user_profile, top_n=top_n * 2)

    # Step 2: re-rank by experience level
    exp = user_profile.get("experience_years", 0)
    try:
        exp = int(float(exp))
    except (TypeError, ValueError):
        exp = 0

    recs = rerank_by_experience(recs, exp)

    # Step 3: deduplicate and trim
    recs = deduplicate(recs)

    return recs[:top_n]
