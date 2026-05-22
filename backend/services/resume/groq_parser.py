"""Resume parsing via Groq LLM — structured JSON extraction."""
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))


def parse_resume(resume_text: str) -> dict:
    """
    Send resume text to Groq and return a structured profile dict.
    Fields: name, skills, experience_years, education, current_role,
            industries, interests
    """
    prompt = f"""
Parse this resume and return ONLY a JSON object with these exact fields:
- name (string)
- skills (list of strings — technical skills only)
- experience_years (number, 0 if student/fresher)
- education (string: highest degree e.g. "B.Tech Computer Science")
- current_role (string: most recent job title or "Student" if none)
- industries (list of strings: domains the person has worked in)
- interests (list of strings: inferred from projects/roles)

Resume text:
{resume_text[:3000]}

Return ONLY valid JSON. No explanation, no markdown.
"""
    response = _client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0,
        response_format={"type": "json_object"},
    )
    raw = response.choices[0].message.content.strip()
    return json.loads(raw)
