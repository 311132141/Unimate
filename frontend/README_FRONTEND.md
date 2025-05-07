# Unimate Frontend

This directory contains the frontend code for the Unimate wayfinding app.

## Quick Start

The easiest way to run the frontend is:

```
python smart_server.py
```

This will:
1. Automatically find an available port
2. Open your browser to the app
3. Set proper MIME types for all files

## Testing with Backend

To run the frontend with the backend API proxy:

```
python smart_server.py proxy
```

This will:
1. Start the frontend server
2. Forward all API calls to the backend at localhost:8000
3. Automatically find an available port if needed
4. Open your browser to the connected frontend

## Available Files

- `connected.html` - The main application HTML file
- `smart_server.py` - Smart server with auto port selection
- `server.py` - Basic HTTP server
- `proxy.py` - Server with backend API proxy
- `start_server.py` - Simple script to run either server or proxy

## File Organization

- `/static/` - Contains CSS, JS, and other static assets
- `/models/` - 3D model files for the map
- `/js/` - JavaScript files for the application

## Troubleshooting

If you see MIME type errors:
1. Make sure you're using `smart_server.py` or `server.py`
2. Don't open HTML files directly without a server
3. Check browser console for specific errors 