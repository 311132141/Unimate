#!/usr/bin/env pwsh
# Simple script to send a test card scan to the RFID server

param(
    [string]$CardId = "5A653600",
    [string]$KioskId = "test-kiosk-1",
    [string]$ServerUrl = "http://localhost:8000/api/scan/"
)

# Create the payload
$payload = @{
    rfid_uid = $CardId
    kiosk    = $KioskId
} | ConvertTo-Json

# Display what we're sending
Write-Host "Sending card scan:" -ForegroundColor Cyan
Write-Host "  Card ID: $CardId"
Write-Host "  Kiosk ID: $KioskId"
Write-Host "  Server URL: $ServerUrl"

# Send the request
try {
    $response = Invoke-RestMethod -Method POST -Uri $ServerUrl -Body $payload -ContentType "application/json" -ErrorAction Stop
    
    # Display the response
    Write-Host "Success! Server accepted the card scan." -ForegroundColor Green
    $response | Format-List
}
catch {
    Write-Host "Error sending scan: $_" -ForegroundColor Red
}

# Usage examples
Write-Host "`nUsage examples:" -ForegroundColor Yellow
Write-Host "  # Send a scan with the default card"
Write-Host "  .\tools\send_test_scan.ps1"
Write-Host ""
Write-Host "  # Send a scan with a specific card"
Write-Host "  .\tools\send_test_scan.ps1 -CardId 04B5C6D7E8"
Write-Host ""
Write-Host "  # Send to a different server URL"
Write-Host "  .\tools\send_test_scan.ps1 -ServerUrl http://192.168.20.22:8000/api/scan/" 