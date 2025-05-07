#!/usr/bin/env python
"""
Unimate Project Starter
This script starts both the Django backend and frontend server.

Usage:
  python start_unimate.py          - Start both backend and frontend with proxy
  python start_unimate.py frontend - Start only frontend server
  python start_unimate.py backend  - Start only backend server
"""

import sys
import os
import subprocess
import time
import webbrowser
import threading

def run_command_in_thread(command, cwd=None):
    """Run a command in a separate thread"""
    def run_command():
        subprocess.run(command, cwd=cwd)
    
    thread = threading.Thread(target=run_command)
    thread.daemon = True
    thread.start()
    return thread

def start_backend():
    """Start the Django backend server"""
    print("\n=== Starting Django Backend ===")
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    
    if not os.path.exists(os.path.join(backend_dir, "manage.py")):
        print(f"Error: Django manage.py not found in {backend_dir}")
        print("Make sure you have the correct directory structure")
        return None
    
    # Start Django server in a separate thread
    return run_command_in_thread(["python", "manage.py", "runserver", "0.0.0.0:8000"], cwd=backend_dir)

def start_frontend(use_proxy=True):
    """Start the frontend server"""
    print("\n=== Starting Frontend Server ===")
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")
    
    script = "proxy.py" if use_proxy else "server.py"
    if not os.path.exists(os.path.join(frontend_dir, script)):
        print(f"Error: {script} not found in {frontend_dir}")
        return None
    
    # Return the frontend process (we'll wait on this one in the main thread)
    return subprocess.run(["python", script], cwd=frontend_dir)

def open_browser():
    """Open the browser to the frontend application"""
    url = "http://localhost:8080/connected.html"
    print(f"\nOpening {url} in browser...")
    webbrowser.open(url)

if __name__ == "__main__":
    # Parse command-line arguments
    mode = "full"
    if len(sys.argv) > 1:
        if sys.argv[1].lower() == "frontend":
            mode = "frontend"
        elif sys.argv[1].lower() == "backend":
            mode = "backend"
    
    # Start servers based on mode
    backend_thread = None
    
    try:
        if mode in ["full", "backend"]:
            backend_thread = start_backend()
            if not backend_thread and mode == "backend":
                sys.exit(1)
            
            # Give backend time to start
            if mode == "full":
                print("Waiting for backend to initialize...")
                time.sleep(3)
        
        if mode in ["full", "frontend"]:
            # Open browser after a short delay
            if mode == "full":
                threading.Timer(4, open_browser).start()
            
            # Start frontend (this will block until frontend is stopped)
            start_frontend(use_proxy=(mode == "full"))
            
    except KeyboardInterrupt:
        print("\nShutting down servers...")
    
    print("\nUnimate servers stopped.") 