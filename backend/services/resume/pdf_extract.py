"""PDF text extraction using pdfplumber."""
import pdfplumber


def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF file. Returns empty string on failure."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"[pdf_extract] Error reading {file_path}: {e}")
    return text.strip()
