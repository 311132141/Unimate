# Unimate - System Patterns

## System Architecture

### High-Level Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  ESP32 RFID    │────▶│  Django Backend  │◀────│  Web Frontend   │
│  Scanners      │     │  + Channels      │     │  (Vanilla JS)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  PostgreSQL  │
                        │  Database    │
                        └──────────────┘
```

### Component Relationships

#### Hardware Layer
- **ESP32 RFID Scanners**
  - WiFi-connected microcontrollers
  - MFRC522 RFID readers
  - HTTP client for API calls
  - Located at building entrances/kiosks

#### Backend Layer
- **Django Application**
  - REST API endpoints
  - JWT authentication
  - User and event management
  - WebSocket support via Channels
  
- **Django Channels**
  - WebSocket consumers
  - Real-time event broadcasting
  - Kiosk-specific groups
  - Async message handling

#### Frontend Layer
- **Static Web Application**
  - Vanilla JavaScript (no framework)
  - Three.js for 3D visualization
  - WebSocket client for real-time updates
  - Responsive CSS design

#### Data Layer
- **PostgreSQL Database**
  - User profiles with RFID mappings
  - Event and timetable data
  - Room and building information
  - Authentication tokens

## Key Technical Decisions

### Authentication Pattern
```javascript
// RFID Scan Flow
ESP32 → POST /api/scan/ → Django validates → Returns JWT → Frontend stores token

// Frontend Auth
localStorage.setItem('access_token', token)
headers: { 'Authorization': `Bearer ${token}` }
```

### WebSocket Communication
```javascript
// Connection Pattern
ws://192.168.20.22:8000/ws/kiosk/{kiosk_id}/

// Message Format
{
    "type": "card_scanned",
    "kiosk_id": "kiosk_1",
    "card_id": "5A653600",
    "user": { ... },
    "token": "..."
}
```

### 3D Map Architecture
```javascript
// Three.js Scene Structure
Scene
├── Camera (Perspective)
├── Lights (Ambient + Directional)
├── Campus Ground (Plane)
├── Buildings (Groups)
│   ├── Building Mesh
│   ├── Windows
│   ├── Details
│   └── Label (Sprite)
├── Roads (Planes)
├── Decorations (Trees, Benches)
└── Routes (Lines + Markers)
```

### Navigation State Management
```javascript
// Global State Variables
dashboardSelectedBuilding   // Currently selected building ID
dashboardSelectedClass      // Currently selected timetable event
dashboardCurrentRoute       // Active route line object
dashboardInteractiveObjects // Clickable 3D objects array
currentUserPosition         // User's current location
```

## Design Patterns

### Module Pattern
```javascript
// Encapsulation of related functionality
const NavigationModule = (function() {
    // Private variables and functions
    let selectedDestination = null;
    
    // Public API
    return {
        selectDestination: function(id) { ... },
        clearRoute: function() { ... },
        calculateRoute: function(from, to) { ... }
    };
})();
```

### Event Delegation
```javascript
// Single event listener for multiple elements
document.getElementById('timetable').addEventListener('click', function(e) {
    if (e.target.classList.contains('timetable-item')) {
        handleTimetableClick(e.target);
    }
});
```

### Observer Pattern (WebSocket)
```javascript
// WebSocket message handling
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    switch(data.type) {
        case 'card_scanned':
            handleCardScanned(data);
            break;
        case 'route_update':
            handleRouteUpdate(data);
            break;
    }
};
```

### Factory Pattern (3D Objects)
```javascript
// Building creation factory
function createBuilding(config) {
    const group = new THREE.Group();
    const building = createMainStructure(config);
    const details = addBuildingDetails(config.type);
    const windows = addWindows(config);
    
    group.add(building, details, windows);
    return group;
}
```

## API Design Patterns

### RESTful Endpoints
```
GET    /api/user-events/?username={username}  # Get user's timetable
POST   /api/scan/                             # Process RFID scan
GET    /api/buildings/                        # List all buildings
GET    /api/rooms/?building={building_id}     # Get rooms in building
```

### Response Format
```json
{
    "status": "success|error",
    "data": { ... },
    "message": "Human readable message",
    "timestamp": "2025-01-24T10:30:00Z"
}
```

### Error Handling
```python
# Consistent error responses
{
    "status": "error",
    "code": "CARD_NOT_FOUND",
    "message": "Card not registered",
    "details": { ... }
}
```

## Security Patterns

### JWT Implementation
- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days
- Tokens stored in localStorage
- Bearer token in Authorization header

### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://192.168.20.22:8000"
]
```

