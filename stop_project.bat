@echo off
echo Stopping AI Career Backend...
:: Find the process ID listening on port 8000 and kill it
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /F /PID %%a
)
echo Backend stopped.
pause
