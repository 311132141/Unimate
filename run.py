#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
UNIMATE Runner Script
--------------------
This script starts the Unimate application with proper WebSocket support.

Usage:
  python run.py                - Start both backend and frontend
  python run.py --backend      - Start only backend
  python run.py --frontend     - Start only frontend
  python run.py --asgi         - Start backend with explicit ASGI support for WebSockets
  python run.py --help         - Show this help message

WebSocket Integration:
  For WebSocket functionality, always run with the --asgi flag:
    python run.py --asgi
  
  WebSocket endpoints:
    - Main endpoint:     ws://localhost:8000/ws/unimate/
    - Kiosk endpoint:    ws://localhost:8000/ws/kiosk/{kiosk_id}/
    - Test endpoint:     ws://localhost:8765 (direct standalone server)
  
  Test WebSocket functionality with:
    - Browser:           http://localhost:8080/frontend/templates/tests/websocket_test.html
    - Python:            python tests/unimate_system_test.py --websocket
"""

import os
import sys
import subprocess
import time
import argparse
import threading
import logging
import socket
import platform

# Force UTF-8 encoding for subprocess calls to handle Chinese characters
os.environ["PYTHONIOENCODING"] = "utf-8"

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('unimate_runner')

def is_port_in_use(port, host='127.0.0.1'):
    """Check if a port is in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((host, port)) == 0

def run_command_in_thread(command, cwd=None, prefix=None):
    """Run a command in a separate thread with output prefixing."""
    def run_command():
        try:
            process = subprocess.Popen(
                command,
                cwd=cwd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding='utf-8',
                errors='replace',
                bufsize=1  # Line buffered
            )
            
            # Process and print output with prefix
            for line in process.stdout:
                if prefix:
                    print(f"[{prefix}] {line.rstrip()}")
                else:
                    print(line.rstrip())
            
            process.wait()
            if process.returncode != 0:
                logger.error(f"Command {command} exited with code {process.returncode}")
        except Exception as e:
            logger.error(f"Error running command {command}: {e}")
    
    thread = threading.Thread(target=run_command)
    thread.daemon = True
    thread.start()
    return thread

def run_asgi_server():
    """Run the Django backend with ASGI server for WebSocket support."""
    logger.info("Starting Uvicorn ASGI server on 0.0.0.0:8000")
    
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    
    # Check if we have uvicorn installed
    try:
        import uvicorn
        has_uvicorn = True
    except ImportError:
        has_uvicorn = False
        logger.warning("Uvicorn not installed. Attempting to install it...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "uvicorn"])
            logger.info("Uvicorn installed successfully")
            has_uvicorn = True
        except Exception as e:
            logger.error(f"Failed to install uvicorn: {e}")
    
    if has_uvicorn:
        # Start uvicorn directly
        return run_command_in_thread(
            [sys.executable, "-m", "uvicorn", "app.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--reload"],
            cwd=backend_dir,
            prefix="Backend"
        )
    else:
        # Fall back to daphne if uvicorn isn't available
        try:
            return run_command_in_thread(
                [sys.executable, "-m", "daphne", "-b", "0.0.0.0", "-p", "8000", "app.asgi:application"],
                cwd=backend_dir,
                prefix="Backend"
            )
        except Exception as e:
            logger.error(f"Failed to start ASGI server: {e}")
            return None

def run_django_server():
    """Run the Django backend with regular runserver."""
    logger.info("Starting Django development server on 0.0.0.0:8000")
    
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    return run_command_in_thread(
        [sys.executable, "manage.py", "runserver", "0.0.0.0:8000"],
        cwd=backend_dir,
        prefix="Backend"
    )

def run_frontend_server():
    """Run the frontend server."""
    logger.info("Starting frontend server on port 8080")
    
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")
    
    # Try to use smart_server.py if it exists
    smart_server = os.path.join(frontend_dir, "smart_server.py")
    if os.path.exists(smart_server):
        return run_command_in_thread(
            [sys.executable, "smart_server.py", "proxy"],
            cwd=frontend_dir,
            prefix="Frontend"
        )
    
    # Fall back to regular server
    server_script = os.path.join(frontend_dir, "server.py")
    if os.path.exists(server_script):
        return run_command_in_thread(
            [sys.executable, "server.py"],
            cwd=frontend_dir,
            prefix="Frontend"
        )
    
    logger.error("No frontend server script found")
    return None

def setup_test_user():
    """Create a test user for development if needed."""
    logger.info("Setting up test user (if needed)...")
    
    # Check if we have a script to create test users
    test_user_script = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "backend",
        "create_test_user.py"
    )
    
    if os.path.exists(test_user_script):
        try:
            subprocess.run(
                [sys.executable, "create_test_user.py"],
                cwd=os.path.dirname(test_user_script),
                encoding='utf-8',
                errors='replace',
                check=True
            )
            logger.info("Test user is ready (username: testuser, password: password123)")
        except subprocess.CalledProcessError:
            logger.warning("Failed to create test user")
    else:
        # Try to create a test user directly with Django's manage.py
        backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
        try:
            # Check if user exists
            user_check = subprocess.run(
                [sys.executable, "manage.py", "shell", "-c", 
                 "from django.contrib.auth.models import User; print(User.objects.filter(username='testuser').exists())"],
                cwd=backend_dir,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                check=True
            )
            
            if "True" not in user_check.stdout:
                # Create user if it doesn't exist
                subprocess.run(
                    [sys.executable, "manage.py", "shell", "-c", 
                     "from django.contrib.auth.models import User; User.objects.create_user('testuser', 'test@example.com', 'password123')"],
                    cwd=backend_dir,
                    encoding='utf-8',
                    errors='replace',
                    check=True
                )
                logger.info("Test user created (username: testuser, password: password123)")
            else:
                logger.info("Test user already exists (username: testuser, password: password123)")
        except Exception as e:
            logger.warning(f"Could not check/create test user: {e}")

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="UNIMATE Runner Script")
    parser.add_argument("--backend", action="store_true", help="Start only backend")
    parser.add_argument("--frontend", action="store_true", help="Start only frontend")
    parser.add_argument("--asgi", action="store_true", help="Use ASGI server for WebSocket support")
    args = parser.parse_args()
    
    # If no specific flags are set, run both
    if not (args.backend or args.frontend):
        args.backend = True
        args.frontend = True
    
    # Check if ports are already in use
    if args.backend and is_port_in_use(8000):
        logger.warning("Port 8000 is already in use. Backend may not start correctly.")
    
    if args.frontend and is_port_in_use(8080):
        logger.warning("Port 8080 is already in use. Frontend may not start correctly.")
    
    backend_thread = None
    frontend_thread = None
    
    try:
        # Start backend if requested
        if args.backend:
            logger.info("Starting UNIMATE backend server...")
            if args.asgi:
                backend_thread = run_asgi_server()
            else:
                backend_thread = run_django_server()
            
            if backend_thread:
                # Give the backend time to start up
                time.sleep(1)
                # Set up a test user for convenience
                setup_test_user()
            else:
                logger.error("Failed to start backend server")
                sys.exit(1)
        
        # Start frontend if requested
        if args.frontend:
            logger.info("Starting UNIMATE frontend server...")
            frontend_thread = run_frontend_server()
            
            if not frontend_thread:
                logger.error("Failed to start frontend server")
                sys.exit(1)
        
        # Keep the main thread running to capture Ctrl+C
        logger.info("All servers started. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    
    except KeyboardInterrupt:
        logger.info("Shutting down servers...")
    
    logger.info("UNIMATE servers stopped.")

if __name__ == "__main__":
    main() 