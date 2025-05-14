# UNIMATE Testing

This directory contains the testing suite for the UNIMATE application.

## Running All Tests

To run all tests at once and see a summary of results:

```
python tests/run_all_tests.py
```

This script will run all individual test scripts and provide a consolidated report of which tests passed and failed.

## Core Functionality Tests

### Simple WebSocket Test

To quickly verify that WebSocket connections are working correctly:

```
python tests/simple_websocket_test.py
```

This test checks both the main WebSocket endpoint (`/ws/unimate/`) and the kiosk WebSocket endpoint (`/ws/kiosk/{kiosk_id}/`).

### Simple API Test

To quickly verify that the RFID scanning API is working correctly:

```
python tests/simple_api_test.py
```

This test checks both valid and invalid RFID card scans against the `/api/scan/` endpoint.

## Comprehensive System Test Suite

The main test file is `unimate_system_test.py`, which provides a complete test of all major components:

- WebSocket connectivity (main and kiosk endpoints)
- REST API endpoints (login, RFID scanning)
- Frontend page availability and content

### Usage

To run the complete test suite:

```
python tests/unimate_system_test.py
```

To run specific test categories:

```
python tests/unimate_system_test.py --websocket  # Test only WebSocket functionality
python tests/unimate_system_test.py --api        # Test only API endpoints
python tests/unimate_system_test.py --frontend   # Test only frontend pages
```

## Core Functionality Verification

For focused verification of the critical backend functionality (WebSockets and API):

```
python tests/verify_core.py
```

This script only tests the core functionality required for the application to work properly, without checking frontend components.

## Prerequisites

1. The UNIMATE application must be running with WebSocket support:
   ```
   python run.py --asgi
   ```

2. The Python libraries needed for testing:
   ```
   pip install websocket-client requests
   ``` 