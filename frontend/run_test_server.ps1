# Unimate Test Server Runner
# This script runs the frontend server for testing changes

Write-Host "Starting Unimate frontend server for testing..." -ForegroundColor Green

# Check if port 8080 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Warning: Port 8080 is already in use. The server may not start properly." -ForegroundColor Yellow
}

# Run the server
try {
    Write-Host "Server starting at http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
    python server.py
} 
catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
} 