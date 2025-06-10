# Unimate - University Wayfinding App

Unimate is a comprehensive university wayfinding and timetable system designed for Galaxy Tab kiosks. Students can tap their RFID ID card to instantly access their personalized timetable and navigate campus using an interactive 3D map with real-time routing.

## Architecture Overview

This project consists of multiple interconnected components:

### Frontend Application
1. **HTML Frontend** (`frontend/`) - Complete HTML/CSS/JS kiosk interface

### Backend Services
- **Django REST API** (`backend/`) - Complete backend with authentication, timetables, and WebSocket support
- **RFID Hardware Integration** (`hardware/`) - ESP32-based card scanning system

### Key Technologies
- **Frontend**: HTML5, CSS3 (Tailwind), JavaScript, Three.js
- **Backend**: Django, Django REST Framework, Django Channels (WebSockets), SQLite
- **Hardware**: ESP32, MFRC522 RFID reader
- **Real-time**: WebSocket connections for live updates

## Development Status & Current Progress

### ✅ **Production-Ready Components**

#### Complete Backend Infrastructure
- **Django REST API**: Full CRUD operations for users, courses, events, and rooms
- **Authentication System**: JWT tokens with refresh mechanism + RFID integration
- **WebSocket Support**: Real-time communication via Django Channels
- **Database**: Complete data models with demo fixtures
- **API Documentation**: RESTful endpoints with proper serialization

#### Working Frontend Applications
- **Traditional Kiosk** (`frontend/connected.html`): **FULLY FUNCTIONAL**
  - Complete 3D campus map with Three.js
  - RFID authentication integration
  - Real-time timetable updates
  - Interactive building navigation
  - Responsive design for Galaxy Tab

- **Dashboard Interface** (`frontend/dashboard.html`): **FEATURE COMPLETE**
  - Multi-view navigation (Dashboard, Timetable, Map, Events, Settings)
  - Interactive 3D map with route planning
  - Event management and navigation
  - Print-ready timetable layouts

#### Hardware Integration
- **RFID Scanner**: ESP32 + MFRC522 working implementation
- **Card Authentication**: Real-time scanning with WebSocket notifications
- **Testing Tools**: Python simulator for development without hardware

### ⏳ **In Development**

#### Enhanced Features
- **Multi-language Support**: Framework ready, translations needed
- **Analytics Dashboard**: Data collection implemented, visualization pending
- **Advanced Routing**: Building-to-building pathfinding algorithms
- **Offline Mode**: Local data caching for tablet kiosks
- **Mobile Optimization**: Enhanced responsive design for various screen sizes



## Understanding the System Flow

### 1. User Authentication Flow
```
RFID Card Tap → ESP32 Scanner → Django API → WebSocket Notification → Frontend Update
     ↓
Alternative: Manual Login → Username/Password → JWT Token → Dashboard Access
```

### 2. Data Flow Architecture
```
Frontend (HTML/JS) ←→ Django REST API ←→ SQLite Database
                 ↕                    ↕
            WebSocket Server    ←→  RFID Hardware
```

### 3. 3D Map System
- **Three.js Rendering**: Campus buildings as 3D meshes with interactive controls
- **Navigation**: Click-to-navigate with animated routing between buildings
- **Real-time Updates**: WebSocket-powered live location sharing

### 4. Key API Endpoints
- `POST /api/login/` - Username/password authentication
- `POST /api/scan/` - RFID card authentication  
- `GET /api/events/` - User's timetable events
- `GET /api/courses/` - Available courses
- `GET /api/route/` - Building navigation data
- `ws://localhost:8000/ws/unimate/` - WebSocket for real-time updates

## For Developers: Getting Started

### Quick Start (Recommended)
1. **Run the complete system**:
   ```bash
   python run.py --asgi
   ```
   This starts both backend (port 8000) and frontend (port 8080) with WebSocket support.

2. **Access the applications**:
   - Main Kiosk: http://localhost:8080/components/connected.html
   - Dashboard: http://localhost:8080/views/dashboard.html
   - WebSocket Testing: http://localhost:8080/templates/websocket_test.html

3. **Test with demo accounts**:
   - Username: `testuser`, Password: `password123`
   - Username: `alice`, Password: `alice123`
   - RFID Cards: `04A1B2C3D4`, `04B5C6D7E8`, `0499AA11BB`

### Development Setup

