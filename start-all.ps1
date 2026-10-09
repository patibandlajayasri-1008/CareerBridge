# CareerBridge Full-Stack Launcher for PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching CareerBridge Full-Stack Application...      " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "1. Starting Backend REST API Server (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$PSScriptRoot\start-server.ps1`""

Start-Sleep -Seconds 2

Write-Host "2. Starting Frontend Client (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$PSScriptRoot\start-dev.ps1`""

Write-Host "`nBoth servers launched in dedicated PowerShell windows!" -ForegroundColor Green
Write-Host "  - Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  - Frontend App: http://localhost:5173" -ForegroundColor Cyan
