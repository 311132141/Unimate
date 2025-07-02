from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from unimate.views import EventViewSet, CourseViewSet, rfid_scan, login, route
from django.http import HttpResponse
import os

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'courses', CourseViewSet)

# Add a view to serve the connected.html file directly
def serve_frontend_file(request, filename):
    file_path = os.path.join(settings.BASE_DIR, '..', 'frontend', filename)
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            content = f.read()
        
        content_type = 'text/html'
        if filename.endswith('.css'):
            content_type = 'text/css'
        elif filename.endswith('.js'):
            content_type = 'application/javascript'
        
        return HttpResponse(content, content_type=content_type)
    return HttpResponse(f"File {filename} not found", status=404)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/scan/', rfid_scan),
    path('api/login/', login),
    path('api/route/', route),
    # Serve connected.html for any non-api path
    re_path(r'^(?!api/).*$', lambda request: serve_frontend_file(request, 'components/connected.html')),
    
    # Custom frontend file serving
    path('app/<str:filename>', serve_frontend_file, name='serve_frontend_file'),
    
    # Serve the connected.html as the root URL for convenience
    path('', lambda request: serve_frontend_file(request, 'components/connected.html'), name='index'),
] 

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    # Note: For production, static files should be handled by a web server like Nginx or WhiteNoise. 