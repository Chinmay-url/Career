from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil, os, uuid
from groq import Groq
from dotenv import load_dotenv

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

UPLOAD_DIR = "/tmp/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload PDF resume and get career recommendations."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files supported")
    
    file_id = str(uuid.uuid4())
    path = f"{UPLOAD_DIR}/{file_id}.pdf"
    
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    # Parse resume
    raw_text = extract_text_from_pdf(path)
    if not raw_text.strip():
        raise HTTPException(400, "Could not extract text from PDF")
    
    parsed = parse_resume_with_llm(raw_text)
    recommendations = recommend_careers(parsed, top_n=5)
    
    # Clean up
    os.remove(path)
    
    return {
        "parsed_profile": parsed,
        "recommendations": recommendations
    }

@app.post("/api/recommend-manual")
async def recommend_manual(data: dict):
    """Get recommendations from manually entered skills/interests."""
    # data: { skills: [], interests: [], education: "", experience_years: 0 }
    recommendations = recommend_careers(data, top_n=5)
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
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        max_tokens=400,
    )
    
    return {"advice": chat_completion.choices[0].message.content}

@app.get("/")
def root():
    return {"status": "Career Recommender API running"}
