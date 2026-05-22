from fastapi import APIRouter
from market_trends import get_job_demand

router = APIRouter(prefix="/api/trends", tags=["trends"])


@router.get("/{role}")
async def job_market(role: str):
    """Get real-time job market data for a role via Adzuna."""
    return get_job_demand(role)
