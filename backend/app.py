from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil, os, uuid, datetime
from groq import Groq
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

from resume_parser import extract_text_from_pdf, parse_resume_with_llm
from recommender import recommend_careers
from market_trends import get_job_demand

app = FastAPI(title="AI Career Path Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use a local temp directory for Windows compatibility
UPLOAD_DIR = os.path.join(os.getcwd(), "temp_resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client_db = AsyncIOMotorClient(MONGO_URI)
db = client_db.career_recommender
resumes_collection = db.resumes

client_groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload PDF resume, parse with LLM, and save to MongoDB."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files supported")
    
    file_id = str(uuid.uuid4())
    path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    try:
        with open(path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # Parse resume
        raw_text = extract_text_from_pdf(path)
        if not raw_text.strip():
            raise HTTPException(400, "Could not extract text from PDF")
        
        parsed = parse_resume_with_llm(raw_text)
        recommendations = recommend_careers(parsed, top_n=5)
        
        # Save to MongoDB
        resume_doc = {
            "file_id": file_id,
            "filename": file.filename,
            "parsed_profile": parsed,
            "recommendations": recommendations,
            "timestamp": datetime.datetime.utcnow()
        }
        await resumes_collection.insert_one(resume_doc)
        
        # Clean up local file
        os.remove(path)
        
        return {
            "id": file_id,
            "parsed_profile": parsed,
            "recommendations": recommendations
        }
    except Exception as e:
        if os.path.exists(path):
            os.remove(path)
        raise HTTPException(500, f"Internal Server Error: {str(e)}")

@app.post("/api/recommend-manual")
async def recommend_manual(data: dict):
    """Get recommendations from manually entered skills/interests and save to MongoDB."""
    recommendations = recommend_careers(data, top_n=5)
    
    # Save search to MongoDB
    search_doc = {
        "type": "manual_entry",
        "profile": data,
        "recommendations": recommendations,
        "timestamp": datetime.datetime.utcnow()
    }
    await db.manual_searches.insert_one(search_doc)
    
    return {"recommendations": recommendations}

@app.get("/api/job-market/{role}")
async def job_market(role: str):
    """Get real-time job market data for a role."""
    return get_job_demand(role)

@app.post("/api/career-advice")
async def career_advice(data: dict):
    """Use Groq to generate personalized career advice."""
    role = data.get("target_role", "")
    skills = data.get("current_skills", [])
    gap = data.get("skill_gap", [])
    
    prompt = f"""
    A professional wants to transition to: {role}
    Their current skills: {', '.join(skills)}
    Their skill gaps: {', '.join(gap)}
    
    Give a concise 3-step action plan with:
    1. Top 2 free resources to learn missing skills
    2. A realistic timeline
    3. One networking tip
    
    Be specific and encouraging. Max 200 words.
    """
    
    chat_completion = client_groq.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        max_tokens=400,
    )
    
    advice = chat_completion.choices[0].message.content
    
    # Optional: Log advice request to MongoDB
    await db.advice_logs.insert_one({
        "role": role,
        "gap": gap,
        "advice": advice,
        "timestamp": datetime.datetime.utcnow()
    })
    
    return {"advice": advice}

@app.get("/")
async def root():
    return {"status": "Career Recommender API running with MongoDB integration"}
