from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os, datetime
from groq import Groq
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

# Import route routers
from routes.recommendation_routes import router as recommendation_router
from routes.resume_routes import router as resume_router
from routes.dashboard_routes import router as dashboard_router
from routes.trend_routes import router as trend_router
from routes.profile_routes import router as profile_router
from routes.auth_routes import router as auth_router

app = FastAPI(title="AI Career Path Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route routers
app.include_router(recommendation_router)
app.include_router(resume_router)
app.include_router(dashboard_router)
app.include_router(trend_router)
app.include_router(profile_router)
app.include_router(auth_router)

# Serve built frontend assets when available.
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
frontend_dist_path = os.path.join(frontend_path, "dist")
frontend_assets_path = os.path.join(frontend_dist_path, "assets")
if os.path.exists(frontend_assets_path):
    app.mount("/assets", StaticFiles(directory=frontend_assets_path), name="assets")

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client_db = AsyncIOMotorClient(MONGO_URI)
db = client_db.career_recommender

client_groq = Groq(api_key=os.getenv("GROQ_API_KEY"))


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
    """Serve the frontend index.html"""
    frontend_index = os.path.join(frontend_dist_path, "index.html")
    if os.path.exists(frontend_index):
        return FileResponse(frontend_index)

    frontend_index = os.path.join(frontend_path, "index.html")
    if os.path.exists(frontend_index):
        return FileResponse(frontend_index)
    return {"status": "Career Recommender API running with MongoDB integration"}


@app.get("/api")
async def api_root():
    return {"status": "Career Recommender API running with MongoDB integration"}
