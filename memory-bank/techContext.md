# Unimate - Technical Context

## Technology Stack

### Backend Technologies

#### Django (4.2+)
- **Purpose:** Web framework and API server
- **Key Features Used:**
  - REST API via Django REST Framework
  - ORM for database management
  - Admin interface for data management
  - Static file serving

#### Django Channels
- **Purpose:** WebSocket support for real-time features
- **Key Features Used:**
  - Async consumers for WebSocket handling
  - Channel layers for message broadcasting
  - Group management for kiosk-specific messaging
  - ASGI server configuration

#### PostgreSQL
- **Purpose:** Primary database
- **Key Features Used:**
  - User authentication data
  - Event and timetable storage
  - Building and room information
  - RFID card mappings

### Frontend Technologies

#### Vanilla JavaScript (ES6+)
- **Purpose:** Core application logic
- **Key Features Used:**
  - No framework dependencies
  - Async/await for API calls
  - Event delegation patterns
  - LocalStorage for token management

#### Three.js (r128)
- **Purpose:** 3D campus visualization
- **Key Features Used:**
  - WebGL rendering
  - 3D object creation and manipulation
  - Raycasting for object interaction
  - Camera controls

#### Axios
- **Purpose:** HTTP client library
- **Key Features Used:**
  - Promise-based API calls
  - Request/response interceptors
  - JWT token headers
  - Error handling

### Hardware Technologies

#### ESP32 Microcontroller
- **Purpose:** RFID scanning device
- **Key Features Used:**
  - WiFi connectivity
  - HTTP client capabilities
  - Low power consumption
  - Multiple GPIO pins

#### MFRC522 RFID Reader
- **Purpose:** Card scanning hardware
- **Key Features Used:**
  - 13.56 MHz frequency
  - Mifare card support
  - SPI communication
  - 3.3V operation

## Development Setup

### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Database setup
python manage.py migrate
python manage.py createsuperuser
python backend/setup_data.py

# Run development server
python run.py --asgi  # For WebSocket support
```

### Frontend Setup
```bash
# No build process required
# Serve static files directly
# Access via browser at http://localhost:8000
```

### ESP32 Setup
```cpp
// Key configuration in ESP32 code
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* serverUrl = "http://192.168.20.22:8000/api/scan/";
```

## Dependencies

### Python Dependencies
```
Django==4.2.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.2.2
channels==4.0.0
channels-redis==4.1.0
daphne==4.0.0
psycopg2-binary==2.9.6
python-decouple==3.8
corsheaders==4.0.0
Pillow==9.5.0
```

### JavaScript Dependencies
```html
<!-- Loaded via CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

### ESP32 Libraries
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>
```

## Development Environment

### Required Tools
- Python 3.9+
- Node.js 16+ (for tooling only)
- Git for version control
- PostgreSQL 13+
- Arduino IDE or PlatformIO

### Recommended IDE Setup
- VSCode with extensions:
  - Python
  - Django
  - JavaScript (ES6) snippets
  - Three.js snippets
  - Arduino/PlatformIO

### Environment Variables
```bash
# .env file
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:pass@localhost/unimate
ALLOWED_HOSTS=localhost,192.168.20.22
```

## Network Configuration

### Campus Network
- **Subnet:** 192.168.20.0/24
- **Server IP:** 192.168.20.22
- **Port:** 8000 (HTTP/WebSocket)
- **CORS:** Configured for local access

### WebSocket Endpoints
```
ws://192.168.20.22:8000/ws/kiosk/{kiosk_id}/
ws://192.168.20.22:8000/ws/updates/
```

### API Endpoints
```
http://192.168.20.22:8000/api/scan/
http://192.168.20.22:8000/api/user-events/
http://192.168.20.22:8000/api/buildings/
```

## Technical Constraints

### Browser Requirements
- Chrome 90+, Firefox 88+, Safari 14+
- WebGL support required
- JavaScript enabled
- LocalStorage available

### Performance Targets
- Page load: < 3 seconds
- 3D map render: < 5 seconds
- API response: < 500ms
- WebSocket latency: < 100ms

### Hardware Limitations
- ESP32: 520KB RAM, 4MB Flash
- RFID range: ~5cm
- WiFi stability requirements
- Power supply considerations

## Deployment Configuration

### Production Setup
```bash
# Gunicorn for HTTP
gunicorn backend.wsgi:application

# Daphne for WebSocket
daphne -b 0.0.0.0 -p 8000 backend.asgi:application

# Nginx reverse proxy
location /ws/ {
    proxy_pass http://localhost:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

### Static Files
```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'frontend/static',
]
```

### Database Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'unimate',
        'USER': 'unimate_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Security Configuration

### Django Settings
```python
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = True  # In production
SESSION_COOKIE_SECURE = True  # In production
```

### CORS Settings
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://192.168.20.22:8000",
]
CORS_ALLOW_CREDENTIALS = True
```

## Monitoring & Logging

### Application Logs
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'unimate.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
        },
        'api': {
            'handlers': ['file'],
            'level': 'DEBUG',
        },
    },
}
```

### Performance Monitoring
- Django Debug Toolbar (development)
- Browser DevTools for frontend
- Network tab for API timing
- Three.js stats for FPS monitoring 

