# Unimate Test Runner
# This script provides options to run frontend only or frontend+backend

param (
    [switch]$FrontendOnly,
    [switch]$UseProxy
)

Write-Host "Unimate Test Runner" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

if ($FrontendOnly) {
    # Frontend only mode
    Write-Host "Running in Frontend-only mode" -ForegroundColor Green
    Set-Location -Path "$PSScriptRoot\frontend"
    
    if ($UseProxy) {
        & .\run_proxy_server.ps1
    }
    else {
        & .\run_test_server.ps1
    }
}
else {
    # Full stack mode - we'll need two PowerShell windows
    Write-Host "Running full stack (Backend + Frontend)" -ForegroundColor Green
    
    # Start backend in a new PowerShell window
    Write-Host "Starting Django backend in a new window..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run_backend.ps1"
    
    # Give the backend a moment to start
    Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    # Start frontend with proxy in current window
    Write-Host "Starting frontend with proxy in current window..." -ForegroundColor Yellow
    Set-Location -Path "$PSScriptRoot\frontend"
    & .\run_proxy_server.ps1
}

# Return to original directory at the end
Set-Location -Path "$PSScriptRoot" 