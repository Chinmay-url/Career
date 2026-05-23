"""
Learning resource recommender.
Uses Groq to suggest free learning resources for skill gaps.
"""
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def recommend_learning_resources(skill_gaps: list[str], target_role: str) -> dict:
    """
    Given a list of skill gaps and target role, return learning recommendations.
    """
    if not skill_gaps:
        return {"message": "No skill gaps found. You are well-prepared for this role.", "resources": []}

    gaps_text = ", ".join(skill_gaps[:10])

    prompt = f"""
    A person wants to become a {target_role}.
    They are missing these skills: {gaps_text}

    For each skill gap, suggest ONE free learning resource (course, tutorial, or platform).
    Format your response as a JSON array like:
    [
      {{"skill": "skill name", "resource": "resource name", "url_hint": "platform or website", "time_estimate": "X weeks"}},
      ...
    ]
    Return ONLY the JSON array, no explanation.
    """

    response = _client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        max_tokens=800,
        response_format={"type": "json_object"},
    )

    import json
    raw = response.choices[0].message.content.strip()
    try:
        data = json.loads(raw)
        # Handle both array and object with array inside
        resources = data if isinstance(data, list) else data.get("resources", data.get("items", []))
    except Exception:
        resources = []

    return {
        "target_role": target_role,
        "skill_gaps": skill_gaps[:10],
        "resources": resources,
    }
