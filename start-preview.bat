@echo off
echo ========================================
echo   So Fluent Platform - Preview Server
echo ========================================
echo.
echo Starting both backend and frontend servers...
echo.

REM Start backend server in new window
start "So Fluent Backend" cmd /k "cd server && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server in new window
start "So Fluent Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo   Servers starting...
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173 (check terminal for actual port)
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul
