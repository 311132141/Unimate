import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from unimate.routing import websocket_urlpatterns
import logging

# Set up logging for ASGI application
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('asgi')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

# Log the loaded websocket URL patterns
for pattern in websocket_urlpatterns:
    logger.info(f"Registered WebSocket URL pattern: {pattern.pattern}")

# Create the ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})

# Log that ASGI application is configured
logger.info("ASGI application configured with WebSocket support") 