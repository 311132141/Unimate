# UNIMATE Backend Templates

This directory contains template files used by the UNIMATE backend Django application.

## Folder Structure

- **tests/** - Testing templates
  - `websocket_test.html` - Basic WebSocket testing interface
  - `advanced_websocket_test.html` - Advanced WebSocket testing with additional features

## Usage

These templates are primarily used for testing and debugging purposes. You can access them through the Django development server:

```bash
python run.py --asgi  # Start the Django server with ASGI support
```

Access the WebSocket test interface:
http://localhost:8000/templates/tests/websocket_test.html

Access the advanced WebSocket test interface:
http://localhost:8000/templates/tests/advanced_websocket_test.html 