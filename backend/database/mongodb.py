"""MongoDB async client — single shared instance for the whole app."""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config.settings import MONGO_URI, DB_NAME

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URI)
    return _client


def get_db() -> AsyncIOMotorDatabase:
    return get_client()[DB_NAME]


# Convenience collection accessors
def users_col():
    return get_db()["users"]

def resumes_col():
    return get_db()["resumes"]

def recommendations_col():
    return get_db()["recommendations"]

def advice_logs_col():
    return get_db()["advice_logs"]

def manual_searches_col():
    return get_db()["manual_searches"]
