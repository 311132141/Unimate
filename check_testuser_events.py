#!/usr/bin/env python3
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from unimate.models import Event, UserProfile, Enrollment
from django.contrib.auth.models import User

def check_testuser_events():
    try:
        # Get testuser
        testuser = User.objects.get(username='testuser')
        profile = UserProfile.objects.get(user=testuser)
        
        print("=== TESTUSER INFORMATION ===")
        print(f"Username: {testuser.username}")
        print(f"Profile ID: {profile.id}")
        
        # Get enrollments
        enrollments = Enrollment.objects.filter(user=profile)
        enrolled_courses = [e.course for e in enrollments]
        
        print(f"\n=== TESTUSER ENROLLED COURSES ({len(enrolled_courses)}) ===")
        for enrollment in enrollments:
            print(f"- {enrollment.course.code}: {enrollment.course.name}")
        
        # Get events for enrolled courses
        events = Event.objects.filter(course__in=enrolled_courses).order_by('start_time')
        
        print(f"\n=== EVENTS FOR TESTUSER'S COURSES ({events.count()}) ===")
        for event in events:
            print(f"- {event.title}")
            print(f"  Course: {event.course.code}")
            print(f"  Time: {event.start_time.strftime('%a %d %b, %H:%M')} - {event.end_time.strftime('%H:%M')}")
            print(f"  Room: {event.room.building} {event.room.number}")
            print(f"  Lecturer: {event.lecturer}")
            if event.is_urgent:
                print(f"  ⚠️  URGENT EVENT")
            print()
        
        # Check all events to see what exists
        all_events = Event.objects.all()
        print(f"\n=== ALL EVENTS IN DATABASE ({all_events.count()}) ===")
        for event in all_events:
            print(f"- {event.title} ({event.course.code})")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_testuser_events() 
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from unimate.models import Event, UserProfile, Enrollment
from django.contrib.auth.models import User

def check_testuser_events():
    try:
        # Get testuser
        testuser = User.objects.get(username='testuser')
        profile = UserProfile.objects.get(user=testuser)
        
        print("=== TESTUSER INFORMATION ===")
        print(f"Username: {testuser.username}")
        print(f"Profile ID: {profile.id}")
        
        # Get enrollments
        enrollments = Enrollment.objects.filter(user=profile)
        enrolled_courses = [e.course for e in enrollments]
        
        print(f"\n=== TESTUSER ENROLLED COURSES ({len(enrolled_courses)}) ===")
        for enrollment in enrollments:
            print(f"- {enrollment.course.code}: {enrollment.course.name}")
        
        # Get events for enrolled courses
        events = Event.objects.filter(course__in=enrolled_courses).order_by('start_time')
        
        print(f"\n=== EVENTS FOR TESTUSER'S COURSES ({events.count()}) ===")
        for event in events:
            print(f"- {event.title}")
            print(f"  Course: {event.course.code}")
            print(f"  Time: {event.start_time.strftime('%a %d %b, %H:%M')} - {event.end_time.strftime('%H:%M')}")
            print(f"  Room: {event.room.building} {event.room.number}")
            print(f"  Lecturer: {event.lecturer}")
            if event.is_urgent:
                print(f"  ⚠️  URGENT EVENT")
            print()
        
        # Check all events to see what exists
        all_events = Event.objects.all()
        print(f"\n=== ALL EVENTS IN DATABASE ({all_events.count()}) ===")
        for event in all_events:
            print(f"- {event.title} ({event.course.code})")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_testuser_events() 