#### Backend Only
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures/*.json
python manage.py runserver
```

#### Frontend Only
```bash
cd frontend
npm install
npm run serve  # or python smart_server.py
```

#### Hardware Testing
Set up ESP32 with MFRC522 (see `hardware/esp32_rfid_scanner/README.md`)

#### Software Simulation
```bash
cd hardware/esp32_rfid_scanner
python rfid_simulator.py
```

### Understanding the HTML Files

If you're starting with just the HTML files, here's what each does:

#### Core Application Files
- **`frontend/components/connected.html`** - **MAIN KIOSK APPLICATION**
  - Complete standalone application
  - Embedded 3D campus map with Three.js
  - RFID scanning integration
  - Real-time WebSocket connections
  - User authentication and timetable display

- **`frontend/views/dashboard.html`** - **ADVANCED DASHBOARD**
  - Multi-panel interface (timetable + map)
  - Navigation between different views
  - Interactive 3D map with building selection
  - Event details and navigation features

- **`frontend/views/index.html`** - **LOGIN PAGE**
  - User authentication interface
  - RFID card scanning indicator
  - Responsive design for tablet kiosks

#### Supporting Files
- **`frontend/views/map_view.html`** - Fullscreen 3D map interface
- **`frontend/static/site.css`** - Complete styling system
- **`frontend/static/js/app.js`** - Frontend JavaScript logic

#### Testing and Demo Files
- **`frontend/components/standalone.html`** - Simplified demo
- **`frontend/templates/tests/websocket_test.html`** - WebSocket testing
- **`frontend/test_responsive.html`** - Responsive design testing

## Features To Be Implemented

- **Frontend User Interface**:
  - Modern dashboard with timetable viewer
  - 3D wireframe campus map with animated routing
  - Class and exam toggle functionality
  - News and events display panel
  - Print functionality for schedules
  - Public room search interface

- **Enhanced Backend Features**:
  - Advanced room search and filtering
  - Event notifications and reminders
  - Multi-campus support
  - Analytics and usage tracking

- **Mobile & Hardware Integration**:
  - Galaxy Tab kiosk optimization
  - Enhanced RFID scanning feedback
  - Offline mode capabilities

## Project Structure Deep Dive

### Frontend Application (`frontend/`)

Complete kiosk implementation using vanilla web technologies:

```
frontend/
├── components/                 # Standalone HTML components
│   ├── connected.html         # Main kiosk application (COMPLETE)
│   ├── complete_standalone.html # Self-contained demo
│   └── standalone.html        # Simplified version
├── views/                     # Page templates
│   ├── dashboard.html         # User dashboard with 3D map
│   ├── index.html            # Login/landing page
│   ├── map_view.html         # Full-screen 3D campus map
│   └── map_*.html            # Map variations and offline versions
├── static/
│   ├── site.css              # Complete styling (dark theme, responsive)
│   └── js/app.js             # Main application logic
└── package.json              # Dependencies (Three.js, Axios, Tailwind)
```

**Key Files for Understanding the System:**
- `connected.html` - **START HERE**: Complete working kiosk with embedded 3D map
- `dashboard.html` - Advanced dashboard with timetable + 3D map integration
- `static/site.css` - All styling including responsive design and animations
- `static/js/app.js` - Frontend logic, API calls, Three.js 3D rendering

### Backend System (`backend/`)

Complete Django REST API with real-time WebSocket support:

```
backend/
├── unimate/                   # Main Django app
│   ├── models.py             # Data models (User, Course, Event, Room)
│   ├── views.py              # API endpoints and business logic
│   ├── serializers.py        # JSON serialization
│   ├── consumers.py          # WebSocket handlers
│   ├── routing.py            # WebSocket URL routing
│   └── fixtures/             # Demo data (users, courses, events)
├── app/                      # Django project settings
│   ├── settings.py           # Configuration
│   ├── urls.py               # URL routing
│   └── asgi.py               # ASGI config for WebSockets
├── requirements.txt          # Python dependencies
└── manage.py                 # Django management commands
```

### Hardware Integration (`hardware/`)

RFID card scanning system:

```
hardware/
├── esp32_rfid_scanner/
│   ├── rfid_scanner.ino      # Arduino code for ESP32 + MFRC522
│   ├── rfid_simulator.py     # Python simulator for testing
│   └── README.md             # Hardware setup instructions
└── esp32_unimate.ino         # Alternative ESP32 implementation
```

## Technology Stack & Dependencies

### Frontend Technologies
```json
// Frontend Dependencies (frontend/package.json)
{
  "dependencies": {
    "three": "^0.170.0",           // 3D graphics and campus map
    "axios": "^1.7.9",             // HTTP client for API calls
    "tailwindcss": "^3.4.15",      // Utility-first CSS framework
    "http-server": "^14.1.1"       // Development server
  }
}
```

### Backend Technologies
```python
# backend/requirements.txt
Django==5.0.2                    # Web framework
djangorestframework==3.14.0      # REST API framework
djangorestframework-simplejwt==5.3.1  # JWT authentication
django-channels==4.0.0           # WebSocket support
django-cors-headers==4.3.1       # CORS handling
daphne==4.1.2                    # ASGI server
```

### Hardware Requirements
- **Galaxy Tab** (primary target device)
- **ESP32 microcontroller** with WiFi capability
- **MFRC522 RFID reader module**
- **RFID cards** (MIFARE Classic compatible)

## Quick Reference: Key Files to Examine

### For Frontend Developers
1. **`frontend/components/connected.html`** - Complete working kiosk application
2. **`frontend/static/site.css`** - All styling and responsive design
3. **`frontend/static/js/app.js`** - JavaScript logic and Three.js implementation
4. **`frontend/views/dashboard.html`** - Advanced dashboard interface

### For Backend Developers
1. **`backend/unimate/models.py`** - Database schema and relationships
2. **`backend/unimate/views.py`** - API endpoints and business logic
3. **`backend/unimate/consumers.py`** - WebSocket handlers
4. **`backend/app/urls.py`** - URL routing and API configuration

### For System Integration
1. **`run.py`** - Master script to start entire system
2. **`backend/app/settings.py`** - Django configuration
3. **`hardware/esp32_rfid_scanner/`** - RFID hardware integration
4. **`tests/`** - System testing and validation scripts

## Demo Data & Test Accounts

The system comes with comprehensive demo data for immediate testing:

### User Accounts
| Username | Password | RFID Card | Role |
|----------|----------|-----------|------|
| testuser | password123 | 04A1B2C3D4 | Student |
| alice | alice123 | 04A1B2C3D4 | Student |
| bob | bob123 | 04B5C6D7E8 | Student |
| carol | carol123 | 0499AA11BB | Student |

### Sample Course Data
- **ENGGEN205**: Engineering Mechanics
- **STATS100**: Statistics
- **COMPSCI101**: Computer Science Fundamentals
- **MATH108**: Mathematics for Engineering

### Campus Buildings (3D Map)
- **Main Building**: Central administration
- **Engineering Labs**: ENGGEN courses
- **Science Building**: STATS and science courses
- **Library**: Study and resources
- **Student Center**: Events and activities

## Troubleshooting & Common Issues

### Frontend Issues
- **3D Map not loading**: Check Three.js CDN availability and WebGL support
- **API calls failing**: Verify backend is running on port 8000
- **Styling broken**: Ensure Tailwind CSS is properly loaded

### Backend Issues
- **WebSocket connections failing**: Start with `python run.py --asgi`
- **CORS errors**: Check `django-cors-headers` configuration
- **Database errors**: Run `python manage.py migrate` and load fixtures

### Hardware Issues
- **RFID not detected**: Check ESP32 wiring and power supply
- **Card read errors**: Verify MFRC522 connections and card compatibility
- **Network connectivity**: Ensure ESP32 can reach Django API endpoint

## Next Steps & Future Development

### Immediate Priorities (Current Sprint)
1. **Frontend Enhancement**:
   - Enhanced 3D map interactions and performance optimization
   - Improved accessibility features and WCAG 2.1 compliance
   - Advanced timetable filtering and search functionality
   - Multi-language interface support

2. **Production Readiness**:
   - Implement Redis channel layer for WebSocket scaling
   - Add comprehensive error handling and user feedback
   - Create Docker containers for easy deployment
   - Set up CI/CD pipeline for automated testing

3. **Quality Assurance**:
   - End-to-end testing from RFID scan to dashboard display
   - Performance optimization for 3D map rendering on tablets
   - Cross-browser compatibility testing
   - Accessibility compliance validation

### Medium-term Goals
1. **Enhanced User Experience**:
   - Multi-language support (English, Spanish, Mandarin)
   - Offline mode with local data caching
   - Voice navigation and accessibility features
   - Customizable themes and layouts

2. **Advanced Features**:
   - Multi-campus support with campus switching
   - Integration with university information systems
   - Push notifications for schedule changes
   - Analytics dashboard for usage patterns

3. **Scalability & Security**:
   - Load balancer configuration for multiple kiosks
   - Enhanced security measures and penetration testing
   - Database optimization and caching strategies
   - Monitoring and alerting systems

### Long-term Vision
- **AI-Powered Navigation**: Machine learning for optimal route suggestions
- **AR Integration**: Augmented reality wayfinding using tablet cameras
- **IoT Expansion**: Integration with smart building systems
- **Mobile App**: Companion smartphone application for students

## Contributing & Development Guidelines

### Code Organization
- **Frontend**: Use semantic HTML5, modern CSS (Grid/Flexbox), vanilla JavaScript
- **Styling**: Tailwind CSS utility classes with custom CSS for complex layouts
- **3D Graphics**: Three.js for campus map rendering and interactions
- **Backend**: Django REST conventions, comprehensive API documentation, proper error handling
- **Testing**: Unit tests for components, integration tests for APIs, E2E tests for user flows

### Development Workflow
1. Start with `python run.py --asgi` for full system
2. Use `frontend/components/connected.html` as reference for features
3. Test RFID functionality with Python simulator
4. Validate WebSocket connections through test interface
5. Check responsive design on various screen sizes

---

## License & Team

**© 2025 Team UNIMATE – ENGGEN 705**

This project is developed as part of the Engineering Design course at the University of Auckland. For questions, contributions, or collaboration opportunities, please refer to the individual component README files or contact the development team.

### Additional Resources
- **Frontend README**: `frontend/README_FRONTEND.md`
- **Hardware Setup**: `hardware/esp32_rfid_scanner/README.md`
- **Testing Guide**: `tests/README.md`
- **API Documentation**: Available at `http://localhost:8000/api/` when backend is running
