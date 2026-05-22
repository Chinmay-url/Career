"""Trend Pydantic models."""
from pydantic import BaseModel
from typing import List, Optional


class SampleJob(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None


class TrendResponse(BaseModel):
    job_title: str
    open_positions: int | str
    sample_jobs: List[SampleJob] = []
    error: Optional[str] = None
