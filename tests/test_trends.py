"""Tests for trend analysis utilities."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from services.trends.trend_analyzer import get_salary_estimates


def test_salary_estimates_structure():
    # Uses Adzuna API — may return N/A if keys not set, but structure should be correct
    result = get_salary_estimates("Software Developer")
    assert "role" in result
    assert result["role"] == "Software Developer"
    assert "salary_min" in result
    assert "salary_max" in result
    assert "salary_avg" in result


def test_salary_estimates_no_crash_on_bad_role():
    result = get_salary_estimates("xyznonexistentrole12345")
    assert "role" in result
    # Should not raise, just return None values
    assert result["salary_avg"] is None or isinstance(result["salary_avg"], float)
