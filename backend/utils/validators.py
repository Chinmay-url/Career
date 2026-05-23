"""Input validation helpers."""
import re
from fastapi import HTTPException


def validate_email(email: str) -> str:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w{2,}$"
    if not re.match(pattern, email):
        raise HTTPException(400, f"Invalid email address: {email}")
    return email.lower().strip()


def validate_password(password: str) -> str:
    if len(password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    return password


def validate_skills_list(skills: list) -> list:
    if not isinstance(skills, list):
        raise HTTPException(400, "skills must be a list")
    cleaned = [str(s).strip() for s in skills if str(s).strip()]
    if not cleaned:
        raise HTTPException(400, "skills list cannot be empty")
    return cleaned


def validate_pdf_filename(filename: str) -> None:
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported")
