"""Tests for the recommendation engine and O*NET loader."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from services.recommendation.onet_loader import load_career_database
from services.recommendation.recommendation_engine import recommend_careers


def test_onet_loads_it_careers():
    careers = load_career_database()
    assert len(careers) > 10, "Should load at least 10 IT careers"
    titles = [c["title"] for c in careers]
    # Should contain well-known IT roles
    it_keywords = ["software", "data", "computer", "network", "developer", "engineer"]
    found = any(
        any(kw in t.lower() for kw in it_keywords)
        for t in titles
    )
    assert found, "Should contain IT-related career titles"


def test_onet_no_non_it_careers():
    careers = load_career_database()
    titles = [c["title"].lower() for c in careers]
    non_it = ["astronomer", "farmer", "nurse", "chef", "plumber"]
    for bad in non_it:
        assert bad not in titles, f"Non-IT career '{bad}' should not be in results"


def test_recommend_python_skills():
    profile = {"skills": ["Python", "NumPy", "Pandas", "Machine Learning"]}
    recs = recommend_careers(profile, top_n=5)
    assert len(recs) > 0, "Should return recommendations"
    titles = [r["title"].lower() for r in recs]
    it_keywords = ["data", "software", "machine", "computer", "analyst", "developer", "engineer"]
    found = any(any(kw in t for kw in it_keywords) for t in titles)
    assert found, f"Expected IT roles, got: {[r['title'] for r in recs]}"


def test_recommend_returns_required_fields():
    profile = {"skills": ["Python", "SQL"]}
    recs = recommend_careers(profile, top_n=3)
    for rec in recs:
        assert "title" in rec
        assert "onet_code" in rec
        assert "match_score" in rec
        assert "skill_gap" in rec
        assert 0 <= rec["match_score"] <= 100


def test_recommend_empty_skills():
    recs = recommend_careers({"skills": []}, top_n=5)
    assert recs == [], "Empty skills should return empty list"
