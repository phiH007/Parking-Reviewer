@echo off
echo Starting the development environment...

start cmd /k "cd /d "./backend" && node server.js"
start cmd /k "cd /d "./frontend" && npm run dev"

echo Both servers are running.