# 🎯 AI Career Path Recommender

An AI-powered career guidance system that matches your skills to IT careers using the O*NET database, sentence-transformers embeddings, and Groq LLM.

---

## Features

- **Resume Upload** — PDF parsing via Groq LLM (Llama-3.3-70b)
- **Career Matching** — Cosine similarity against 879 O*NET IT occupations
- **Skill Gap Analysis** — See exactly what skills you're missing for any role
- **Learning Path** — AI-generated free resource recommendations per skill gap
- **Job Market Trends** — Live job counts via Adzuna API
- **Dashboard** — Charts (bar, doughnut, radar) for visual career insights
- **Auth** — JWT-based register/login (optional)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python 3.10+ |
| LLM | Groq (Llama-3.3-70b-versatile) |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 |
| Career Data | O*NET Free Database (TSV files) |
| Database | MongoDB (Motor async driver) |
| Job Market | Adzuna API |
| Frontend | Vanilla HTML/JS (index.html) + React (src/) |

---

## Quick Start

### 1. Prerequisites
- Python 3.10+
- MongoDB 4.0+ (running as a service)
- Git

### 2. Clone and setup
```bash
git clone https://github.com/Chinmay-url/Career.git
cd Career
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 3. Configure environment
Copy `.env.example` to `.env` and fill in your keys:
```
GROQ_API_KEY=your_groq_key        # https://console.groq.com
ADZUNA_APP_ID=your_adzuna_id      # https://developer.adzuna.com
ADZUNA_API_KEY=your_adzuna_key
MONGO_URI=mongodb://localhost:27017
SECRET_KEY=your-jwt-secret
```

### 4. Run the backend
```bash
python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000
```

> First run takes ~30 seconds to pre-compute embeddings for all IT careers.

### 5. Open the UI
Open `frontend/index.html` in your browser — or visit `http://localhost:8000/`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recommendations/` | Career recommendations from skills |
| POST | `/api/resume/upload` | Upload PDF resume |
| POST | `/api/dashboard/` | Full dashboard with charts |
| GET | `/api/trends/{role}` | Live job market data |
| POST | `/api/profile/skill-gap` | Skill gap analysis |
| POST | `/api/profile/learning-path` | Learning resources |
| POST | `/api/career-advice` | AI career advice |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |

Interactive docs: `http://localhost:8000/docs`

---

## Project Structure

```
Career/
├── backend/
│   ├── app.py                    # FastAPI entry point
│   ├── routes/                   # API route handlers
│   ├── services/
│   │   ├── recommendation/       # O*NET loader + embedding engine
│   │   ├── skill_gap/            # Gap analysis + learning recommender
│   │   ├── dashboard/            # Chart data builder
│   │   ├── resume/               # PDF extract + Groq parser
│   │   └── trends/               # Adzuna client + analyzer
│   ├── models/                   # Pydantic request/response models
│   ├── database/                 # MongoDB client + schemas
│   ├── auth/                     # JWT + password utils
│   ├── middleware/               # Auth dependency
│   ├── utils/                    # Constants, helpers, validators
│   └── config/                   # Settings from .env
├── frontend/
│   ├── index.html                # Standalone UI (no build needed)
│   └── src/                      # React app (optional)
│       ├── pages/                # Dashboard, Recommendations, etc.
│       ├── components/           # Navbar, Cards, Charts
│       └── services/             # API call functions
├── data/                         # O*NET TSV files (5 files)
├── tests/                        # pytest test suite
├── requirements.txt
├── docker-compose.yml
└── .env
```

---

## Running Tests

```bash
cd Career
.venv\Scripts\activate
pytest tests/ -v
```

---

## Git Branches

| Branch | Purpose |
|--------|---------|
| `chinmay` | Main development branch |
| `manish` | Feature branch (this implementation) |

---

## Team

- **Chinmay** — Backend architecture, routes
- **Manish** — O*NET integration, recommendation engine, frontend

---

## License

MIT
