from django.urls import re_path
from . import consumers
 
websocket_urlpatterns = [
    re_path(r'ws/unimate/$', consumers.UnimateConsumer.as_asgi()),
    # Add specific path for kiosk connections that the test script is looking for
    re_path(r'ws/kiosk/(?P<kiosk_id>\w+)/$', consumers.KioskConsumer.as_asgi()),
] 