from rest_framework import serializers
from .models import Course, Room, Event, UserProfile, Enrollment

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'building', 'number', 'floor', 'coordinates']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'description']

class EventSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    room = RoomSerializer(read_only=True)
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'event_type', 'course', 'room', 
                 'start_time', 'end_time', 'lecturer', 'is_urgent']

class UserProfileSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'rfid_uid', 'courses']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'semester'] 