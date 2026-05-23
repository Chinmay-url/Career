"""
Learning resource recommender.
Uses Groq to suggest free learning resources for skill gaps.
"""
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

RESOURCE_CATALOG = {
    "react": {
        "resource": "React Official Learn",
        "url": "https://react.dev/learn",
        "type": "Documentation",
        "project": "Build a reusable dashboard component library.",
    },
    "javascript": {
        "resource": "JavaScript.info",
        "url": "https://javascript.info/",
        "type": "Tutorial",
        "project": "Build an async API search interface.",
    },
    "python": {
        "resource": "freeCodeCamp Python Course",
        "url": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
        "type": "Course",
        "project": "Build a resume parser utility with Python.",
    },
    "sql": {
        "resource": "Mode SQL Tutorial",
        "url": "https://mode.com/sql-tutorial/",
        "type": "Tutorial",
        "project": "Analyze job-market data using SQL queries.",
    },
    "machine learning": {
        "resource": "Google Machine Learning Crash Course",
        "url": "https://developers.google.com/machine-learning/crash-course",
        "type": "Course",
        "project": "Train a skill-to-career classifier.",
    },
    "data analysis": {
        "resource": "Kaggle Learn",
        "url": "https://www.kaggle.com/learn",
        "type": "Practice",
        "project": "Create a market demand analysis notebook.",
    },
    "aws": {
        "resource": "AWS Skill Builder",
        "url": "https://skillbuilder.aws/",
        "type": "Certification Prep",
        "project": "Deploy the career recommender backend on AWS.",
    },
    "cloud": {
        "resource": "AWS Cloud Practitioner Essentials",
        "url": "https://skillbuilder.aws/learn",
        "type": "Certification Prep",
        "project": "Deploy a REST API with storage and monitoring.",
    },
    "docker": {
        "resource": "Docker Get Started",
        "url": "https://docs.docker.com/get-started/",
        "type": "Documentation",
        "project": "Containerize the frontend and backend.",
    },
    "kubernetes": {
        "resource": "Kubernetes Basics",
        "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        "type": "Tutorial",
        "project": "Deploy a containerized API to a local cluster.",
    },
    "mlops": {
        "resource": "Made With ML MLOps",
        "url": "https://madewithml.com/",
        "type": "Course",
        "project": "Track and serve a recommendation model.",
    },
    "vector": {
        "resource": "Pinecone Learning Center",
        "url": "https://www.pinecone.io/learn/",
        "type": "Learning Path",
        "project": "Build semantic resume search with embeddings.",
    },
    "prompt": {
        "resource": "DeepLearning.AI ChatGPT Prompt Engineering",
        "url": "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
        "type": "Course",
        "project": "Design prompts for structured resume parsing.",
    },
    "fastapi": {
        "resource": "FastAPI Tutorial",
        "url": "https://fastapi.tiangolo.com/tutorial/",
        "type": "Documentation",
        "project": "Build secured recommendation API endpoints.",
    },
}


def _catalog_match(skill: str) -> dict:
    skill_lower = skill.lower()
    for keyword, resource in RESOURCE_CATALOG.items():
        if keyword in skill_lower or skill_lower in keyword:
            return resource
    return {
        "resource": "Coursera Career Academy",
        "url": "https://www.coursera.org/career-academy",
        "type": "Course",
        "project": f"Build a portfolio mini-project that demonstrates {skill}.",
    }


def _fallback_resources(skill_gaps: list[str]) -> list[dict]:
    resources = []
    for index, skill in enumerate(skill_gaps[:10]):
        matched = _catalog_match(skill)
        resources.append({
            "skill": skill,
            "resource": matched["resource"],
            "url": matched["url"],
            "type": matched["type"],
            "time_estimate": "1-2 weeks" if index < 3 else "2-3 weeks",
            "priority": "High" if index < 3 else "Medium",
            "project": matched["project"],
            "why": f"This directly targets the {skill} gap for your selected role.",
        })
    return resources


def recommend_learning_resources(skill_gaps: list[str], target_role: str) -> dict:
    """
    Given a list of skill gaps and target role, return learning recommendations.
    """
    if not skill_gaps:
        return {"message": "No skill gaps found. You are well-prepared for this role.", "resources": []}

    gaps_text = ", ".join(skill_gaps[:10])
    verified_resources = _fallback_resources(skill_gaps)

    prompt = f"""
    A person wants to become a {target_role}.
    They are missing these skills: {gaps_text}

    Use these verified resources and do not invent new URLs:
    {json.dumps(verified_resources)}

    Improve the "why", "project", "priority", and "time_estimate" fields for each item.
    Return ONLY a JSON object in this exact shape:
    {{"resources": [
      {{"skill": "skill name", "resource": "resource name", "url": "verified url", "type": "Course", "time_estimate": "X weeks", "priority": "High", "project": "portfolio project", "why": "short reason"}}
    ]}}
    """

    try:
        response = _client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=1200,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content.strip()
        data = json.loads(raw)
        resources = data.get("resources", [])
    except Exception:
        resources = verified_resources

    if not resources:
        resources = verified_resources

    return {
        "target_role": target_role,
        "skill_gaps": skill_gaps[:10],
        "resources": resources,
    }
