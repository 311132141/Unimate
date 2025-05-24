# ESP32 RFID Scanner 

This directory contains the Arduino sketch for the ESP32-based RFID card scanner for the Unimate system.

## Recent Updates

The code has been updated to handle connection issues more gracefully:

1. Added comprehensive error handling with detailed error messages
2. Implemented multiple backup server URLs to try
3. Added automatic server testing on startup
4. Improved reconnection logic with retries

## Troubleshooting Connection Issues

If you're seeing "Error sending HTTP request. Error code: -1" or similar errors, follow these steps:

### Server-Side Checks

1. **Verify the backend server is running**:
   ```
   python run.py --asgi
   ```

2. **Check firewall settings**:
   Make sure your firewall allows incoming connections on port 8000. You may need to run:
   ```
   netsh advfirewall firewall add rule name="Unimate HTTP Server" dir=in action=allow protocol=TCP localport=8000
   ```
   (Run in PowerShell or Command Prompt with admin privileges)

3. **Verify API endpoint**:
   Check that the `/api/scan/` endpoint is accessible from your computer:
   ```
   Invoke-WebRequest -Method GET -Uri "http://localhost:8000/api/scan/" -UseBasicParsing
   ```

### ESP32 Configuration

1. **Update IP addresses**:
   - Find your computer's IP address on the network: `ipconfig`
   - Update the `serverUrl` in the Arduino sketch with your IP
   - Upload the updated sketch to the ESP32

2. **Check WiFi connectivity**:
   - Make sure the ESP32 is connecting to the same network as your server
   - Check the serial output for successful WiFi connection messages

3. **Test mode**:
   - Set `testMode = true` to enable automatic test card scans
   - This helps verify connectivity without physical cards

## Understanding Error Codes

- **-1**: CONNECTION FAILED - Could not connect to server
- **-2**: CONNECTION TIMEOUT - Server didn't respond in time
- **-11**: CONNECTION REFUSED - Server actively refused connection
- **200/204**: SUCCESS - Card scan processed successfully

## Hardware Setup

- **MFRC522 -> ESP32**:
  - SDA (SS) -> GPIO 5
  - SCK -> GPIO 18
  - MOSI -> GPIO 23
  - MISO -> GPIO 19
  - GND -> GND
  - RST -> GPIO 22
  - 3.3V -> 3.3V

- **LEDs**:
  - Green LED -> GPIO 2 (with 220 ohm resistor to GND)
  - Red LED -> GPIO 4 (with 220 ohm resistor to GND) 