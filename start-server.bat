@echo off
title CareerBridge Backend Server
echo ========================================================
echo   Starting CareerBridge Backend REST API Server...
echo ========================================================
echo.

:: Ensure correct Node.js path is prioritized
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Navigate to server directory
cd /d "%~dp0server"

echo Current Directory: %CD%
echo Node Version:
node -v
echo NPM Version:
call npm -v
echo.
echo Starting Express Server on http://localhost:5000 ...
echo Press Ctrl+C in this window anytime to stop the server.
echo.

call npm run dev
pause
