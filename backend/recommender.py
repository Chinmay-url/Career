import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Pre-defined career database (extend this with O*NET API data)
CAREER_DATABASE = [
    {
        "title": "Data Scientist",
        "required_skills": ["python", "machine learning", "statistics", "sql", "data analysis"],
        "avg_salary": 115000,
        "growth_rate": 0.36,
        "industries": ["tech", "finance", "healthcare"],
        "education": "Bachelor's"
    },
    {
        "title": "Software Engineer",
        "required_skills": ["programming", "algorithms", "git", "system design", "testing"],
        "avg_salary": 105000,
        "growth_rate": 0.25,
        "industries": ["tech", "startups", "enterprise"],
        "education": "Bachelor's"
    },
    {
        "title": "Product Manager",
        "required_skills": ["product strategy", "communication", "agile", "user research", "roadmapping"],
        "avg_salary": 120000,
        "growth_rate": 0.19,
        "industries": ["tech", "finance", "retail"],
        "education": "Bachelor's"
    },
    {
        "title": "UX Designer",
        "required_skills": ["figma", "user research", "prototyping", "wireframing", "design thinking"],
        "avg_salary": 90000,
        "growth_rate": 0.23,
        "industries": ["tech", "media", "consulting"],
        "education": "Bachelor's"
    },
    {
        "title": "DevOps Engineer",
        "required_skills": ["docker", "kubernetes", "ci/cd", "aws", "linux", "terraform"],
        "avg_salary": 118000,
        "growth_rate": 0.28,
        "industries": ["tech", "cloud", "enterprise"],
        "education": "Bachelor's"
    },
    {
        "title": "Cybersecurity Analyst",
        "required_skills": ["network security", "penetration testing", "siem", "compliance", "risk assessment"],
        "avg_salary": 102000,
        "growth_rate": 0.32,
        "industries": ["finance", "government", "healthcare"],
        "education": "Bachelor's"
    },
    {
        "title": "AI/ML Engineer",
        "required_skills": ["deep learning", "pytorch", "tensorflow", "mlops", "python", "math"],
        "avg_salary": 130000,
        "growth_rate": 0.40,
        "industries": ["tech", "research", "autonomous systems"],
        "education": "Master's"
    },
    {
        "title": "Business Analyst",
        "required_skills": ["excel", "sql", "requirements gathering", "process modeling", "communication"],
        "avg_salary": 80000,
        "growth_rate": 0.14,
        "industries": ["consulting", "finance", "retail"],
        "education": "Bachelor's"
    },
    {
        "title": "Cloud Architect",
        "required_skills": ["aws", "azure", "gcp", "microservices", "security", "cost optimization"],
        "avg_salary": 145000,
        "growth_rate": 0.30,
        "industries": ["tech", "enterprise", "government"],
        "education": "Bachelor's"
    },
    {
        "title": "Data Engineer",
        "required_skills": ["spark", "kafka", "sql", "python", "data pipelines", "etl"],
        "avg_salary": 112000,
        "growth_rate": 0.34,
        "industries": ["tech", "finance", "logistics"],
        "education": "Bachelor's"
    }
]

# Load sentence transformer model once
print("Loading embedding model...")
embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def embed_skills(skills: list) -> np.ndarray:
    text = ", ".join(skills)
    return embedder.encode([text])[0]

def compute_match_score(user_skills: list, career: dict) -> float:
    """Cosine similarity between user skills and career required skills."""
    user_vec = embed_skills(user_skills)
    career_vec = embed_skills(career["required_skills"])
    score = cosine_similarity([user_vec], [career_vec])[0][0]
    return float(score)

def get_skill_gap(user_skills: list, career: dict) -> list:
    """Find which required skills the user is missing."""
    user_lower = [s.lower() for s in user_skills]
    gaps = []
    for req in career["required_skills"]:
        if not any(req in u or u in req for u in user_lower):
            gaps.append(req)
    return gaps

def recommend_careers(parsed_resume: dict, top_n: int = 5) -> list:
    """Main recommendation function."""
    user_skills = parsed_resume.get("skills", [])
    user_interests = parsed_resume.get("interests", [])
    user_industries = parsed_resume.get("industries", [])
    
    all_skills = list(set(user_skills + user_interests))
    results = []

    for career in CAREER_DATABASE:
        match_score = compute_match_score(all_skills, career)
        skill_gap = get_skill_gap(user_skills, career)
        
        # Boost score if industry matches
        industry_boost = 0.05 * len(
            set(career["industries"]) & set(u.lower() for u in user_industries)
        )
        
        # Weight by market growth
        final_score = (match_score + industry_boost) * (1 + career["growth_rate"] * 0.2)

        results.append({
            "title": career["title"],
            "match_score": round(final_score * 100, 1),
            "skill_gap": skill_gap,
            "avg_salary": career["avg_salary"],
            "growth_rate": round(career["growth_rate"] * 100),
            "industries": career["industries"]
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:top_n]
