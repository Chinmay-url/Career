@echo off
SETLOCAL
cd /d %~dp0

echo ==========================================
echo   AI Career Path Recommender - Startup
echo ==========================================

:: Check if anything is already on port 8000
netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo [!] Port 8000 is already in use. 
    echo Please make sure the backend isn't already running.
) else (
    echo [1/2] Starting Backend Server (FastAPI)...
    :: Start backend in a separate minimized window to keep it running
    start "AI Career Backend" /min python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000
    
    :: Give it a few seconds to initialize
    timeout /t 3 /nobreak > nul
)

echo [2/2] Opening Frontend...
start "" "frontend\index.html"

echo.
echo ==========================================
echo Project is running! 
echo The backend is active in the background.
echo ==========================================
timeout /t 5
