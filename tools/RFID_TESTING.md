# RFID Testing Guide

This document provides instructions for testing the RFID card scanner functionality in the Unimate system.

## Quick Solution

If you're experiencing connection issues with the ESP32 RFID scanner, follow these steps:

1. **Run the standalone RFID server**:
   ```
   python tools/standalone_rfid_server.py
   ```

2. **Update the ESP32 code**:
   - Open `hardware/rfid_scanner/rfid_scanner.ino`
   - Update the `serverUrl` with your computer's IP address:
     ```cpp
     const char *serverUrl = "http://YOUR_IP_ADDRESS:8000/api/scan/";
     ```
   - Enable test mode by setting:
     ```cpp
     bool testMode = true;
     ```
   - Upload to your ESP32

3. **Verify it works**:
   - Open the test server page in your browser: http://localhost:8000/
   - Watch for incoming scans
   - The ESP32 will automatically send test scans every 5 seconds

## Detailed Instructions

### 1. Test Server Setup

The standalone test server provides a simple endpoint that mimics the Django backend's `/api/scan/` endpoint without requiring the full backend to be running.

**Features**:
- Simple HTTP server that responds to RFID scan requests
- Web interface to view scan history
- Support for all test cards
- No database or dependencies required

**Run the server**:
```
python tools/standalone_rfid_server.py
```

You can access the web interface at http://localhost:8000/

### 2. ESP32 Configuration

The ESP32 code has been simplified to focus on the core functionality:

1. **WiFi Connection**: Connects to your WiFi network
2. **RFID Reading**: Reads cards using the MFRC522 module
3. **Server Communication**: Sends card IDs to the server

**Key settings to verify**:
- `serverUrl`: Must point to your computer's IP address
- `ssid` and `password`: Must match your WiFi network
- `testMode`: Set to `true` for automatic testing without physical cards

### 3. Testing Tools

Several testing tools are provided:

1. **standalone_rfid_server.py**: Simple server that responds to RFID scan requests
2. **test_rfid_scan.ps1**: PowerShell script to test the scan endpoint
3. **test_rfid_connection.py**: Python script to test connectivity
4. **direct_test.py**: Script that tries multiple server configurations

### 4. Troubleshooting

If you're still having issues:

1. **Check firewall settings**:
   - Make sure port 8000 is allowed through your firewall
   - Try running the server on a different port:
     ```
     python tools/standalone_rfid_server.py --port 8080
     ```

2. **Verify WiFi connection**:
   - Make sure the ESP32 is connected to the same network as your computer
   - Try using a mobile hotspot if your network has restrictions

3. **Test without physical hardware**:
   - Enable test mode in the ESP32 code (`testMode = true`)
   - Use the test scripts to simulate card scans

4. **Update ESP32 library paths**:
   - If you see errors about missing libraries, make sure you've installed:
     - MFRC522
     - ArduinoJson
     - ESP32 WiFi libraries

### 5. Valid Test Cards

The following test cards are recognized by the system:

| Card ID    | Name      | User ID |
|------------|-----------|---------|
| 5A653600   | Your Card | 1       |
| 04B5C6D7E8 | Bob       | 2       |
| 0499AA11BB | Carol     | 3       |

## Next Steps

Once you've confirmed the RFID scanning works with the standalone server, you can:

1. Configure the ESP32 to point back to the Django backend:
   ```cpp
   const char *serverUrl = "http://YOUR_IP_ADDRESS:8000/api/scan/";
   ```

2. Disable test mode for production use:
   ```cpp
   bool testMode = false;
   ```

3. Implement the WebSocket functionality for real-time updates 