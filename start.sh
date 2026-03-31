#!/bin/bash

echo "Starting the development environment..."

osascript -e 'tell app "Terminal" to do script "cd \"'$PWD'/backend\" && node server.js"'

osascript -e 'tell app "Terminal" to do script "cd \"'$PWD'/frontend\" && npm run dev"'

echo "Both servers are running."