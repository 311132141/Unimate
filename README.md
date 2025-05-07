# Unimate - University Wayfinding App

Unimate is a mobile kiosk solution that lets university students tap their ID card and instantly see their personal timetable **and** an animated 3D route to class, right on a Galaxy Tab.

## Features

- RFID card-tap login for quick authentication
- Fallback credential login
- News and Events panel
- 3D wire-frame map with animated routing
- Timetable viewer with class and exam toggle
- Print functionality
- Public room search

## Project Structure

- **backend/** - Django + Channels backend with fixture data
- **frontend/** - HTML, CSS (Tailwind), JS, Three.js assets
- **hardware/** - ESP32 Arduino sketch + wiring diagram
- **docs/** - Design documentation

## Quick Start

### Running the Frontend (Standalone)

The easiest way to run the frontend:

```bash
cd frontend
python smart_server.py
```

This will:
1. Automatically find an available port
2. Open your browser to the app
3. Set proper MIME types for all files

### Running with Backend

To run the frontend with the backend API:

```bash
# First terminal: Start backend
cd backend
python manage.py runserver 0.0.0.0:8000

# Second terminal: Start frontend with proxy
cd frontend
python smart_server.py proxy
```

Alternatively, use the full stack launcher:

```bash
python start_unimate.py
```

## Development Notes

The smart_server.py script automatically handles port conflicts and sets correct MIME types for all files. This resolves the common issues when serving through Django.

For more detailed instructions, see:
- [Frontend README](frontend/README_FRONTEND.md)
- [Testing Scripts README](TEST_SCRIPTS_README.md)

## License

© 2025 Team UNIMATE – ENGGEN 705
