@echo off
echo ========================================================
echo Seeding VELoop Rewards Demo Database...
echo ========================================================
cd backend
npm run seed
echo.
echo Seeding process completed.
echo ========================================================
pause
