#!/usr/bin/env python
"""
UNIMATE Runner Script
-------------------
A unified script for running the UNIMATE application with various server options.

Usage:
  python run.py [options]

Options:
  --django      Run with Django's built-in development server (no WebSocket support)
  --asgi        Run with ASGI server (Uvicorn or Daphne) for WebSocket support
  --websocket   Run standalone WebSocket server only
  --all         Run both Django and WebSocket servers
"""
import os
import sys
import argparse
import subprocess
import logging
import signal
import time
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('unimate_runner')

# Define paths
BASE_DIR = Path(__file__).resolve().parent
DJANGO_MANAGE = BASE_DIR / 'manage.py'
ASGI_SERVER = BASE_DIR / 'websocket' / 'run_asgi_server.py'
WEBSOCKET_SERVER = BASE_DIR / 'websocket' / 'server.py'

# Process holders
processes = []

def run_django_server(host='127.0.0.1', port=8000):
    """Run Django's built-in development server"""
    cmd = [
        sys.executable, 
        str(DJANGO_MANAGE), 
        'runserver', 
        f'{host}:{port}'
    ]
    logger.info(f"Starting Django development server on {host}:{port}")
    return subprocess.Popen(cmd)

def run_asgi_server(server_type='uvicorn', host='0.0.0.0', port=8000):
    """Run ASGI server (Uvicorn or Daphne)"""
    # Check if the ASGI server script exists
    if ASGI_SERVER.exists():
        cmd = [
            sys.executable, 
            str(ASGI_SERVER), 
            f'--server={server_type}',
            f'--host={host}',
            f'--port={port}'
        ]
        logger.info(f"Starting {server_type.capitalize()} ASGI server on {host}:{port}")
    else:
        # Fallback to direct uvicorn command if script doesn't exist
        logger.warning(f"ASGI server script not found at {ASGI_SERVER}, using direct uvicorn command")
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
        cmd = [
            sys.executable, "-m", "uvicorn",
            "app.asgi:application",
            f"--host={host}",
            f"--port={port}",
            "--reload"
        ]
        logger.info(f"Starting Uvicorn ASGI server directly on {host}:{port}")
    
    return subprocess.Popen(cmd)

def run_websocket_server(host='0.0.0.0', port=8765):
    """Run standalone WebSocket server"""
    cmd = [
        sys.executable, 
        str(WEBSOCKET_SERVER),
        f'--host={host}',
        f'--port={port}'
    ]
    logger.info(f"Starting standalone WebSocket server on {host}:{port}")
    return subprocess.Popen(cmd)

def handle_signal(sig, frame):
    """Handle termination signals"""
    logger.info(f"Received signal {sig}, shutting down all processes...")
    for proc in processes:
        try:
            if proc.poll() is None:
                proc.terminate()
                logger.info(f"Terminated process {proc.pid}")
        except Exception as e:
            logger.error(f"Error terminating process: {e}")
    
    sys.exit(0)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Run UNIMATE application')
    parser.add_argument('--django', action='store_true', help='Run Django development server')
    parser.add_argument('--asgi', action='store_true', help='Run ASGI server with WebSocket support')
    parser.add_argument('--websocket', action='store_true', help='Run standalone WebSocket server')
    parser.add_argument('--all', action='store_true', help='Run both Django and WebSocket servers')

    # Server configuration options
    parser.add_argument('--django-host', default='127.0.0.1', help='Django server host')
    parser.add_argument('--django-port', type=int, default=8000, help='Django server port')
    parser.add_argument('--asgi-host', default='0.0.0.0', help='ASGI server host')
    parser.add_argument('--asgi-port', type=int, default=8000, help='ASGI server port')
    parser.add_argument('--ws-host', default='0.0.0.0', help='WebSocket server host')
    parser.add_argument('--ws-port', type=int, default=8765, help='WebSocket server port')
    parser.add_argument('--asgi-server', default='uvicorn', choices=['uvicorn', 'daphne'], help='ASGI server to use')

    args = parser.parse_args()
    
    # Register signal handlers
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)
    
    # Default to ASGI server if no option specified
    if not (args.django or args.asgi or args.websocket or args.all):
        args.asgi = True
    
    # Run selected servers
    if args.django or args.all:
        django_proc = run_django_server(args.django_host, args.django_port)
        processes.append(django_proc)
    
    if args.asgi or args.all:
        asgi_proc = run_asgi_server(args.asgi_server, args.asgi_host, args.asgi_port)
        processes.append(asgi_proc)
    
    if args.websocket or args.all:
        ws_proc = run_websocket_server(args.ws_host, args.ws_port)
        processes.append(ws_proc)
    
    logger.info(f"All servers started. Press Ctrl+C to stop.")
    
    # Keep the script running until interrupted
    try:
        while all(proc.poll() is None for proc in processes):
            time.sleep(1)
        
        # Check if any process exited
        for proc in processes:
            if proc.poll() is not None:
                logger.error(f"Process exited unexpectedly with code {proc.returncode}")
        
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
        handle_signal(signal.SIGINT, None)

if __name__ == "__main__":
    main() 
    try:
        while all(proc.poll() is None for proc in processes):
            time.sleep(1)
        
        # Check if any process exited
        for proc in processes:
            if proc.poll() is not None:
                logger.error(f"Process exited unexpectedly with code {proc.returncode}")
        
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
        handle_signal(signal.SIGINT, None)

if __name__ == "__main__":
    main() 