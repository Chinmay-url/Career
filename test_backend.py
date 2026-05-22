#!/usr/bin/env python3
"""
Quick test script to verify backend services work correctly.
Run from project root: python test_backend.py
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))

print("=" * 60)
print("Testing O*NET Career Recommender Backend")
print("=" * 60)

# Test 1: Load O*NET data
print("\n[1] Loading O*NET career database...")
try:
    from services.recommendation.onet_loader import load_career_database
    careers = load_career_database()
    print(f"✓ Loaded {len(careers)} careers from O*NET")
    if careers:
        print(f"  Sample: {careers[0]['title']} ({careers[0]['onet_code']})")
except Exception as e:
    print(f"✗ Error loading O*NET data: {e}")
    sys.exit(1)

# Test 2: Test recommendation engine
print("\n[2] Testing recommendation engine...")
try:
    from services.recommendation.recommendation_engine import recommend_careers
    test_profile = {
        "skills": ["python", "machine learning", "data analysis", "sql"],
        "interests": ["AI", "data science"]
    }
    recommendations = recommend_careers(test_profile, top_n=3)
    print(f"✓ Got {len(recommendations)} recommendations")
    for i, rec in enumerate(recommendations, 1):
        print(f"  {i}. {rec['title']} (Match: {rec['match_score']}%)")
except Exception as e:
    print(f"✗ Error in recommendation engine: {e}")
    sys.exit(1)

# Test 3: Test skill gap analysis
print("\n[3] Testing skill gap analysis...")
try:
    from services.skill_gap.gap_analysis import analyze_skill_gap
    gap = analyze_skill_gap(
        ["python", "sql"],
        "Data Scientist"
    )
    print(f"✓ Skill gap analysis complete")
    print(f"  Matched: {len(gap.get('matched_skills', []))} skills")
    print(f"  Missing: {len(gap.get('missing_skills', []))} skills")
    print(f"  Completion: {gap.get('completion_pct', 0)}%")
except Exception as e:
    print(f"✗ Error in skill gap analysis: {e}")
    sys.exit(1)

# Test 4: Test dashboard chart data
print("\n[4] Testing dashboard chart data...")
try:
    from services.dashboard.chart_data import build_dashboard_summary, build_skills_radar
    summary = build_dashboard_summary(recommendations, gap)
    print(f"✓ Dashboard summary created")
    print(f"  Top match: {summary['top_match']['title']}")
    print(f"  Skill completion: {summary['skill_completion']}%")
except Exception as e:
    print(f"✗ Error building dashboard: {e}")
    sys.exit(1)

# Test 5: Test FastAPI app startup
print("\n[5] Testing FastAPI app startup...")
try:
    from app import app
    print(f"✓ FastAPI app initialized successfully")
    print(f"  Routes registered: {len(app.routes)}")
except Exception as e:
    print(f"✗ Error initializing FastAPI app: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✓ All tests passed! Backend is ready.")
print("=" * 60)
print("\nTo start the server, run:")
print("  cd backend")
print("  uvicorn app:app --reload --host 0.0.0.0 --port 8000")
