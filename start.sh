#!/bin/bash

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Starting Parking Reviewer..."

# Start MongoDB
if ! lsof -i :27017 -sTCP:LISTEN -t &>/dev/null; then
  mongod --dbpath /opt/homebrew/var/mongodb --logpath /opt/homebrew/var/log/mongodb/mongo.log &
  MONGO_PID=$!
  echo "MongoDB started (PID $MONGO_PID)"
else
  echo "MongoDB already running."
  MONGO_PID=""
fi

# Start backend
cd "$ROOT/backend"
node server.js &
BACKEND_PID=$!
echo "Backend started (PID $BACKEND_PID) on http://localhost:8080"

# Start frontend
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID $FRONTEND_PID)"

echo ""
echo "Press Ctrl+C to stop all servers."

trap "kill $BACKEND_PID $FRONTEND_PID $MONGO_PID 2>/dev/null; echo 'Servers stopped.'" EXIT

wait
