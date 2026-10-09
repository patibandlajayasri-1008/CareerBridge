@echo off
title CareerBridge Full-Stack Launcher
echo ========================================================
echo   Launching CareerBridge Full-Stack Application...
echo ========================================================
echo.
echo 1. Launching Backend REST API Server (port 5000)...
start "CareerBridge Backend API" cmd /k "%~dp0start-server.bat"
timeout /t 2 /nobreak >nul
echo 2. Launching Frontend Client (port 5173)...
start "CareerBridge Frontend Client" cmd /k "%~dp0start-dev.bat"
echo.
echo ========================================================
echo   Both servers launched successfully!
echo   - Backend REST API:  http://localhost:5000
echo   - Frontend Client:   http://localhost:5173
echo ========================================================
echo.
pause
