#!/bin/bash

echo "========================================"
echo "  So Fluent Platform - Preview Server"
echo "========================================"
echo ""
echo "Starting both backend and frontend servers..."
echo ""

# Start backend server in background
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server in background
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  Servers starting..."
echo "========================================"
echo ""
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173 (check terminal for actual port)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
