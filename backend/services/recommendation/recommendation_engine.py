"""
Core recommendation engine using sentence-transformers + cosine similarity
against the IT/Tech O*NET career database.

Fix B: user query is no longer hardcoded as "Software developer with skills in:..."
       — the domain prefix is inferred from the user's actual skills so the
       embedding search lands in the right semantic neighbourhood.
"""
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
from .onet_loader import load_career_database

print("Loading embedding model...")
_embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# ── Fix B: domain-inference keyword sets ─────────────────────────────────────
# Each entry: (domain_label, {keywords that signal this domain})
# Evaluated in order; first match wins.  Falls back to "Software developer".
_DOMAIN_SIGNALS: list[tuple[str, set[str]]] = [
    ("Data scientist",          {"pandas", "numpy", "scikit-learn", "sklearn", "data science",
                                  "statistics", "statistical", "r programming", "ggplot",
                                  "data analysis", "data mining", "jupyter", "matplotlib",
                                  "seaborn", "scipy", "data scientist"}),
    ("Machine learning engineer", {"machine learning", "deep learning", "tensorflow", "pytorch",
                                    "keras", "neural network", "nlp", "natural language processing",
                                    "computer vision", "transformers", "llm", "bert", "gpt",
                                    "reinforcement learning", "xgboost", "lightgbm"}),
    ("Data engineer",           {"spark", "hadoop", "kafka", "airflow", "etl", "data pipeline",
                                  "data warehouse", "dbt", "snowflake", "bigquery", "redshift",
                                  "databricks", "hive", "flink", "data engineering"}),
    ("Cybersecurity analyst",   {"cybersecurity", "penetration testing", "ethical hacking",
                                  "siem", "soc", "vulnerability", "malware", "forensics",
                                  "nmap", "metasploit", "burp suite", "owasp", "security+"}),
    ("Cloud engineer",          {"aws", "azure", "gcp", "google cloud", "terraform", "cloudformation",
                                  "kubernetes", "eks", "aks", "gke", "lambda", "s3", "ec2",
                                  "cloud architect", "cloud engineer"}),
    ("DevOps engineer",         {"devops", "ci/cd", "jenkins", "github actions", "gitlab ci",
                                  "ansible", "puppet", "chef", "docker", "helm", "prometheus",
                                  "grafana", "site reliability", "sre"}),
    ("Mobile developer",        {"android", "ios", "swift", "kotlin", "flutter", "react native",
                                  "xamarin", "mobile development", "xcode"}),
    ("Frontend developer",      {"react", "vue", "angular", "html", "css", "javascript",
                                  "typescript", "next.js", "nuxt", "svelte", "tailwind",
                                  "frontend", "ui/ux", "figma"}),
    ("Backend developer",       {"node.js", "django", "fastapi", "flask", "spring boot",
                                  "express", "graphql", "rest api", "microservices",
                                  "postgresql", "mysql", "mongodb", "redis", "backend"}),
    ("Embedded systems engineer", {"embedded", "firmware", "rtos", "c programming", "c++",
                                    "microcontroller", "arduino", "raspberry pi", "fpga",
                                    "verilog", "vhdl", "iot", "uart", "spi", "i2c"}),
    ("Blockchain developer",    {"blockchain", "solidity", "ethereum", "smart contract",
                                  "web3", "defi", "nft", "hyperledger", "crypto"}),
    ("Database administrator",  {"sql", "oracle", "dba", "database administration",
                                  "mysql", "postgresql", "nosql", "query optimisation",
                                  "stored procedure", "indexing"}),
    ("Software developer",      set()),   # catch-all — always matches last
]


def _infer_domain_prefix(skills: list[str]) -> str:
    """
    Fix B — infer the most appropriate role prefix from the user's skill list.
    Returns a string like "Data scientist" or "Machine learning engineer".
    """
    skills_lower = {s.lower() for s in skills}
    for domain_label, keywords in _DOMAIN_SIGNALS:
        if not keywords:          # catch-all entry
            return domain_label
        if skills_lower & keywords:   # any overlap → match
            return domain_label
    return "Software developer"


def _embed(text: str) -> np.ndarray:
    return _embedder.encode([text])[0]


@lru_cache(maxsize=1)
def _get_career_embeddings() -> tuple[list[dict], np.ndarray]:
    """
    Pre-compute embeddings for all IT careers.
    Embeds: title + description + top skills for richer semantic matching.
    Cached after first call.
    """
    careers = load_career_database()
    print(f"Pre-computing embeddings for {len(careers)} IT/Tech careers...")

    texts = []
    for c in careers:
        skills_text = ", ".join(c["required_skills"][:20])
        combined = f"{c['title']}. {c.get('description', '')[:150]}. Skills: {skills_text}"
        texts.append(combined)

    embeddings = _embedder.encode(texts, batch_size=64, show_progress_bar=True)
    print("Embeddings ready.")
    return careers, embeddings


def recommend_careers(parsed_profile: dict, top_n: int = 5) -> list[dict]:
    """
    Match user profile against IT/Tech O*NET careers using cosine similarity.
    Returns top_n matches with skill gap analysis.
    """
    user_skills = parsed_profile.get("skills", [])
    user_interests = parsed_profile.get("interests", [])
    all_skills = list(set(user_skills + user_interests))

    if not all_skills:
        return []

    # Fix B — infer domain prefix so the query lands in the right embedding space
    domain_prefix = _infer_domain_prefix(all_skills)
    user_text = f"{domain_prefix} with skills in: " + ", ".join(all_skills)

    user_vec = _embed(user_text).reshape(1, -1)

    careers, career_embeddings = _get_career_embeddings()
    scores = cosine_similarity(user_vec, career_embeddings)[0]

    top_indices = np.argsort(scores)[::-1][:top_n * 3]

    results = []
    seen_titles = set()

    for idx in top_indices:
        career = careers[idx]
        title = career["title"]

        if title in seen_titles:
            continue
        seen_titles.add(title)

        match_score = float(scores[idx])
        skill_gap = _compute_skill_gap(user_skills, career["required_skills"])
        matched = _compute_matched(user_skills, career["required_skills"])

        results.append({
            "title": title,
            "onet_code": career["onet_code"],
            "description": career.get("description", "")[:200],
            "match_score": round(match_score * 100, 1),
            "skill_gap": skill_gap[:8],
            "matched_skills": matched[:6],
            "required_skills": career["required_skills"][:10],
            "inferred_domain": domain_prefix,   # useful for debugging / frontend display
        })

        if len(results) >= top_n:
            break

    return results


def _compute_skill_gap(user_skills: list[str], required_skills: list[str]) -> list[str]:
    """Find required skills the user is missing."""
    user_lower = {s.lower() for s in user_skills}
    gaps = []
    for req in required_skills:
        req_lower = req.lower()
        if not any(req_lower in u or u in req_lower for u in user_lower):
            gaps.append(req)
    return gaps


def _compute_matched(user_skills: list[str], required_skills: list[str]) -> list[str]:
    """Find required skills the user already has."""
    user_lower = {s.lower() for s in user_skills}
    matched = []
    for req in required_skills:
        req_lower = req.lower()
        if any(req_lower in u or u in req_lower for u in user_lower):
            matched.append(req)
    return matched
