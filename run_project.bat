@echo off
SETLOCAL
cd /d %~dp0

echo ==========================================
echo   AI Career Path Recommender - Startup
echo ==========================================

netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8000 is already in use.
    echo Please make sure the backend is not already running.
) else (
    echo [1/2] Starting Backend Server FastAPI...
    start "AI Career Backend" /min python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000
    timeout /t 3 /nobreak > nul
)

echo [2/2] Opening Frontend...
start "" "frontend\index.html"

echo.
echo ==========================================
echo Project is running.
echo The backend is active in the background.
echo ==========================================
timeout /t 5
