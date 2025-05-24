from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import UserProfile, Event, Course, Room, Enrollment
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
        
        # Get user's events through enrollment - FIX: Use enrollment relationship
        enrolled_courses = [enrollment.course for enrollment in Enrollment.objects.filter(user=profile)]
        events = Event.objects.filter(course__in=enrolled_courses).order_by('start_time')
        
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
        
        # FIX: Use enrollment relationship to get events
        enrolled_courses = [enrollment.course for enrollment in Enrollment.objects.filter(user=profile)]
        events = Event.objects.filter(course__in=enrolled_courses).order_by('start_time')
        
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

# NEW: Add a dedicated user events endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def user_events(request):
    """Get events for a specific user by user ID or username"""
    user_id = request.query_params.get('user_id')
    username = request.query_params.get('username')
    
    if not user_id and not username:
        return Response({'error': 'user_id or username parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            user = User.objects.get(username=username)
            
        profile = user.userprofile
        enrolled_courses = [enrollment.course for enrollment in Enrollment.objects.filter(user=profile)]
        events = Event.objects.filter(course__in=enrolled_courses).order_by('start_time')
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'events': EventSerializer(events, many=True).data
            }
        })
        
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # Require authentication
    
    def get_queryset(self):
        queryset = Event.objects.all()
        if self.request.user.is_authenticated:
            profile = self.request.user.userprofile
            # FIX: Use enrollment relationship
            enrolled_courses = [enrollment.course for enrollment in Enrollment.objects.filter(user=profile)]
            queryset = queryset.filter(course__in=enrolled_courses)
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
        
        if not destination_room:
            # Try to match by building and room combination
            parts = end_point.split()
            if len(parts) >= 2:
                building = parts[0]
                room_number = parts[1]
                destination_room = Room.objects.filter(
                    building__iexact=building, 
                    number__icontains=room_number
                ).first()
    except Exception as e:
        logger.warning(f"Error finding room: {e}")
    
    # Create a simple route (normally this would be calculated using pathfinding)
    route_data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [174.7693, -36.8485],  # Starting point (rough coordinates)
                        [174.7695, -36.8487],  # Waypoint
                        [174.7697, -36.8489]   # Destination (rough coordinates)
                    ]
                },
                "properties": {
                    "from": start_point,
                    "to": end_point,
                    "distance": "150m",
                    "estimated_time": "2 minutes",
                    "destination_room": {
                        "building": destination_room.building if destination_room else "Unknown",
                        "number": destination_room.number if destination_room else "Unknown",
                        "floor": destination_room.floor if destination_room else 0
                    } if destination_room else None
                }
            }
        ]
    }
    
    return Response(route_data) 
                destination_room = Room.objects.filter(
                    building__iexact=building, 
                    number__icontains=room_number
                ).first()
    except Exception as e:
        logger.warning(f"Error finding room: {e}")
    
    # Create a simple route (normally this would be calculated using pathfinding)
    route_data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [174.7693, -36.8485],  # Starting point (rough coordinates)
                        [174.7695, -36.8487],  # Waypoint
                        [174.7697, -36.8489]   # Destination (rough coordinates)
                    ]
                },
                "properties": {
                    "from": start_point,
                    "to": end_point,
                    "distance": "150m",
                    "estimated_time": "2 minutes",
                    "destination_room": {
                        "building": destination_room.building if destination_room else "Unknown",
                        "number": destination_room.number if destination_room else "Unknown",
                        "floor": destination_room.floor if destination_room else 0
                    } if destination_room else None
                }
            }
        ]
    }
    
    return Response(route_data) 