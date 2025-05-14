# UNIMATE WebSocket Tests

This directory contains test scripts for the WebSocket functionality in the UNIMATE application.

## Available Tests

1. **Simple WebSocket Test** (`websocket_test_simple.py`): 
   - A lightweight test that checks basic WebSocket connectivity to both main and kiosk endpoints
   - Verifies that the connections can be established and messages can be exchanged

2. **Comprehensive WebSocket Test** (`websocket_test.py`):
   - Tests all WebSocket functionality including connection, message exchange, and RFID notifications
   - More extensive but may require additional server setup

## Running Tests

### Prerequisites

- Make sure the UNIMATE server is running with ASGI support: `python run.py --asgi`
- Ensure you have all required dependencies: `websockets`, `requests`

### PowerShell Scripts

For Windows users, there are PowerShell scripts to simplify running the tests:

- `run_simple_test.ps1`: Runs just the simple WebSocket test
- `run_tests.ps1`: Runs both tests in sequence

To run a script:

```powershell
.\run_simple_test.ps1
```

### Manual Test Execution

You can also run the tests directly:

```bash
python websocket_test_simple.py
python websocket_test.py
```

## Troubleshooting

If you encounter connection issues:

1. Verify the server is running with ASGI support
2. Check that no other service is using ports 8000 or 8765
3. Ensure the application has the correct WebSocket routing configuration
4. Look for any errors in the server logs

## WebSocket Endpoints

The UNIMATE application provides two WebSocket endpoints:

- Main endpoint: `ws://localhost:8000/ws/unimate/`
- Kiosk endpoint: `ws://localhost:8000/ws/kiosk/<kiosk_id>/` 