## Technology Stack

### Backend Technologies

#### Django (4.2+)
- **Purpose:** Web framework and API server
- **Key Features Used:**
  - REST API via Django REST Framework
  - ORM for database management
  - Admin interface for data management
  - Static file serving

#### Django Channels
- **Purpose:** WebSocket support for real-time features
- **Key Features Used:**
  - Async consumers for WebSocket handling
  - Channel layers for message broadcasting
  - Group management for kiosk-specific messaging
  - ASGI server configuration

#### PostgreSQL
- **Purpose:** Primary database
- **Key Features Used:**
  - User authentication data
  - Event and timetable storage
  - Building and room information
  - RFID card mappings

### Frontend Technologies

#### Vanilla JavaScript (ES6+)
- **Purpose:** Core application logic
- **Key Features Used:**
  - No framework dependencies
  - Async/await for API calls
  - Event delegation patterns
  - LocalStorage for token management

#### Three.js (r128)
- **Purpose:** 3D campus visualization
- **Key Features Used:**
  - WebGL rendering
  - 3D object creation and manipulation
  - Raycasting for object interaction
  - Camera controls

#### Axios
- **Purpose:** HTTP client library
- **Key Features Used:**
  - Promise-based API calls
  - Request/response interceptors
  - JWT token headers
  - Error handling

### Hardware Technologies

#### ESP32 Microcontroller
- **Purpose:** RFID scanning device
- **Key Features Used:**
  - WiFi connectivity
  - HTTP client capabilities
  - Low power consumption
  - Multiple GPIO pins

#### MFRC522 RFID Reader
- **Purpose:** Card scanning hardware
- **Key Features Used:**
  - 13.56 MHz frequency
  - Mifare card support
  - SPI communication
  - 3.3V operation

## Development Setup

### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Database setup
python manage.py migrate
python manage.py createsuperuser
python backend/setup_data.py

# Run development server
python run.py --asgi  # For WebSocket support
```

### Frontend Setup
```bash
# No build process required
# Serve static files directly
# Access via browser at http://localhost:8000
```

### ESP32 Setup
```cpp
// Key configuration in ESP32 code
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* serverUrl = "http://192.168.20.22:8000/api/scan/";
```

## Dependencies

### Python Dependencies
```
Django==4.2.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.2.2
channels==4.0.0
channels-redis==4.1.0
daphne==4.0.0
psycopg2-binary==2.9.6
python-decouple==3.8
corsheaders==4.0.0
Pillow==9.5.0
```

### JavaScript Dependencies
```html
<!-- Loaded via CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

### ESP32 Libraries
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>
```

## Development Environment

### Required Tools
- Python 3.9+
- Node.js 16+ (for tooling only)
- Git for version control
- PostgreSQL 13+
- Arduino IDE or PlatformIO

### Recommended IDE Setup
- VSCode with extensions:
  - Python
  - Django
  - JavaScript (ES6) snippets
  - Three.js snippets
  - Arduino/PlatformIO

### Environment Variables
```bash
# .env file
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:pass@localhost/unimate
ALLOWED_HOSTS=localhost,192.168.20.22
```

## Network Configuration

### Campus Network
- **Subnet:** 192.168.20.0/24
- **Server IP:** 192.168.20.22
- **Port:** 8000 (HTTP/WebSocket)
- **CORS:** Configured for local access

### WebSocket Endpoints
```
ws://192.168.20.22:8000/ws/kiosk/{kiosk_id}/
ws://192.168.20.22:8000/ws/updates/
```

### API Endpoints
```
http://192.168.20.22:8000/api/scan/
http://192.168.20.22:8000/api/user-events/
http://192.168.20.22:8000/api/buildings/
```

## Technical Constraints

### Browser Requirements
- Chrome 90+, Firefox 88+, Safari 14+
- WebGL support required
- JavaScript enabled
- LocalStorage available

### Performance Targets
- Page load: < 3 seconds
- 3D map render: < 5 seconds
- API response: < 500ms
- WebSocket latency: < 100ms

### Hardware Limitations
- ESP32: 520KB RAM, 4MB Flash
- RFID range: ~5cm
- WiFi stability requirements
- Power supply considerations

## Deployment Configuration

### Production Setup
```bash
# Gunicorn for HTTP
gunicorn backend.wsgi:application

# Daphne for WebSocket
daphne -b 0.0.0.0 -p 8000 backend.asgi:application

# Nginx reverse proxy
location /ws/ {
    proxy_pass http://localhost:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

### Static Files
```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'frontend/static',
]
```

### Database Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'unimate',
        'USER': 'unimate_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Security Configuration

### Django Settings
```python
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = True  # In production
SESSION_COOKIE_SECURE = True  # In production
```

### CORS Settings
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://192.168.20.22:8000",
]
CORS_ALLOW_CREDENTIALS = True
```

## Monitoring & Logging

### Application Logs
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'unimate.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
        },
        'api': {
            'handlers': ['file'],
            'level': 'DEBUG',
        },
    },
}
```

### Performance Monitoring
- Django Debug Toolbar (development)
- Browser DevTools for frontend
- Network tab for API timing
- Three.js stats for FPS monitoring 