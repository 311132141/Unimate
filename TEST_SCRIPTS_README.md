# Unimate Testing Scripts

These scripts help you test your Unimate app changes quickly without dealing with complex commands.

## Available Scripts

### Python Scripts (Recommended)

- `frontend/smart_server.py` - **Best Option:** Smart server that handles port conflicts
  ```
  python smart_server.py       - Run frontend with auto port selection
  python smart_server.py proxy - Run frontend with proxy and auto port
  ```

- `start_unimate.py` - Main Python script that can run both frontend and backend
  ```
  python start_unimate.py          - Run full stack (backend + frontend)
  python start_unimate.py frontend - Run frontend only
  python start_unimate.py backend  - Run backend only
  ```

- `frontend/start_server.py` - Simple frontend server script
  ```
  python start_server.py       - Run regular frontend server
  python start_server.py proxy - Run frontend with proxy to backend
  ```

### Batch File (Windows)

- `run_unimate.bat` - Simple batch file that can run frontend or full stack
  ```
  run_unimate.bat           - Run full stack (backend + frontend)
  run_unimate.bat frontend  - Run frontend only
  run_unimate.bat frontend proxy - Run frontend with proxy
  ```

### PowerShell Scripts

- `run_unimate.ps1` - Master script for frontend or full stack
- `run_backend.ps1` - Runs just the Django backend server
- `frontend/run_test_server.ps1` - Runs just the frontend server
- `frontend/run_proxy_server.ps1` - Runs the frontend with proxy

## Usage Examples

### Using Smart Server (Best Option)

```
cd frontend
python smart_server.py
```

This will:
1. Find an available port if 8080 is in use
2. Start the frontend server on the available port
3. Automatically open your browser to the app
4. Set proper MIME types for all files

### Using Full Stack Python Script

```
python start_unimate.py
```

This will:
1. Start the Django backend server in a background thread
2. Start the frontend proxy server in the current thread
3. Automatically open your browser to the app

## How It Works

These scripts bypass the PowerShell limitation with the `&&` operator by:
1. Using proper directory changes with Python's os.chdir()
2. Using threading to run multiple processes
3. Using socket testing to find available ports

## Accessing the App

- Frontend: Automatically opened in browser (port displayed in console)
- Backend API: http://localhost:8000/api/

## Stopping the Servers

Press `Ctrl+C` in each window to stop the servers. 