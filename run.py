#!/usr/bin/env python3
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
import signal

# Force UTF-8 encoding for subprocess calls to handle Chinese characters
os.environ["PYTHONIOENCODING"] = "utf-8"

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('unimate_runner')

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(SCRIPT_DIR, "backend")
FRONTEND_DIR = os.path.join(SCRIPT_DIR, "frontend")

# Backend server ports
BACKEND_PORT = 8000
FRONTEND_PORT = 8080

# Flags for process management
processes = []
running = True

def check_port_in_use(port):
    """Check if a port is already in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

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

def run_backend_django():
    """Run the Django backend with regular runserver."""
    os.chdir(BACKEND_DIR)
    cmd = [
        sys.executable, "manage.py", "runserver", f"0.0.0.0:{BACKEND_PORT}",
    ]
    logger.info(f"Starting Django backend server: {' '.join(cmd)}")
    return subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1,
    )

def run_backend_asgi():
    """Run the Django backend with ASGI server (for WebSocket support)."""
    os.chdir(BACKEND_DIR)
    
    # Direct uvicorn command for reliability
    cmd = [
        sys.executable, "-m", "uvicorn", 
        "app.asgi:application", 
        "--host", "0.0.0.0", 
        "--port", str(BACKEND_PORT),
        "--reload",
        "--reload-dir", BACKEND_DIR
    ]
    
    logger.info(f"Starting Uvicorn ASGI server on 0.0.0.0:{BACKEND_PORT}")
    return subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1,
    )

def run_frontend_server():
    """Run the frontend server."""
    os.chdir(FRONTEND_DIR)
    # Use the smart_server.py from the server directory
    cmd = [sys.executable, os.path.join("server", "smart_server.py")]
    logger.info(f"Starting frontend server on port {FRONTEND_PORT}")
    return subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1,
    )

def setup_test_data():
    """Set up test user if needed."""
    os.chdir(BACKEND_DIR)
    logger.info("Setting up test user (if needed)...")
    
    # Check if setup_data.py exists and run it
    setup_script = os.path.join(BACKEND_DIR, "setup_data.py")
    if os.path.exists(setup_script):
        result = subprocess.run(
            [sys.executable, setup_script],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            if "already exists" in result.stdout:
                logger.info("Test user already exists (username: testuser, password: password123)")
            else:
                logger.info("Test user created (username: testuser, password: password123)")
        else:
            logger.error(f"Error setting up test user: {result.stderr}")
    else:
        logger.warning("setup_data.py not found, skipping test data setup")

def output_reader(process, prefix):
    """Read and log output from a subprocess."""
    global running
    while running:
        try:
            line = process.stdout.readline()
            if not line:
                break
            line = line.rstrip()
            if line:
                print(f"[{prefix}] {line}")
        except Exception as e:
            if running:  # Only log if we're still supposed to be running
                logger.error(f"Error reading output from {prefix}: {e}")
                break

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully."""
    global running
    print("\nCtrl+C detected. Shutting down...")
    running = False
    
    # Terminate all processes
    for p in processes:
        try:
            p.terminate()
        except:
            pass
    
    # Wait for processes to exit
    for p in processes:
        try:
            p.wait(timeout=5)
        except:
            pass
    
    print("All servers stopped.")
    sys.exit(0)

def main():
    """Main entry point."""
    global processes, running
    
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="UNIMATE Runner Script")
    parser.add_argument("--backend", action="store_true", help="Start only backend")
    parser.add_argument("--frontend", action="store_true", help="Start only frontend")
    parser.add_argument("--asgi", action="store_true", help="Use ASGI server for WebSocket support")
    args = parser.parse_args()
    
    # Register signal handler for Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)
    
    # If no specific flags are set, run both
    if not (args.backend or args.frontend):
        args.backend = True
        args.frontend = True
    
    # Check if ports are already in use
    if args.backend and check_port_in_use(BACKEND_PORT):
        logger.warning("Port 8000 is already in use. Backend may not start correctly.")
    
    if args.frontend and check_port_in_use(FRONTEND_PORT):
        logger.warning("Port 8080 is already in use. Frontend may not start correctly.")
    
    backend_thread = None
    frontend_thread = None
    
    try:
        # Start backend if requested
        if args.backend:
            logger.info("Starting UNIMATE backend server...")
            if args.asgi:
                backend_thread = run_backend_asgi()
            else:
                backend_thread = run_backend_django()
            
            if backend_thread:
                # Give the backend time to start up
                time.sleep(1)
                # Set up a test user for convenience
                setup_test_data()
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
        while running:
            time.sleep(1)
    
    except KeyboardInterrupt:
        logger.info("Shutting down servers...")
    
    logger.info("UNIMATE servers stopped.")

if __name__ == "__main__":
    main() 