### Input Validation
- RFID card IDs validated as hex strings
- Room numbers sanitized before queries
- User inputs escaped in frontend
- SQL injection prevention via Django ORM

## Performance Patterns

### Lazy Loading
- 3D map loads after authentication
- Buildings load details on demand
- Timetable data cached locally
- Routes calculated asynchronously

### Debouncing
```javascript
// Prevent excessive API calls
let searchTimeout;
function handleSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
}
```

### Resource Optimization
- Minimal Three.js geometry complexity
- Efficient WebSocket message size
- Database queries use select_related
- Static assets cached by browser

## Testing Patterns

### Test Organization
```
tools/
├── standalone_rfid_server.py    # Mock backend server
├── test_rfid_scan.ps1          # PowerShell test scripts
├── test_rfid_connection.py     # Python connectivity tests
└── test_navigation_*.html      # UI component tests
```

### Test Data Strategy
- Fixed test RFID cards for consistency
- Predictable room assignments
- Mock timetable with various scenarios
- Isolated test environment

## Future Extensibility

### Plugin Architecture
- Modular frontend components
- Extensible Django apps
- WebSocket message types
- 3D map object types

### Scalability Considerations
- Database indexing on frequent queries
- WebSocket connection pooling
- CDN for static assets
- Horizontal scaling ready 

## System Architecture

### High-Level Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  ESP32 RFID    │────▶│  Django Backend  │◀────│  Web Frontend   │
│  Scanners      │     │  + Channels      │     │  (Vanilla JS)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  PostgreSQL  │
                        │  Database    │
                        └──────────────┘
```

### Component Relationships

#### Hardware Layer
- **ESP32 RFID Scanners**
  - WiFi-connected microcontrollers
  - MFRC522 RFID readers
  - HTTP client for API calls
  - Located at building entrances/kiosks

#### Backend Layer
- **Django Application**
  - REST API endpoints
  - JWT authentication
  - User and event management
  - WebSocket support via Channels
  
- **Django Channels**
  - WebSocket consumers
  - Real-time event broadcasting
  - Kiosk-specific groups
  - Async message handling

#### Frontend Layer
- **Static Web Application**
  - Vanilla JavaScript (no framework)
  - Three.js for 3D visualization
  - WebSocket client for real-time updates
  - Responsive CSS design

#### Data Layer
- **PostgreSQL Database**
  - User profiles with RFID mappings
  - Event and timetable data
  - Room and building information
  - Authentication tokens

## Key Technical Decisions

### Authentication Pattern
```javascript
// RFID Scan Flow
ESP32 → POST /api/scan/ → Django validates → Returns JWT → Frontend stores token

// Frontend Auth
localStorage.setItem('access_token', token)
headers: { 'Authorization': `Bearer ${token}` }
```

### WebSocket Communication
```javascript
// Connection Pattern
ws://192.168.20.22:8000/ws/kiosk/{kiosk_id}/

