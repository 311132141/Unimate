import os
from django.core.asgi import get_asgi_application

# Set up logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('asgi')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

# First, try to use Channels if available
try:
    from channels.routing import ProtocolTypeRouter, URLRouter
    from channels.auth import AuthMiddlewareStack
    
    # Try to import WebSocket patterns
    try:
        from unimate.routing import websocket_urlpatterns
        
        # Log the loaded websocket URL patterns
        for pattern in websocket_urlpatterns:
            logger.info(f"Registered WebSocket URL pattern: {pattern.pattern}")
            
        # Create the ASGI application with WebSocket support
        application = ProtocolTypeRouter({
            "http": get_asgi_application(),
            "websocket": AuthMiddlewareStack(
                URLRouter(
                    websocket_urlpatterns
                )
            ),
        })
        
        logger.info("ASGI application configured with WebSocket support (Channels)")
        
    except ImportError:
        logger.warning("Could not import websocket_urlpatterns. Using HTTP-only ASGI application.")
        application = ProtocolTypeRouter({
            "http": get_asgi_application(),
        })
        
except ImportError:
    logger.warning("Channels not available. Using HTTP-only ASGI application.")
    # Fall back to standard ASGI application without WebSocket support
    application = get_asgi_application() 