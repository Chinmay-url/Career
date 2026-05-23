"""Recommendation Pydantic models."""
from pydantic import BaseModel
from typing import List, Optional


class RecommendationRequest(BaseModel):
    skills: List[str] = []
    interests: List[str] = []
    top_n: int = 5


class CareerMatch(BaseModel):
    title: str
    onet_code: str
    description: str
    match_score: float
    skill_gap: List[str]
    matched_skills: List[str] = []
    required_skills: List[str]


class RecommendationResponse(BaseModel):
    recommendations: List[CareerMatch]
