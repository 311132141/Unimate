# UNIMATE RFID Scanner Test Script
# This script simulates an RFID card scan using PowerShell

Write-Host "`n========================================="
Write-Host "UNIMATE RFID Scan Test (PowerShell)"
Write-Host "=========================================`n"

# Configuration
$baseUrl = "http://localhost:8000"
$scanEndpoint = "$baseUrl/api/scan/"
$validRfid = "04A1B2C3D4"  # Alice's card
$invalidRfid = "INVALID_UID"

# Test server connection
Write-Host "Testing server connection... " -NoNewline
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -UseBasicParsing
    Write-Host "OK!" -ForegroundColor Green
} 
catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Error: Unable to connect to the server at $baseUrl"
    Write-Host "Please make sure the server is running with:"
    Write-Host "  python run.py --asgi"
    exit 1
}

# Test valid RFID card
Write-Host "`nTesting valid RFID card scan ($validRfid)..."
$payload = @{
    rfid_uid = $validRfid
    kiosk = "kiosk-powershell"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $scanEndpoint -Method POST -Body $payload -ContentType "application/json" -UseBasicParsing
    Write-Host "Status code: $($response.StatusCode)" -ForegroundColor Green
    
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host "✅ Success! Card recognized."
        Write-Host "User authenticated: $($data.user.username)"
        Write-Host "Token received: $($data.access.Substring(0, 20))..."
        
        # Simplify output, show just the JWT token and username
        Write-Host "`nToken details:"
        Write-Host "  Access token: $($data.access.Substring(0, 20))..."
        Write-Host "  User: $($data.user.username)"
    }
    else {
        Write-Host "❌ Unexpected status code: $($response.StatusCode)" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Request failed: $_" -ForegroundColor Red
}

# Test invalid RFID card
Write-Host "`nTesting invalid RFID card scan ($invalidRfid)..."
$payload = @{
    rfid_uid = $invalidRfid
    kiosk = "kiosk-powershell"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $scanEndpoint -Method POST -Body $payload -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Unexpected success with status code: $($response.StatusCode)" -ForegroundColor Red
}
catch {
    # For invalid cards, we expect a 404 Not Found response
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "✅ Success! Invalid card correctly rejected with 404 Not Found." -ForegroundColor Green
    }
    else {
        Write-Host "❌ Request failed with unexpected error: $_" -ForegroundColor Red
    }
}

Write-Host "`n=========================================`n"
Write-Host "Test completed. Look at the output above to see if it was successful."
Write-Host "The RFID scan endpoint is working if the valid card test passed.`n" 