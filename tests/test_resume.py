"""Tests for resume parsing utilities."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from services.resume.formatter import format_parsed_profile


def test_format_parsed_profile_full():
    raw = {
        "name": "  John Doe  ",
        "skills": ["Python", "SQL", "  "],
        "experience_years": "3",
        "education": "B.Tech Computer Science",
        "current_role": "Software Engineer",
        "industries": ["Technology"],
        "interests": ["Machine Learning"],
    }
    result = format_parsed_profile(raw)
    assert result["name"] == "John Doe"
    assert "Python" in result["skills"]
    assert "" not in result["skills"]
    assert result["experience_years"] == 3


def test_format_parsed_profile_missing_fields():
    result = format_parsed_profile({})
    assert result["name"] == "Unknown"
    assert result["skills"] == []
    assert result["experience_years"] == 0
    assert result["education"] == "Not specified"


def test_format_parsed_profile_bad_experience():
    result = format_parsed_profile({"experience_years": "N/A"})
    assert result["experience_years"] == 0


def test_format_parsed_profile_skills_not_list():
    result = format_parsed_profile({"skills": "Python, SQL"})
    assert result["skills"] == []
