#!/usr/bin/env python
"""
Run Django with ASGI Server
---------------------------
This script runs the Django application using an ASGI server (uvicorn or daphne) 
which is required for WebSocket support.

Usage:
  python run_asgi_server.py [--server=uvicorn|daphne] [--host=HOST] [--port=PORT]
"""
import os
import sys
import importlib
import logging
import argparse

# Add parent directory to path to allow imports
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger('asgi_server')

def run_with_uvicorn(host='0.0.0.0', port=8000):
    """Run the application with Uvicorn ASGI server"""
    try:
        import uvicorn
    except ImportError:
        logger.error("Uvicorn is not installed. Installing it now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "uvicorn"])
        import uvicorn
    
    logger.info(f"Starting Uvicorn ASGI server on {host}:{port}")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
    
    # Run Uvicorn with the ASGI application
    uvicorn.run(
        "app.asgi:application",
        host=host,
        port=port,
        log_level="info",
        reload=True
    )

def run_with_daphne(host='0.0.0.0', port=8000):
    """Run the application with Daphne ASGI server"""
    try:
        from daphne.cli import CommandLineInterface
    except ImportError:
        logger.error("Daphne is not installed. Installing it now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "daphne"])
        from daphne.cli import CommandLineInterface
    
    logger.info(f"Starting Daphne ASGI server on {host}:{port}")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
    
    # Run Daphne with the ASGI application
    sys.argv = ["daphne", "-b", host, "-p", str(port), "app.asgi:application"]
    CommandLineInterface().run()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run Django with an ASGI server')
    parser.add_argument('--server', choices=['uvicorn', 'daphne'], default='uvicorn',
                      help='ASGI server to use (default: uvicorn)')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', type=int, default=8000, help='Port to bind to')
    args = parser.parse_args()
    
    if args.server == 'daphne':
        run_with_daphne(args.host, args.port)
    else:
        run_with_uvicorn(args.host, args.port) 