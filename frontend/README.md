# UNIMATE Frontend

This directory contains all the frontend code for the UNIMATE university wayfinding application.

## Directory Structure

The frontend is organized into the following directories:

- `views/` - Main page templates for the application (index.html, dashboard.html, etc.)
- `components/` - Reusable UI components (connected.html, standalone.html, etc.)
- `templates/` - Template files and test files
  - `tests/` - Test templates for WebSocket and other features
- `static/` - Static assets (CSS, JS, images)
- `tests/` - Test scripts and utilities
  - `websocket/` - WebSocket test scripts and utilities

## Usage

The main application can be started by running one of the server scripts:

```bash
python server.py  # Basic HTTP server
python smart_server.py  # Enhanced server with WebSocket support
python proxy.py  # Proxy server for development
```

Access the application by navigating to:
http://localhost:8080/components/connected.html

For direct access to the main application:
http://localhost:8080/views/index.html 

## Test Utilities

### WebSocket Testing

For testing WebSocket functionality, the frontend includes:

- Web-based test interfaces at:
  - http://localhost:8080/frontend/templates/tests/websocket_test.html
  - http://localhost:8080/frontend/templates/tests/advanced_websocket_test.html

- Test scripts:
  - `tests/websocket/direct_test.py` - Standalone WebSocket server for testing (port 8767)
  - `tests/websocket/full_test.py` - Comprehensive WebSocket test suite 