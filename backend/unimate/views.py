from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import UserProfile, Event, Course, Room
from .serializers import EventSerializer, CourseSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def rfid_scan(request):
    rfid_uid = request.data.get('rfid_uid')
    if not rfid_uid:
        return Response({'error': 'RFID UID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        profile = UserProfile.objects.get(rfid_uid=rfid_uid)
        user = profile.user
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Get user's events
        events = Event.objects.filter(
            course__in=profile.courses.all()
        ).order_by('start_time')
        
        # Prepare the response data first
        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'events': EventSerializer(events, many=True).data
            },
            'redirect': '/dashboard'  # Add redirect instruction
        }
        
        # Try to send WebSocket notification, but don't fail if it doesn't work
        try:
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    "unimate",
                    {
                        "type": "user.login",
                        "message": {
                            "access": str(refresh.access_token),
                            "refresh": str(refresh),
                            "user": {
                                "id": user.id,
                                "username": user.username,
                                "events": EventSerializer(events, many=True).data
                            },
                            "action": "navigate",
                            "redirect": "/dashboard"
                        }
                    }
                )
        except Exception as e:
            logger.error(f"WebSocket error: {str(e)}")
            # Continue processing - WebSocket failure shouldn't break the API
        
        return Response(response_data)
        
    except UserProfile.DoesNotExist:
        return Response({'error': 'Invalid RFID card'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        profile = user.userprofile
        
        events = Event.objects.filter(
            course__in=profile.courses.all()
        ).order_by('start_time')
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'events': EventSerializer(events, many=True).data
            }
        })
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # Require authentication
    
    def get_queryset(self):
        queryset = Event.objects.all()
        if self.request.user.is_authenticated:
            profile = self.request.user.userprofile
            queryset = queryset.filter(course__in=profile.courses.all())
        return queryset.order_by('start_time')

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]  # Require authentication

@api_view(['GET'])
@permission_classes([AllowAny])
def route(request):
    """
    Get a route between two points
    
    Query parameters:
    - from: The starting point (e.g., "kiosk-1")
    - to: The destination (e.g., "ENG340")
    
    Returns a GeoJSON representation of the path.
    """
    start_point = request.query_params.get('from')
    end_point = request.query_params.get('to')
    
    if not start_point or not end_point:
        return Response(
            {'error': 'Both "from" and "to" parameters are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # For the demo, we'll return a simple mock route
    # In a real implementation, this would use A* pathfinding on a graph of the building
    
    # Find the destination room if it exists
    destination_room = None
    try:
        # Try to match by room number
        destination_room = Room.objects.filter(number__icontains=end_point).first()
    except:
        pass
    
    # Simple placeholder route as GeoJSON
    route_geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [0, 0, 0],  # Starting point (x, y, z)
                        [5, 0, 0],  # First corner
                        [5, 5, 0],  # Second corner
                        [10, 5, 0]  # Destination
                    ]
                },
                "properties": {
                    "start": start_point,
                    "destination": end_point,
                    "distance": 15.0,  # meters
                    "estimated_time": 30  # seconds
                }
            }
        ]
    }
    
    # If we found a real room, use its coordinates for the destination
    if destination_room:
        coords = destination_room.coordinates
        route_geojson["features"][0]["geometry"]["coordinates"][-1] = [
            coords.get('x', 0), 
            coords.get('y', 0), 
            coords.get('z', 0)
        ]
        route_geojson["features"][0]["properties"]["room_details"] = {
            "building": destination_room.building,
            "number": destination_room.number,
            "floor": destination_room.floor
        }
    
    return Response(route_geojson) 