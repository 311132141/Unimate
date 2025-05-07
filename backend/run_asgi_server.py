#!/usr/bin/env python
"""
Run Django with ASGI Server
---------------------------
This script runs the Django application using an ASGI server (uvicorn) 
which is required for WebSocket support.

Usage:
  python run_asgi_server.py
"""
import os
import sys
import importlib
import logging
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger('asgi_server')

def run_with_uvicorn():
    """Run the application with Uvicorn ASGI server"""
    try:
        import uvicorn
    except ImportError:
        logger.error("Uvicorn is not installed. Installing it now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "uvicorn"])
        import uvicorn
    
    logger.info("Starting Uvicorn ASGI server...")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
    
    # Run Uvicorn with the ASGI application
    uvicorn.run(
        "app.asgi:application",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True
    )

def run_with_daphne():
    """Run the application with Daphne ASGI server"""
    try:
        from daphne.cli import CommandLineInterface
    except ImportError:
        logger.error("Daphne is not installed. Installing it now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "daphne"])
        from daphne.cli import CommandLineInterface
    
    logger.info("Starting Daphne ASGI server...")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
    
    # Run Daphne with the ASGI application
    sys.argv = ["daphne", "-b", "0.0.0.0", "-p", "8000", "app.asgi:application"]
    CommandLineInterface().run()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run Django with an ASGI server')
    parser.add_argument('--server', choices=['uvicorn', 'daphne'], default='uvicorn',
                      help='ASGI server to use (default: uvicorn)')
    args = parser.parse_args()
    
    if args.server == 'daphne':
        run_with_daphne()
    else:
        run_with_uvicorn() 