@echo off
setlocal

set ROOT=%~dp0

echo Starting Parking Reviewer...

REM Start MongoDB if not already running
netstat -ano | findstr ":27017" | findstr "LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting MongoDB...
    start "MongoDB" mongod --dbpath "%ROOT%data\mongodb"
) else (
    echo MongoDB already running.
)

REM Start backend
echo Starting backend on http://localhost:8080
start "Backend" cmd /k "cd /d "%ROOT%backend" && node server.js"

REM Start frontend
echo Starting frontend...
start "Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo All servers started. Close the terminal windows to stop them.
