# Quick Command Reference

## Starting the Project

### Option 1: Using Batch File (Recommended)
```bash
.\run_project.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Start Backend
python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000

# Terminal 2 - Start Frontend (when ready)
cd frontend
npm start
```

## Testing API Endpoints

### Get Career Recommendations
```bash
curl -X POST http://localhost:8000/api/recommendations/ \
  -H "Content-Type: application/json" \
  -d '{"skills": ["Python", "SQL"], "interests": ["Data Science"]}'
```

### Get Full Dashboard
```bash
curl -X POST http://localhost:8000/api/dashboard/ \
  -H "Content-Type: application/json" \
  -d '{"skills": ["Python", "SQL"], "interests": ["Data Science"], "target_role": "Data Scientist"}'
```

### Analyze Skill Gap
```bash
curl -X POST http://localhost:8000/api/profile/skill-gap \
  -H "Content-Type: application/json" \
  -d '{"skills": ["Python"], "target_role": "Data Scientist"}'
```

### Get Learning Resources
```bash
curl -X POST http://localhost:8000/api/profile/learning-path \
  -H "Content-Type: application/json" \
  -d '{"skill_gaps": ["Machine Learning", "TensorFlow"], "target_role": "Data Scientist"}'
```

### Get Job Market Trends
```bash
curl -X GET http://localhost:8000/api/trends/Data%20Scientist
```

### Upload Resume
```bash
curl -X POST http://localhost:8000/api/resume/upload \
  -F "file=@resume.pdf"
```

## Git Commands

### Check Status
```bash
git status
```

### View Recent Commits
```bash
git log --oneline -10
```

### Pull Latest Changes from Chinmay Branch
```bash
git fetch origin
git merge origin/chinmay
```

### Push Changes to Manish Branch
```bash
git add .
git commit -m "Your commit message"
git push origin manish
```

## MongoDB Commands

### Start MongoDB Service
```bash
net start MongoDB
```

### Check MongoDB Status
```bash
Get-Service MongoDB | Select-Object Status, Name
```

### Connect to MongoDB
```bash
mongosh
```

## Python Environment

### Create Virtual Environment
```bash
python -m venv .venv
```

### Activate Virtual Environment
```bash
.venv\Scripts\activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Upgrade Pip
```bash
python -m pip install --upgrade pip
```

## Port Management

### Check if Port 8000 is in Use
```bash
netstat -ano | findstr :8000
```

### Kill Process Using Port 8000
```bash
taskkill /PID <PID> /F
```

## File Management

### List Files in Directory
```bash
dir
```

### Create Directory
```bash
mkdir folder_name
```

### Remove File
```bash
del file.txt
```

### Remove Directory
```bash
rmdir /s /q folder_name
```

## Useful Shortcuts

### View API Documentation
```
http://localhost:8000/docs
```

### View OpenAPI Schema
```
http://localhost:8000/openapi.json
```

### Health Check
```bash
curl http://localhost:8000/
```

## Environment Variables

### View .env File
```bash
type .env
```

### Edit .env File
```bash
notepad .env
```

## Troubleshooting

### Clear Python Cache
```bash
rmdir /s /q __pycache__
```

### Reinstall Dependencies
```bash
pip install --force-reinstall -r requirements.txt
```

### Check Python Version
```bash
python --version
```

### Check Pip Version
```bash
pip --version
```

## Development Workflow

### 1. Start Backend
```bash
python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000
```

### 2. Test Endpoints
```bash
curl -X POST http://localhost:8000/api/recommendations/ \
  -H "Content-Type: application/json" \
  -d @test_api.json
```

### 3. Check Logs
```bash
# View server output in terminal
# Look for INFO and ERROR messages
```

### 4. Commit Changes
```bash
git add .
git commit -m "Describe your changes"
git push origin manish
```

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/recommendations/` | Get career recommendations |
| POST | `/api/resume/upload` | Upload and parse PDF resume |
| POST | `/api/dashboard/` | Get full dashboard data |
| GET | `/api/trends/{role}` | Get job market trends |
| POST | `/api/profile/skill-gap` | Analyze skill gaps |
| POST | `/api/profile/learning-path` | Get learning resources |
| POST | `/api/career-advice` | Get personalized advice |
| GET | `/` | Health check |

## Performance Tips

- First request takes ~30 seconds (pre-computing embeddings)
- Subsequent requests take < 100ms
- Use caching for frequently accessed data
- Monitor MongoDB connection pool
- Check server logs for errors

## Documentation Files

- `QUICK_START.md` - Setup and installation guide
- `IMPLEMENTATION_SUMMARY.md` - Technical documentation
- `API_TEST_RESULTS.md` - Test results and verification
- `COMMANDS.md` - This file

---

**Happy coding! 🚀**
