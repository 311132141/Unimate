# RFID Connection Test Script for PowerShell
# -----------------------------------------------------
# This script tests if the backend RFID scan endpoint is working correctly
# by simulating card scans.

param(
    [string]$CardId = "5A653600",  # Default to your actual card ID
    [string]$KioskId = "test-kiosk-1"
)

# Test card IDs
$TEST_CARDS = @(
    "5A653600",   # Your actual RFID card
    "04B5C6D7E8", # Bob's card
    "0499AA11BB"  # Carol's card
)

function Get-LocalIP {
    # Get the local IP address of this machine
    try {
        $ipAddresses = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.PrefixOrigin -eq "Dhcp"})
        if ($ipAddresses -and $ipAddresses.Count -gt 0) {
            return $ipAddresses[0].IPAddress
        }
        return "127.0.0.1"  # Fallback to localhost
    } catch {
        Write-Host "Could not determine local IP. Using localhost."
        return "127.0.0.1"
    }
}

function Test-ScanEndpoint {
    param (
        [string]$ServerUrl,
        [string]$CardId,
        [string]$KioskId
    )

    $endpoint = "$ServerUrl/api/scan/"
    
    $payload = @{
        rfid_uid = $CardId
        kiosk = $KioskId
    } | ConvertTo-Json
    
    Write-Host "Testing endpoint: $endpoint"
    Write-Host "Payload: $payload"
    
    try {
        $response = Invoke-WebRequest -Method POST -Uri $endpoint -Body $payload -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
        
        Write-Host "Status code: $($response.StatusCode)"
        if ($response.StatusCode -eq 200) {
            Write-Host "SUCCESS! Server accepted the card scan." -ForegroundColor Green
            Write-Host "Response: $($response.Content)"
            return $true
        } else {
            Write-Host "Error: Server returned $($response.StatusCode)" -ForegroundColor Red
            Write-Host "Response: $($response.Content)"
            return $false
        }
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Check-FirewallStatus {
    Write-Host "`nChecking if port 8000 is accessible locally..."
    
    try {
        $testResult = Test-NetConnection -ComputerName localhost -Port 8000 -WarningAction SilentlyContinue
        
        if ($testResult.TcpTestSucceeded) {
            Write-Host "Port 8000 is open and accepting connections locally." -ForegroundColor Green
            return $true
        } else {
            Write-Host "Port 8000 appears to be closed locally." -ForegroundColor Red
            Write-Host "The server might not be running or the firewall might be blocking it."
            return $false
        }
    } catch {
        Write-Host "Could not check port status: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Start-TestBackend {
    Write-Host "Starting backend server for testing..."
    try {
        Start-Process -FilePath "python" -ArgumentList "run.py --asgi" -NoNewWindow
        Write-Host "Backend server started. Waiting 5 seconds for it to initialize..." -ForegroundColor Green
        Start-Sleep -Seconds 5
    } catch {
        Write-Host "Failed to start backend server: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main script
Write-Host "RFID Scan Endpoint Test Script" -ForegroundColor Cyan
Write-Host "-----------------------------" -ForegroundColor Cyan

$localIP = Get-LocalIP
Write-Host "Local IP address: $localIP"

# Check if backend is running
$backendRunning = Check-FirewallStatus
if (-not $backendRunning) {
    Write-Host "Backend server doesn't seem to be running." -ForegroundColor Yellow
    $startBackend = Read-Host "Do you want to start the backend server? (y/n)"
    if ($startBackend -eq "y") {
        Start-TestBackend
    }
}

# Test with localhost first
$serverUrl = "http://localhost:8000"
Write-Host "`nTesting with localhost: $serverUrl"
$success = Test-ScanEndpoint -ServerUrl $serverUrl -CardId $CardId -KioskId $KioskId

# If localhost fails, try with local IP
if (-not $success) {
    $serverUrl = "http://$localIP`:8000"
    Write-Host "`nTrying with local IP: $serverUrl"
    Test-ScanEndpoint -ServerUrl $serverUrl -CardId $CardId -KioskId $KioskId
}

Write-Host "`n--- Troubleshooting Tips ---" -ForegroundColor Cyan
Write-Host "1. Ensure the backend server is running with: python run.py --asgi"
Write-Host "2. Check that port 8000 is allowed in your firewall"
Write-Host "3. Update the ESP32 code with your correct IP address:"
Write-Host "   const char *serverUrl = `"http://$localIP`:8000/api/scan/`";" -ForegroundColor Yellow
Write-Host "4. Make sure ESP32 and your computer are on the same network"

# Ask if user wants to test continuously
$continuous = Read-Host "`nDo you want to test continuously with all test cards? (y/n)"
if ($continuous -eq "y") {
    Write-Host "Sending continuous scans. Press Ctrl+C to stop..." -ForegroundColor Yellow
    try {
        while ($true) {
            foreach ($card in $TEST_CARDS) {
                Write-Host "`nTesting card: $card" -ForegroundColor Cyan
                Test-ScanEndpoint -ServerUrl $serverUrl -CardId $card -KioskId $KioskId
                Start-Sleep -Seconds 5  # Wait 5 seconds between scans
            }
        }
    } catch {
        Write-Host "`nTest stopped by user." -ForegroundColor Yellow
    }
} 