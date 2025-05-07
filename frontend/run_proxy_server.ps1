# Unimate Proxy Server Runner
# This script runs the proxy server to connect frontend to Django backend

Write-Host "Starting Unimate proxy server..." -ForegroundColor Green

# Check if port 8080 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Warning: Port 8080 is already in use. The proxy may not start properly." -ForegroundColor Yellow
}

# Run the proxy server
try {
    Write-Host "Proxy server starting at http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Requests to /api/* will be forwarded to http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
    python proxy.py
} 
catch {
    Write-Host "Error starting proxy server: $_" -ForegroundColor Red
} 