import pdfplumber
from groq import Groq
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()

def parse_resume_with_llm(resume_text: str) -> dict:
    """Use Groq to extract structured data from resume text."""
    prompt = f"""
    Parse this resume and return ONLY a JSON object with these fields:
    - name (string)
    - skills (list of strings)
    - experience_years (number)
    - education (string: degree level)
    - current_role (string)
    - industries (list of strings)
    - interests (list of strings inferred from roles/projects)

    Resume:
    {resume_text[:3000]}

    Return ONLY valid JSON, no explanation.
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0,
        response_format={"type": "json_object"}
    )

    raw = chat_completion.choices[0].message.content.strip()
    return json.loads(raw)

def extract_skills_spacy(text: str) -> list:
    """Lightweight spaCy-based skill keyword extraction as fallback."""
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        # If model not found, return empty list or handle accordingly
        return []
    doc = nlp(text)
    # Extract noun chunks and proper nouns as candidate skills
    skills = []
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) <= 4:
            skills.append(chunk.text.lower())
    return list(set(skills))
