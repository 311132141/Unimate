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
    logger.info(f"RFID scan received for UID: {rfid_uid}")
    
    if not rfid_uid:
        return Response({'error': 'RFID UID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        profile = UserProfile.objects.get(rfid_uid=rfid_uid)
        user = profile.user
        logger.info(f"Found user profile for RFID UID {rfid_uid}: {user.username}")
        
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
            }
        }
        
        # Try to send WebSocket notification, but don't fail if it doesn't work
        try:
            logger.info("Attempting to send WebSocket notification")
            channel_layer = get_channel_layer()
            if channel_layer:
                # Get the kiosk ID from the request data
                kiosk_id = request.data.get('kiosk', 'unknown')
                logger.info(f"Kiosk ID from request: {kiosk_id}")
                
                # Send to the main Unimate group
                logger.info("Sending to unimate group")
                async_to_sync(channel_layer.group_send)(
                    "unimate",
                    {
                        "type": "user_login",  # Don't change this - it's the method name in the consumer
                        "message": response_data
                    }
                )
                logger.info("Successfully sent to unimate group")
                
                # Also send to the specific kiosk group if provided
                if kiosk_id != 'unknown':
                    # This is the key part - send to the specific kiosk group
                    kiosk_group = f"kiosk_{kiosk_id}"
                    logger.info(f"Sending to kiosk group: {kiosk_group}")
                    async_to_sync(channel_layer.group_send)(
                        kiosk_group,
                        {
                            "type": "user_login",  # Don't change this - it's the method name in the consumer
                            "message": response_data
                        }
                    )
                    logger.info(f"Successfully sent to kiosk group: {kiosk_group}")
            else:
                logger.error("Channel layer is None - WebSocket notification not sent")
        except Exception as e:
            logger.error(f"WebSocket error: {str(e)}")
            # Continue processing - WebSocket failure shouldn't break the API
        
        return Response(response_data)
        
    except UserProfile.DoesNotExist:
        logger.warning(f"No user profile found for RFID UID: {rfid_uid}")
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