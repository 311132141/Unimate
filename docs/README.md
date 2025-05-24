# Unimate Documentation

This directory contains comprehensive documentation for the Unimate university wayfinding system.

## Contents

- [System Architecture](architecture.md)
- [Installation Guide](installation.md)
- [User Guide](user_guide.md)
- [API Reference](api_reference.md)
- [Hardware Setup](hardware_setup.md)
- [WebSocket Protocol](websocket_protocol.md)
- [Development Guide](development_guide.md)

## System Overview

Unimate is a university wayfinding system that combines hardware (RFID card readers) with software (web interface and backend) to provide personalized navigation and timetable services to students.

### Key Components

1. **Django Backend**
   - RESTful API for authentication and data retrieval
   - WebSocket integration via Django Channels
   - SQLite database (can be upgraded to PostgreSQL for production)

2. **Web Frontend**
   - Responsive interface for both desktop and mobile
   - Interactive map for navigation
   - Real-time updates via WebSockets

3. **ESP32 RFID Scanner**
   - Hardware component for reading student ID cards
   - Wi-Fi connectivity to the backend
   - LED indicators for successful/failed scans

## Getting Started

For quick setup, see the [Installation Guide](installation.md).

## Contributing

For developers looking to contribute to the project, see the [Development Guide](development_guide.md).

## Support

For technical support or feature requests, please create an issue in the project repository. 

This directory contains comprehensive documentation for the Unimate university wayfinding system.

## Contents

- [System Architecture](architecture.md)
- [Installation Guide](installation.md)
- [User Guide](user_guide.md)
- [API Reference](api_reference.md)
- [Hardware Setup](hardware_setup.md)
- [WebSocket Protocol](websocket_protocol.md)
- [Development Guide](development_guide.md)

## System Overview

Unimate is a university wayfinding system that combines hardware (RFID card readers) with software (web interface and backend) to provide personalized navigation and timetable services to students.

### Key Components

1. **Django Backend**
   - RESTful API for authentication and data retrieval
   - WebSocket integration via Django Channels
   - SQLite database (can be upgraded to PostgreSQL for production)

2. **Web Frontend**
   - Responsive interface for both desktop and mobile
   - Interactive map for navigation
   - Real-time updates via WebSockets

3. **ESP32 RFID Scanner**
   - Hardware component for reading student ID cards
   - Wi-Fi connectivity to the backend
   - LED indicators for successful/failed scans

## Getting Started

For quick setup, see the [Installation Guide](installation.md).

## Contributing

For developers looking to contribute to the project, see the [Development Guide](development_guide.md).

## Support

For technical support or feature requests, please create an issue in the project repository. 