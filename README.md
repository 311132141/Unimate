# Unimate - University Wayfinding App

Unimate is a mobile kiosk solution that lets university students tap their ID card and instantly see their personal timetable **and** an animated 3D route to class, right on a Galaxy Tab.

## Current Progress

✅ **WebSocket Infrastructure**:
- Implemented Django Channels with ASGI support
- Created multiple WebSocket endpoints (main, kiosk-specific)
- Developed test scripts and browser-based testing interface
- Established connection handling and message passing

✅ **Backend Framework**:
- Django REST framework setup
- Basic authentication system with test users
- ASGI support for real-time communication
- Integrated runner script (run.py)

✅ **RFID Authentication**:
- Created Arduino sketch for ESP32 + MFRC522 module
- Implemented `/api/scan/` endpoint to handle RFID card scans
- Added Python simulator for testing without hardware
- Enhanced the login UI with card scanning indicator
- Set up WebSocket connection for real-time card scan notifications

⏳ **In-Progress Features**:
- User interface components
- 3D map visualization

## Features To Be Implemented

- Credential login UI and functionality
- News and Events display
- 3D wire-frame map with animated routing
- Timetable viewer with class and exam toggle
- Print functionality
- Public room search

## Project Structure

- **backend/** - Django + Channels backend with fixture data
- **frontend/** - Original HTML, CSS (Tailwind), JS, Three.js assets (preserved for reference)
- **pages/** - Next.js pages (main frontend)
- **components/** - React components
- **styles/** - CSS files for Next.js
- **hooks/** - Custom React hooks
- **hardware/** - ESP32 Arduino sketch + wiring diagram for RFID scanner
- **docs/** - Design documentation

## Frontend Architecture

The frontend has been migrated from pure HTML/CSS/JavaScript to **Next.js with React and TypeScript**:

### Next.js Features:
- **Server-side rendering** for better performance
- **Component-based architecture** with React
- **TypeScript support** for better development experience
- **Hot reload** for development
- **Optimized builds** for production
- **API route proxying** to Django backend

### Migration Details:
- ✅ All original functionality preserved
- ✅ Same visual design and layout
- ✅ WebSocket integration for RFID scanning
- ✅ Three.js 3D map support
- ✅ Authentication flows maintained
- ✅ API compatibility with Django backend
- ✅ Multiple view types (dashboard, kiosk, standalone)

## Quick Start

### Running the Application with Next.js Frontend

To run the full application with the new Next.js frontend:

```bash
# Start Django backend with WebSocket support
python run.py --backend --asgi

# In another terminal, start Next.js frontend
npm run dev
```

This will:
1. Start the Django backend with ASGI server on port 8000
2. Start the Next.js frontend on port 3000
3. Set up WebSocket endpoints for real-time features
4. Create a test user (username: testuser, password: password123)

### Legacy Frontend (Original)

The original HTML/CSS/JS frontend is preserved in the `frontend/` directory and can still be run:

```bash
# Start both backend and original frontend
python run.py --asgi
```

### Development URLs

- **Next.js Frontend**: http://localhost:3000
- **Django Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **Legacy Frontend**: http://localhost:8080 (when using original)

## Quick Start

### Running the Application with WebSocket Support

To run the application with full WebSocket support:

```bash
# Start both frontend and backend with ASGI support for WebSockets
python run.py --asgi
```

This will:
1. Start the Django backend with ASGI server on port 8000
2. Start the frontend server on port 8080
3. Set up WebSocket endpoints at:
   - ws://localhost:8000/ws/unimate/
   - ws://localhost:8000/ws/kiosk/{kiosk_id}/
4. Create a test user (username: testuser, password: password123)

### Testing WebSocket Functionality

Open http://localhost:8080/templates/websocket_test.html to test:
- Standalone WebSocket server connection
- Main Unimate WebSocket endpoint
- Kiosk-specific WebSocket endpoint

For Python-based testing:
```bash
cd backend/tests/websocket
python full_test.py
```

### Testing RFID Functionality

There are two ways to test the RFID functionality:

1. **Using the Python simulator**:
   ```bash
   cd hardware/esp32_rfid_scanner
   python rfid_simulator.py
   ```
   This will simulate RFID card scans with test user IDs.

2. **Using actual hardware**:
   Set up the ESP32 with MFRC522 RFID reader as described in the [hardware README](hardware/esp32_rfid_scanner/README.md).

Demo user cards:
- Alice: 04A1B2C3D4
- Bob: 04B5C6D7E8
- Carol: 0499AA11BB

## Development Notes

The WebSocket implementation uses Django Channels with an InMemoryChannelLayer for development. For production, consider using Redis as the channel backend.

Make sure to start the server with `--asgi` flag for WebSocket support:
```bash
python run.py --asgi
```

For more detailed instructions, see:
- [Frontend README](frontend/README_FRONTEND.md)
- [Testing Scripts README](TEST_SCRIPTS_README.md)
- [RFID Scanner Setup](hardware/esp32_rfid_scanner/README.md)

## Next Steps

1. **Complete Frontend Development**:
   - Implement dashboard UI with timetable view
   - Develop 3D map visualization with Three.js
   - Create timetable view with class/exam toggle
   - Design news/events panel

2. **Enhance Backend Features**:
   - Implement room search functionality
   - Create fixtures for demo data
   - Improve timetable API

3. **Testing and Optimization**:
   - Test full user flow from card scan to dashboard display
   - Optimize performance, especially for the 3D map
   - Add more comprehensive error handling

## License

© 2025 Team UNIMATE – ENGGEN 705
