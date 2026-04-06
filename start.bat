@echo off
echo Starting the development environment...

netstat -ano | findstr ":27017" | findstr "LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting MongoDB...
    start "MongoDB" mongod --dbpath "%ROOT%data\mongodb"
) else (
    echo MongoDB already running.
)

start cmd /k "cd /d "./backend" && node server.js"
start cmd /k "cd /d "./frontend" && npm run dev"

echo Both servers are running.