@echo off
echo ========================================================
echo Starting VELoop Rewards - Full Stack System
echo ========================================================

start "VELoop Backend API (Port 5000)" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "VELoop Frontend Client (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched!
echo - Member Profile: http://localhost:5173/user-profile
echo - Admin Portal:   http://localhost:5173/admin/login
echo ========================================================