// Message Format
{
    "type": "card_scanned",
    "kiosk_id": "kiosk_1",
    "card_id": "5A653600",
    "user": { ... },
    "token": "..."
}
```

### 3D Map Architecture
```javascript
// Three.js Scene Structure
Scene
├── Camera (Perspective)
├── Lights (Ambient + Directional)
├── Campus Ground (Plane)
├── Buildings (Groups)
│   ├── Building Mesh
│   ├── Windows
│   ├── Details
│   └── Label (Sprite)
├── Roads (Planes)
├── Decorations (Trees, Benches)
└── Routes (Lines + Markers)
```

### Navigation State Management
```javascript
// Global State Variables
dashboardSelectedBuilding   // Currently selected building ID
dashboardSelectedClass      // Currently selected timetable event
dashboardCurrentRoute       // Active route line object
dashboardInteractiveObjects // Clickable 3D objects array
currentUserPosition         // User's current location
```

## Design Patterns

### Module Pattern
```javascript
// Encapsulation of related functionality
const NavigationModule = (function() {
    // Private variables and functions
    let selectedDestination = null;
    
    // Public API
    return {
        selectDestination: function(id) { ... },
        clearRoute: function() { ... },
        calculateRoute: function(from, to) { ... }
    };
})();
```

### Event Delegation
```javascript
// Single event listener for multiple elements
document.getElementById('timetable').addEventListener('click', function(e) {
    if (e.target.classList.contains('timetable-item')) {
        handleTimetableClick(e.target);
    }
});
```

### Observer Pattern (WebSocket)
```javascript
// WebSocket message handling
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    switch(data.type) {
        case 'card_scanned':
            handleCardScanned(data);
            break;
        case 'route_update':
            handleRouteUpdate(data);
            break;
    }
};
```

### Factory Pattern (3D Objects)
```javascript
// Building creation factory
function createBuilding(config) {
    const group = new THREE.Group();
    const building = createMainStructure(config);
    const details = addBuildingDetails(config.type);
    const windows = addWindows(config);
    
    group.add(building, details, windows);
    return group;
}
```

## API Design Patterns

### RESTful Endpoints
```
GET    /api/user-events/?username={username}  # Get user's timetable
POST   /api/scan/                             # Process RFID scan
GET    /api/buildings/                        # List all buildings
GET    /api/rooms/?building={building_id}     # Get rooms in building
```

### Response Format
```json
{
    "status": "success|error",
    "data": { ... },
    "message": "Human readable message",
    "timestamp": "2025-01-24T10:30:00Z"
}
```

### Error Handling
```python
# Consistent error responses
{
    "status": "error",
    "code": "CARD_NOT_FOUND",
    "message": "Card not registered",
    "details": { ... }
}
```

## Security Patterns

### JWT Implementation
- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days
- Tokens stored in localStorage
- Bearer token in Authorization header

### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://192.168.20.22:8000"
]
```

### Input Validation
- RFID card IDs validated as hex strings
- Room numbers sanitized before queries
- User inputs escaped in frontend
- SQL injection prevention via Django ORM

## Performance Patterns

### Lazy Loading
- 3D map loads after authentication
- Buildings load details on demand
- Timetable data cached locally
- Routes calculated asynchronously

### Debouncing
```javascript
// Prevent excessive API calls
let searchTimeout;
function handleSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
}
```

### Resource Optimization
- Minimal Three.js geometry complexity
- Efficient WebSocket message size
- Database queries use select_related
- Static assets cached by browser

## Testing Patterns

### Test Organization
```
tools/
├── standalone_rfid_server.py    # Mock backend server
├── test_rfid_scan.ps1          # PowerShell test scripts
├── test_rfid_connection.py     # Python connectivity tests
└── test_navigation_*.html      # UI component tests
```

### Test Data Strategy
- Fixed test RFID cards for consistency
- Predictable room assignments
- Mock timetable with various scenarios
- Isolated test environment

## Future Extensibility

### Plugin Architecture
- Modular frontend components
- Extensible Django apps
- WebSocket message types
- 3D map object types

### Scalability Considerations
- Database indexing on frequent queries
- WebSocket connection pooling
- CDN for static assets
- Horizontal scaling ready 