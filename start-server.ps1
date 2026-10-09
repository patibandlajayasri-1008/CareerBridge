# CareerBridge Backend Launcher for PowerShell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "$PSScriptRoot\server"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting CareerBridge Backend REST API Server...      " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Express API running at: http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server anytime.`n" -ForegroundColor Gray
npm run dev
