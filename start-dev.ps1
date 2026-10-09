# CareerBridge Frontend Launcher for PowerShell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "$PSScriptRoot\client"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting CareerBridge Frontend Development Server...  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Vite dev server running at: http://localhost:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server anytime.`n" -ForegroundColor Gray
npm run dev
