"""Application configuration loaded from environment variables."""
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB
MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME: str = os.getenv("DB_NAME", "career_recommender")

# Groq LLM
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# Adzuna
ADZUNA_APP_ID: str = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_API_KEY: str = os.getenv("ADZUNA_API_KEY", "")

# JWT Auth
SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production-super-secret-key")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# File uploads
UPLOAD_DIR: str = os.path.join(os.path.dirname(__file__), "..", "uploads", "resumes")
MAX_UPLOAD_SIZE_MB: int = 10

# App
DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
APP_TITLE: str = "AI Career Path Recommender"
APP_VERSION: str = "1.0.0"
