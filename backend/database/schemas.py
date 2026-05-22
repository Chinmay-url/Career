"""Pydantic schemas for MongoDB document validation."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class UserSchema(BaseModel):
    name: str
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True


class ResumeSchema(BaseModel):
    file_id: str
    user_id: Optional[str] = None
    filename: str
    parsed_profile: dict
    recommendations: list
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class RecommendationSchema(BaseModel):
    user_id: Optional[str] = None
    skills: List[str]
    interests: List[str]
    results: list
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AdviceLogSchema(BaseModel):
    user_id: Optional[str] = None
    role: str
    gap: List[str]
    advice: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
