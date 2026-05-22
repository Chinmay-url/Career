"""Project-wide constants."""

# IT skill categories shown in the frontend skill picker
IT_SKILL_CATEGORIES = {
    "Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go",
        "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Scala", "R",
    ],
    "Web & Frontend": [
        "React", "Vue.js", "Angular", "HTML", "CSS", "Next.js", "Node.js",
        "REST API", "GraphQL", "WebSockets",
    ],
    "Data & ML": [
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
        "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
        "Data Analysis", "Statistics", "SQL", "Spark", "Tableau", "Power BI",
    ],
    "Cloud & DevOps": [
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD",
        "Terraform", "Linux", "Git", "Jenkins", "Ansible",
    ],
    "Security & Networking": [
        "Cybersecurity", "Networking", "Penetration Testing", "Firewalls",
        "SIEM", "Cryptography", "Zero Trust",
    ],
    "Databases": [
        "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch",
        "Cassandra", "DynamoDB",
    ],
    "Soft Skills": [
        "Agile", "Scrum", "Project Management", "Communication",
        "Leadership", "Problem Solving",
    ],
}

# Flat list for quick lookup
ALL_IT_SKILLS: list[str] = [
    skill for skills in IT_SKILL_CATEGORIES.values() for skill in skills
]

# O*NET SOC code prefix for Computer & Mathematical occupations
COMPUTER_SOC_PREFIX = "15-"

# Groq model
DEFAULT_LLM_MODEL = "llama-3.3-70b-versatile"

# Adzuna country code
DEFAULT_COUNTRY = "us"
