Write-Host "Running Simple WebSocket Test..." -ForegroundColor Cyan

# Change to the script's directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath

# Run the simplified WebSocket test
python websocket_test_simple.py

# Store and check exit code
$exitCode = $LASTEXITCODE
if ($exitCode -eq 0) {
    Write-Host "✅ WebSocket test passed!" -ForegroundColor Green
} else {
    Write-Host "❌ WebSocket test failed." -ForegroundColor Red
}

# Return the exit code
Exit $exitCode 