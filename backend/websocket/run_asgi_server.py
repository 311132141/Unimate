#!/usr/bin/env python
"""
UNIMATE ASGI Server Runner
-------------------------
Runs the Django application with ASGI server support for WebSocket functionality.
Supports both Uvicorn and Daphne as ASGI servers.
"""

import os
import sys
import argparse
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('asgi_runner')

def run_uvicorn(host='0.0.0.0', port=8000, reload=True):
    """Run Django with Uvicorn ASGI server"""
    try:
        import uvicorn
        
        # Make sure we're in the right directory with Django settings
        django_dir = Path(__file__).parent.parent
        if django_dir.name == 'backend':
            os.chdir(django_dir)
        
        # Set Django settings module
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
        
        logger.info(f"Starting Uvicorn ASGI server on {host}:{port}")
        logger.info(f"WebSocket endpoints will be available at:")
        logger.info(f"  - ws://{host}:{port}/ws/unimate/")
        logger.info(f"  - ws://{host}:{port}/ws/kiosk/{{kiosk_id}}/")
        
        # Run Uvicorn
        uvicorn.run(
            "app.asgi:application",
            host=host,
            port=port,
            reload=reload,
            log_level="info"
        )
        
    except ImportError:
        logger.error("Uvicorn is not installed. Install it with: pip install uvicorn")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error starting Uvicorn: {e}")
        sys.exit(1)

def run_daphne(host='0.0.0.0', port=8000):
    """Run Django with Daphne ASGI server"""
    try:
        import daphne.cli
        
        # Make sure we're in the right directory with Django settings
        django_dir = Path(__file__).parent.parent
        if django_dir.name == 'backend':
            os.chdir(django_dir)
        
        # Set Django settings module
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
        
        logger.info(f"Starting Daphne ASGI server on {host}:{port}")
        logger.info(f"WebSocket endpoints will be available at:")
        logger.info(f"  - ws://{host}:{port}/ws/unimate/")
        logger.info(f"  - ws://{host}:{port}/ws/kiosk/{{kiosk_id}}/")
        
        # Run Daphne
        sys.argv = [
            'daphne',
            '-b', host,
            '-p', str(port),
            'app.asgi:application'
        ]
        daphne.cli.CommandLineInterface().run(sys.argv)
        
    except ImportError:
        logger.error("Daphne is not installed. Install it with: pip install daphne")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error starting Daphne: {e}")
        sys.exit(1)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Run UNIMATE ASGI server')
    parser.add_argument('--server', choices=['uvicorn', 'daphne'], default='uvicorn',
                       help='ASGI server to use (default: uvicorn)')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=8000, help='Port to bind to (default: 8000)')
    parser.add_argument('--no-reload', action='store_true', help='Disable auto-reload (Uvicorn only)')
    
    args = parser.parse_args()
    
    logger.info(f"Starting UNIMATE ASGI server with {args.server}")
    
    if args.server == 'uvicorn':
        run_uvicorn(args.host, args.port, not args.no_reload)
    elif args.server == 'daphne':
        run_daphne(args.host, args.port)

if __name__ == "__main__":
    main() 
"""
UNIMATE ASGI Server Runner
-------------------------
Runs the Django application with ASGI server support for WebSocket functionality.
Supports both Uvicorn and Daphne as ASGI servers.
"""

import os
import sys
import argparse
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('asgi_runner')

def run_uvicorn(host='0.0.0.0', port=8000, reload=True):
    """Run Django with Uvicorn ASGI server"""
    try:
        import uvicorn
        
        # Make sure we're in the right directory with Django settings
        django_dir = Path(__file__).parent.parent
        if django_dir.name == 'backend':
            os.chdir(django_dir)
        
        # Set Django settings module
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
        
        logger.info(f"Starting Uvicorn ASGI server on {host}:{port}")
        logger.info(f"WebSocket endpoints will be available at:")
        logger.info(f"  - ws://{host}:{port}/ws/unimate/")
        logger.info(f"  - ws://{host}:{port}/ws/kiosk/{{kiosk_id}}/")
        
        # Run Uvicorn
        uvicorn.run(
            "app.asgi:application",
            host=host,
            port=port,
            reload=reload,
            log_level="info"
        )
        
    except ImportError:
        logger.error("Uvicorn is not installed. Install it with: pip install uvicorn")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error starting Uvicorn: {e}")
        sys.exit(1)

def run_daphne(host='0.0.0.0', port=8000):
    """Run Django with Daphne ASGI server"""
    try:
        import daphne.cli
        
        # Make sure we're in the right directory with Django settings
        django_dir = Path(__file__).parent.parent
        if django_dir.name == 'backend':
            os.chdir(django_dir)
        
        # Set Django settings module
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
        
        logger.info(f"Starting Daphne ASGI server on {host}:{port}")
        logger.info(f"WebSocket endpoints will be available at:")
        logger.info(f"  - ws://{host}:{port}/ws/unimate/")
        logger.info(f"  - ws://{host}:{port}/ws/kiosk/{{kiosk_id}}/")
        
        # Run Daphne
        sys.argv = [
            'daphne',
            '-b', host,
            '-p', str(port),
            'app.asgi:application'
        ]
        daphne.cli.CommandLineInterface().run(sys.argv)
        
    except ImportError:
        logger.error("Daphne is not installed. Install it with: pip install daphne")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error starting Daphne: {e}")
        sys.exit(1)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Run UNIMATE ASGI server')
    parser.add_argument('--server', choices=['uvicorn', 'daphne'], default='uvicorn',
                       help='ASGI server to use (default: uvicorn)')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=8000, help='Port to bind to (default: 8000)')
    parser.add_argument('--no-reload', action='store_true', help='Disable auto-reload (Uvicorn only)')
    
    args = parser.parse_args()
    
    logger.info(f"Starting UNIMATE ASGI server with {args.server}")
    
    if args.server == 'uvicorn':
        run_uvicorn(args.host, args.port, not args.no_reload)
    elif args.server == 'daphne':
        run_daphne(args.host, args.port)

if __name__ == "__main__":
    main() 