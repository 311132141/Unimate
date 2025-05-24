# Unimate - University Wayfinding System

Unimate is a comprehensive wayfinding system designed for university environments, featuring RFID card integration, interactive maps, and real-time updates via WebSockets.

## Directory Structure

```
unimate/
├── backend/         # Django backend with Channels for WebSockets
├── frontend/        # Web interface
│   ├── components/  # Reusable UI components
│   ├── pages/       # Main HTML pages
│   ├── server/      # Development server
│   └── static/      # Static assets (CSS, JS, images)
├── hardware/        # Hardware integration components
│   ├── docs/        # Hardware documentation
│   ├── rfid_scanner/# ESP32 RFID scanner code
│   └── tools/       # Hardware testing utilities
├── tools/           # Development and testing tools
├── docs/            # Project documentation
└── run.py           # Main runner script
```

## Setup and Installation

### Prerequisites

- Python 3.7 or higher
- Node.js (optional, for development tools)
- ESP32 development board with MFRC522 RFID module (for hardware components)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

### Running the System

The main `run.py` script provides a convenient way to start all system components:

```bash
# Run both frontend and backend with WebSocket support
python run.py --asgi

# Run only the backend
python run.py --backend

# Run only the frontend
python run.py --frontend
```

## Features

- **RFID Card Integration**: Tap student ID cards for instant authentication
- **Interactive Maps**: Navigate through university buildings with ease
- **Real-time Updates**: WebSocket-based notifications for timely information
- **Personalized Experience**: Show customized timetables and directions

## Hardware Setup

For the RFID scanner component:

1. Connect the MFRC522 RFID module to the ESP32 board according to the wiring diagram in the hardware documentation
2. Upload the `hardware/rfid_scanner/rfid_scanner.ino` sketch to the ESP32
3. Configure the WiFi credentials and server URL in the sketch

## Testing

Various testing tools are provided in the `tools/` directory:

- Card scanning simulation
- WebSocket testing
- System integration tests

## Documentation

Comprehensive documentation can be found in the `docs/` directory, including:

- System architecture
- API reference
- Hardware specifications
- Deployment guide

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
- **frontend/** - HTML, CSS (Tailwind), JS, Three.js assets
- **hardware/** - ESP32 Arduino sketch + wiring diagram for RFID scanner
- **docs/** - Design documentation

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
