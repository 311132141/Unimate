# Unimate Backend Server Runner
# This script changes to the backend directory and runs the Django server

Write-Host "Starting Unimate Django backend server..." -ForegroundColor Green

# Change to the backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Check if port 8000 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Warning: Port 8000 is already in use. The Django server may not start properly." -ForegroundColor Yellow
}

# Check if manage.py exists
if (-not (Test-Path "manage.py")) {
    Write-Host "Error: manage.py not found in $((Get-Location).Path)" -ForegroundColor Red
    Write-Host "Please make sure you're in the correct directory structure" -ForegroundColor Red
    exit 1
}

# Run the Django server
try {
    Write-Host "Django server starting at http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
    python manage.py runserver 0.0.0.0:8000
} 
catch {
    Write-Host "Error starting Django server: $_" -ForegroundColor Red
}

# Return to the original directory
Set-Location -Path "$PSScriptRoot" 