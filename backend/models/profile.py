"""Profile Pydantic models."""
from pydantic import BaseModel
from typing import List, Optional


class SkillGapRequest(BaseModel):
    skills: List[str]
    target_role: str


class LearningPathRequest(BaseModel):
    skill_gaps: List[str]
    target_role: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    current_role: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    experience_years: Optional[int] = None
