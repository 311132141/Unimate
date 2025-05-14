Write-Host "Running WebSocket tests..." -ForegroundColor Cyan

# Change to the script's directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath

# Kill any existing Python processes that might be using the port
try {
    Write-Host "Checking for existing processes on ports..."
    $existingProcess = Get-NetTCPConnection -LocalPort 8766 -ErrorAction SilentlyContinue | Where-Object State -eq Listen
    if ($existingProcess) {
        $processId = $existingProcess.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Stopping process using port 8766: $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
            Stop-Process -Id $processId -Force
        }
    }
} catch {
    Write-Host "Note: Could not check for existing processes. Continuing..." -ForegroundColor Yellow
}

# Run the simplified WebSocket test client
Write-Host "Running simplified WebSocket test..." -ForegroundColor Cyan
python websocket_test_simple.py

# Store the exit code
$simplifiedExitCode = $LASTEXITCODE

# Show the result of the simplified test
if ($simplifiedExitCode -eq 0) {
    Write-Host "✅ Simplified WebSocket tests passed!" -ForegroundColor Green
    
    # If the simplified test passed, try the full test
    Write-Host "Running full WebSocket tests..." -ForegroundColor Cyan
    python websocket_test.py
    
    # Store the exit code
    $fullExitCode = $LASTEXITCODE
    
    # Show the result of the full test
    if ($fullExitCode -eq 0) {
        Write-Host "✅ Full WebSocket tests passed!" -ForegroundColor Green
        Exit 0
    } else {
        Write-Host "❌ Full WebSocket tests failed." -ForegroundColor Red
        Exit $fullExitCode
    }
} else {
    Write-Host "❌ Simplified WebSocket tests failed." -ForegroundColor Red
    Exit $simplifiedExitCode
} 