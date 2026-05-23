"""
Collaborative filtering stub.
Currently returns content-based results from the recommendation engine.
Can be extended with user-based collaborative filtering once user data grows.
"""
from .recommendation_engine import recommend_careers
from .ranking import rerank_by_experience, rerank_by_market_demand, deduplicate
from ..trends.adzuna_client import fetch_demand_map


def get_collaborative_recommendations(
    user_profile: dict,
    top_n: int = 5,
    boost_market_demand: bool = True,
) -> list[dict]:
    """
    Get recommendations using a hybrid approach:
    1. Content-based: sentence-transformer cosine similarity (O*NET)
    2. Experience re-ranking: boost/penalise by seniority level
    3. Market-demand re-ranking: boost high-demand careers via Adzuna (REQ-21)
    4. Deduplication

    Returns top_n career matches, each with an optional market_demand field.
    """
    # Step 1: content-based recommendations (fetch extra buffer for re-ranking)
    recs = recommend_careers(user_profile, top_n=top_n * 3)

    # Step 2: re-rank by experience level
    exp = user_profile.get("experience_years", 0)
    try:
        exp = int(float(exp))
    except (TypeError, ValueError):
        exp = 0
    recs = rerank_by_experience(recs, exp)

    # Step 3: boost by live market demand (REQ-21)
    if boost_market_demand and recs:
        titles = [r["title"] for r in recs]
        demand_map = fetch_demand_map(titles)          # parallel Adzuna calls
        recs = rerank_by_market_demand(recs, demand_map)

    # Step 4: deduplicate and trim
    recs = deduplicate(recs)

    return recs[:top_n]
