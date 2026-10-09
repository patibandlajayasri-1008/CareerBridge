@echo off
title CareerBridge Frontend Dev Server
echo ========================================================
echo   Starting CareerBridge Frontend Development Server...
echo ========================================================
echo.

:: Ensure correct Node.js path is prioritized
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Navigate to client directory
cd /d "%~dp0client"

echo Current Directory: %CD%
echo Node Version:
node -v
echo NPM Version:
call npm -v
echo.
echo Starting Vite Dev Server on http://localhost:5173 ...
echo Press Ctrl+C in this window anytime to stop the server.
echo.

call npm run dev
pause
