from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil, os, uuid, datetime
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from resume_parser import extract_text_from_pdf, parse_resume_with_llm
from services.recommendation.recommendation_engine import recommend_careers

load_dotenv()

router = APIRouter(prefix="/api/resume", tags=["resume"])

UPLOAD_DIR = os.path.join(os.getcwd(), "temp_resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
_db_client = AsyncIOMotorClient(MONGO_URI)
_db = _db_client.career_recommender


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload PDF resume, parse with LLM, return recommendations."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files supported")

    file_id = str(uuid.uuid4())
    path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")

    try:
        with open(path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        raw_text = extract_text_from_pdf(path)
        if not raw_text.strip():
            raise HTTPException(400, "Could not extract text from PDF")

        parsed = parse_resume_with_llm(raw_text)
        recommendations = recommend_careers(parsed, top_n=5)

        doc = {
            "file_id": file_id,
            "filename": file.filename,
            "parsed_profile": parsed,
            "recommendations": recommendations,
            "timestamp": datetime.datetime.utcnow(),
        }
        await _db.resumes.insert_one(doc)
        os.remove(path)

        return {"id": file_id, "parsed_profile": parsed, "recommendations": recommendations}

    except Exception as e:
        if os.path.exists(path):
            os.remove(path)
        raise HTTPException(500, f"Error: {str(e)}")
