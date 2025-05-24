# Unimate Frontend

This directory contains the web frontend for the Unimate system.

## Structure

- **pages/**: Main HTML pages
  - **dashboard.html**: User dashboard after login
  - **index.html**: Public landing page
  - **test-card.html**: RFID card testing utility
- **components/**: Reusable UI components
  - **connected.html**: Default kiosk view
- **static/**: Static assets
  - **css/**: Stylesheets
  - **js/**: JavaScript files
  - **images/**: Images and icons
- **server/**: Server-side code
  - **smart_server.py**: Simple HTTP server for development

## Setup

1. Ensure you have Python 3.7+ installed
2. Run the server using the main run.py script in the root directory
3. Access the frontend at http://localhost:8080

## Development

The frontend uses vanilla HTML, CSS, and JavaScript without any frameworks.

### Key Features

- RFID card scanning for authentication
- Interactive map for wayfinding
- Real-time updates via WebSockets
- User dashboard with personalized information

### WebSocket Communication

The frontend connects to the backend WebSocket endpoint for real-time updates.
The WebSocket connection is established using the kiosk ID format:

```javascript
const ws = new WebSocket(`ws://localhost:8000/ws/kiosk/${kioskId}/`);
```

This allows the kiosk to receive notifications specific to its location. 
This allows the kiosk to receive notifications specific to its location. 