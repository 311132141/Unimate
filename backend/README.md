# UNIMATE - University Navigator & Event Manager

UNIMATE is an interactive wayfinding and event management application designed for university students and staff. It provides a modern interface for accessing timetables, navigating campus, and receiving real-time updates.

## Features

- **User Authentication**: Login via RFID cards or traditional username/password
- **Event Management**: View timetables and upcoming events
- **Campus Navigation**: Interactive 3D map for campus navigation
- **Real-time Updates**: WebSocket-based instant notifications
- **Kiosk Support**: Deploy to information kiosks around campus

## Project Structure

```
backend/
├── app/                   # Django project configuration
├── unimate/               # Main Django application
├── websocket/             # WebSocket server implementation
├── tests/                 # Test scripts and utilities
│   ├── api/               # API tests
│   └── websocket/         # WebSocket tests
├── static/                # Static files
│   ├── js/                # JavaScript files
│   └── css/               # CSS files
├── templates/             # HTML templates
├── utils/                 # Utility functions
├── manage.py              # Django management script
└── requirements.txt       # Project dependencies
```

## Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```
   python manage.py migrate
   ```

5. Load sample data (optional):
   ```
   python setup_data.py
   ```

## Running the Application

### Django Development Server

```
python manage.py runserver
```

### ASGI Server (with WebSocket support)

```
python websocket/run_asgi_server.py
```

### Standalone WebSocket Server

```
python websocket/server.py
```

## Testing

### API Tests

```
python -m tests.api.test
```

### WebSocket Tests

```
python -m tests.websocket.test
```

### WebSocket UI Testing

Access the WebSocket test interface at:
```
http://localhost:8000/templates/advanced_websocket_test.html
```

## Deployment

For production deployment, it's recommended to use:
- Daphne or Uvicorn as the ASGI server
- Gunicorn as the WSGI server (if WebSocket support is not needed)
- Nginx as the reverse proxy

## License

This project is licensed under the MIT License - see the LICENSE file for details. 