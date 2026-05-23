from services.resume.formatter import format_parsed_profile
from services.resume.groq_parser import parse_resume
from services.resume.pdf_extract import extract_text_from_pdf


def parse_resume_with_llm(resume_text: str) -> dict:
    return format_parsed_profile(parse_resume(resume_text))
