#!/usr/bin/env python
"""
Setup script to populate the Unimate database with test data.
Run this script with: python setup_data.py
"""
import os
import sys
import django
from datetime import datetime, timedelta

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

# Import models after Django setup
from django.contrib.auth.models import User
from unimate.models import UserProfile, Course, Room, Enrollment, Event

def create_users():
    """Create demo users with pre-defined passwords"""
    print("Creating users...")
    
    # Delete existing users first to avoid conflicts
    User.objects.filter(username__in=['alice', 'bob', 'carol']).delete()
    
    # Create users with the plaintext passwords (Django will handle hashing)
    users = [
        ('alice', 'Pass123!', 'Alice', 'Wonderland', '04A1B2C3D4'),
        ('bob', 'Pass123!', 'Bob', 'Builder', '04B5C6D7E8'),
        ('carol', 'Pass123!', 'Carol', 'Danvers', '0499AA11BB'),
    ]
    
    for username, password, first_name, last_name, rfid_uid in users:
        # Create the user
        user = User.objects.create_user(
            username=username,
            email=f"{username}@example.com",
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Create the user profile with RFID UID
        UserProfile.objects.create(
            user=user,
            rfid_uid=rfid_uid
        )
        
        print(f"Created user: {username} with RFID: {rfid_uid}")

def create_courses():
    """Create demo courses"""
    print("\nCreating courses...")
    
    # Delete existing courses first
    Course.objects.all().delete()
    
    courses = [
        ('ENGGEN205', 'Engineering Mechanics', 'Introduction to static and dynamic mechanics.'),
        ('COMPSCI101', 'Introduction to Computer Science', 'Fundamental concepts of computer science and programming.'),
        ('STATS100', 'Introduction to Statistics', 'Basic statistical concepts and methods.'),
    ]
    
    created_courses = []
    for code, name, description in courses:
        course = Course.objects.create(
            code=code,
            name=name,
            description=description
        )
        created_courses.append(course)
        print(f"Created course: {code} - {name}")
    
    return created_courses

def create_rooms():
    """Create demo rooms with coordinates"""
    print("\nCreating rooms...")
    
    # Delete existing rooms first
    Room.objects.all().delete()
    
    rooms = [
        ('Engineering Building', '401-403', 4, {'x': 10, 'y': 5, 'z': 0}),
        ('Science Block B', '101A', 1, {'x': -5, 'y': 2, 'z': 1}),
        ('Library', 'G02 (Study Hall)', 0, {'x': 0, 'y': 0, 'z': 0}),
    ]
    
    created_rooms = []
    for building, number, floor, coordinates in rooms:
        room = Room.objects.create(
            building=building,
            number=number,
            floor=floor,
            coordinates=coordinates
        )
        created_rooms.append(room)
        print(f"Created room: {building} {number}")
    
    return created_rooms

def create_enrollments(courses):
    """Create enrollments linking users to courses"""
    print("\nCreating enrollments...")
    
    # Delete existing enrollments first
    Enrollment.objects.all().delete()
    
    # Get users
    alice = UserProfile.objects.get(user__username='alice')
    bob = UserProfile.objects.get(user__username='bob')
    carol = UserProfile.objects.get(user__username='carol')
    
    # Create enrollments - each user gets a different combination of courses
    enrollments = [
        (alice, courses[0], "2025 S1"),  # Alice in ENGGEN205
        (alice, courses[1], "2025 S1"),  # Alice in COMPSCI101
        (bob, courses[1], "2025 S1"),    # Bob in COMPSCI101
        (bob, courses[2], "2025 S1"),    # Bob in STATS100
        (carol, courses[0], "2025 S1"),  # Carol in ENGGEN205
        (carol, courses[2], "2025 S1"),  # Carol in STATS100
    ]
    
    for user, course, semester in enrollments:
        Enrollment.objects.create(
            user=user,
            course=course,
            semester=semester
        )
        print(f"Enrolled {user.user.username} in {course.code}")

def create_events(courses, rooms):
    """Create events (classes and exams)"""
    print("\nCreating events...")
    
    # Delete existing events first
    Event.objects.all().delete()
    
    # Base date for events (current date)
    base_date = datetime.now()
    
    events = [
        ("ENGGEN205 Lecture", "class", courses[0], rooms[0], 
         base_date + timedelta(days=1, hours=9), 
         base_date + timedelta(days=1, hours=10), 
         "Dr. Smith", False),
        
        ("COMPSCI101 Lab", "class", courses[1], rooms[1], 
         base_date + timedelta(days=1, hours=11), 
         base_date + timedelta(days=1, hours=13), 
         "Prof. Ada", False),
        
        ("STATS100 Mid-term Exam", "exam", courses[2], rooms[0], 
         base_date + timedelta(days=3, hours=14), 
         base_date + timedelta(days=3, hours=16), 
         "N/A", True),
        
        ("ENGGEN205 Tutorial", "class", courses[0], rooms[2], 
         base_date + timedelta(days=2, hours=10), 
         base_date + timedelta(days=2, hours=11), 
         "Mr. Jones", False),
    ]
    
    for title, event_type, course, room, start_time, end_time, lecturer, is_urgent in events:
        Event.objects.create(
            title=title,
            event_type=event_type,
            course=course,
            room=room,
            start_time=start_time,
            end_time=end_time,
            lecturer=lecturer,
            is_urgent=is_urgent
        )
        print(f"Created event: {title}")

def main():
    """Main function to create all data"""
    print("Setting up Unimate demo data...\n")
    
    # Create data in the correct order
    create_users()
    courses = create_courses()
    rooms = create_rooms()
    create_enrollments(courses)
    create_events(courses, rooms)
    
    print("\nSetup complete! Demo data has been created successfully.")
    print("\nYou can now log in with:")
    print("Username: alice, Password: Pass123!")
    print("Username: bob, Password: Pass123!")
    print("Username: carol, Password: Pass123!")

if __name__ == "__main__":
    main() 