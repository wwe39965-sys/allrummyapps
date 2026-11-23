@echo off
echo ========================================================
echo       Starting AllRummyApps Modern Fullstack Server
echo ========================================================
echo.
echo Website will be available at: http://localhost:5000/
echo Admin Panel:                  http://localhost:5000/admin
echo Admin Password:               admin123
echo.
cd backend
node server.js
pause
