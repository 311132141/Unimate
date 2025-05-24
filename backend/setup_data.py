#!/usr/bin/env python
"""
Setup script to populate the Unimate database with comprehensive test data.
Run this script with: python setup_data.py
"""
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

# Import models after Django setup
from django.contrib.auth.models import User
from unimate.models import UserProfile, Course, Room, Enrollment, Event

def register_card():
    """Register a specific RFID card for an existing user"""
    print("Registering additional RFID card...")
    
    # Check if user exists
    try:
        user = User.objects.get(username='john')
        print(f"Found user: {user.username}")
    except User.DoesNotExist:
        # Create the user if it doesn't exist
        user = User.objects.create_user(
            username='john',
            email='john@example.com',
            password='Pass123!',
            first_name='John',
            last_name='Doe'
        )
        print(f"Created user: {user.username}")
    
    # Update or create the profile with a different RFID UID
    profile, created = UserProfile.objects.update_or_create(
        user=user,
        defaults={'rfid_uid': '04D1E2F3G4'}  # Changed to a unique RFID UID
    )
    
    if created:
        print(f"Created profile for {user.username} with RFID: 04D1E2F3G4")
    else:
        print(f"Updated profile for {user.username} with RFID: 04D1E2F3G4")

def create_users():
    """Create demo users with pre-defined passwords"""
    print("Creating users...")
    
    # Delete existing users first to avoid conflicts
    User.objects.filter(username__in=['alice', 'bob', 'carol', 'testuser', 'john']).delete()
    
    # Create users with the plaintext passwords (Django will handle hashing)
    users = [
        ('alice', 'Pass123!', 'Alice', 'Wonderland', '04A1B2C3D4'),
        ('bob', 'Pass123!', 'Bob', 'Builder', '04B5C6D7E8'),
        ('carol', 'Pass123!', 'Carol', 'Danvers', '0499AA11BB'),
        ('testuser', 'password123', 'Test', 'User', '5A653600'),
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
    """Create comprehensive demo courses across multiple faculties"""
    print("\nCreating courses...")
    
    # Delete existing courses first
    Course.objects.all().delete()
    
    courses = [
        # Engineering Courses
        ('ENGGEN205', 'Engineering Mechanics', 'Introduction to static and dynamic mechanics, force analysis and equilibrium.'),
        ('ENGGEN131', 'Introduction to Engineering', 'Fundamentals of engineering design and problem-solving methodologies.'),
        ('MECH201', 'Thermodynamics', 'Principles of thermodynamics, heat engines, and energy conversion systems.'),
        ('CIVIL220', 'Structural Engineering', 'Analysis and design of structural systems including beams, columns, and foundations.'),
        ('ELEC201', 'Circuit Analysis', 'DC and AC circuit analysis, network theorems, and frequency response.'),
        
        # Computer Science Courses
        ('COMPSCI101', 'Introduction to Computer Science', 'Fundamental concepts of computer science and programming in Python.'),
        ('COMPSCI220', 'Data Structures and Algorithms', 'Advanced data structures, algorithm analysis, and complexity theory.'),
        ('COMPSCI235', 'Software Engineering', 'Software development methodologies, design patterns, and project management.'),
        ('COMPSCI367', 'Artificial Intelligence', 'Machine learning, neural networks, and AI applications.'),
        
        # Mathematics & Statistics
        ('STATS100', 'Introduction to Statistics', 'Basic statistical concepts, probability distributions, and hypothesis testing.'),
        ('MATHS150', 'Calculus and Linear Algebra', 'Differential and integral calculus, vector spaces, and matrix operations.'),
        ('MATHS250', 'Differential Equations', 'Ordinary and partial differential equations with engineering applications.'),
        ('STATS220', 'Statistical Modelling', 'Linear and non-linear regression, ANOVA, and statistical inference.'),
        
        # Business & Management
        ('BUS202', 'Business Strategy', 'Strategic management, competitive analysis, and organizational behavior.'),
        ('ACCTG102', 'Management Accounting', 'Cost accounting, budgeting, and performance measurement systems.'),
        ('ECON101', 'Microeconomics', 'Supply and demand, market structures, and consumer behavior analysis.'),
        ('MGMT301', 'Operations Management', 'Production planning, quality control, and supply chain management.'),
        
        # Arts & Humanities
        ('PHIL105', 'Introduction to Philosophy', 'Classical and contemporary philosophical problems and critical thinking.'),
        ('HIST210', 'Modern European History', 'European political, social, and cultural developments from 1789-1945.'),
        ('PSYC109', 'Introduction to Psychology', 'Cognitive, social, and developmental psychology fundamentals.'),
        ('ENGL120', 'Academic Writing', 'Essay structure, research methods, and scholarly communication skills.'),
        
        # Health & Life Sciences
        ('BIOSCI101', 'Cell Biology', 'Cellular structure, metabolism, and molecular biology fundamentals.'),
        ('CHEM110', 'General Chemistry', 'Atomic structure, chemical bonding, and reaction kinetics.'),
        ('PHYSICS201', 'Quantum Mechanics', 'Wave-particle duality, Schrödinger equation, and quantum systems.'),
        ('MEDSCI142', 'Human Anatomy', 'Structure and function of human organ systems and physiological processes.')
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
    """Create comprehensive demo rooms across multiple buildings"""
    print("\nCreating rooms...")
    
    # Delete existing rooms first
    Room.objects.all().delete()
    
    rooms = [
        # Engineering Building (ENG)
        ('ENG', '401-403', 4, {'x': 10, 'y': 5, 'z': 0}),
        ('ENG', '301', 3, {'x': 8, 'y': 4, 'z': 0}),
        ('ENG', '201', 2, {'x': 6, 'y': 3, 'z': 0}),
        ('ENG', '105', 1, {'x': 4, 'y': 2, 'z': 0}),
        ('ENG', 'Lab A', 1, {'x': 2, 'y': 1, 'z': 0}),
        
        # Science Building (SCI)
        ('SCI', '101A', 1, {'x': -5, 'y': 2, 'z': 1}),
        ('SCI', '201B', 2, {'x': -7, 'y': 4, 'z': 1}),
        ('SCI', '301C', 3, {'x': -9, 'y': 6, 'z': 1}),
        ('SCI', 'Physics Lab', 2, {'x': -6, 'y': 3, 'z': 1}),
        ('SCI', 'Chemistry Lab', 1, {'x': -4, 'y': 1, 'z': 1}),
        
        # Library (LIB)
        ('LIB', 'G02 (Study Hall)', 0, {'x': 0, 'y': 0, 'z': 0}),
        ('LIB', '301', 3, {'x': 1, 'y': 8, 'z': 0}),
        ('LIB', 'Conference Room A', 2, {'x': 2, 'y': 7, 'z': 0}),
        ('LIB', 'Group Study 1', 1, {'x': 3, 'y': 6, 'z': 0}),
        
        # Business School (BUS)
        ('BUS', 'Lecture Hall 1', 1, {'x': 15, 'y': -3, 'z': 2}),
        ('BUS', 'Seminar Room 201', 2, {'x': 17, 'y': -1, 'z': 2}),
        ('BUS', 'Case Study Room', 3, {'x': 19, 'y': 1, 'z': 2}),
        
        # Arts Building (ARTS)
        ('ARTS', '102', 1, {'x': -12, 'y': -5, 'z': 3}),
        ('ARTS', '203', 2, {'x': -14, 'y': -3, 'z': 3}),
        ('ARTS', 'Humanities Lab', 1, {'x': -10, 'y': -7, 'z': 3}),
        
        # Health Sciences Building (HSB)
        ('HSB', 'Anatomy Lab', 1, {'x': 5, 'y': -10, 'z': 4}),
        ('HSB', 'Lecture Theatre', 2, {'x': 7, 'y': -8, 'z': 4}),
        ('HSB', 'Tutorial Room 301', 3, {'x': 9, 'y': -6, 'z': 4})
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
    testuser = UserProfile.objects.get(user__username='testuser')
    
    # Create diverse enrollments - each user gets different courses
    enrollments = [
        # Alice - Engineering focus
        (alice, courses[0], "2025 S1"),  # ENGGEN205
        (alice, courses[2], "2025 S1"),  # MECH201
        (alice, courses[4], "2025 S1"),  # ELEC201
        (alice, courses[10], "2025 S1"), # MATHS150
        
        # Bob - Computer Science focus
        (bob, courses[5], "2025 S1"),    # COMPSCI101
        (bob, courses[6], "2025 S1"),    # COMPSCI220
        (bob, courses[7], "2025 S1"),    # COMPSCI235
        (bob, courses[9], "2025 S1"),    # STATS100
        
        # Carol - Business/Arts focus
        (carol, courses[13], "2025 S1"), # BUS202
        (carol, courses[14], "2025 S1"), # ACCTG102
        (carol, courses[17], "2025 S1"), # PHIL105
        (carol, courses[19], "2025 S1"), # PSYC109
        
        # TestUser - Mixed subjects
        (testuser, courses[0], "2025 S1"),  # ENGGEN205
        (testuser, courses[5], "2025 S1"),  # COMPSCI101
        (testuser, courses[9], "2025 S1"),  # STATS100
        (testuser, courses[13], "2025 S1"), # BUS202
        (testuser, courses[21], "2025 S1"), # BIOSCI101
    ]
    
    for user, course, semester in enrollments:
        Enrollment.objects.create(
            user=user,
            course=course,
            semester=semester
        )
        print(f"Enrolled {user.user.username} in {course.code}")

def create_events(courses, rooms):
    """Create comprehensive events spanning multiple days"""
    print("\nCreating events...")
    
    # Delete existing events first
    Event.objects.all().delete()
    
    # Base date for events (current date) - make timezone aware
    base_date = timezone.now().replace(hour=8, minute=0, second=0, microsecond=0)
    
    # Define a realistic weekly schedule
    events = []
    
    # Monday Schedule
    monday = base_date + timedelta(days=1)
    events.extend([
        ("ENGGEN205 Lecture", "class", courses[0], rooms[0], 
         monday.replace(hour=9), monday.replace(hour=10), "Dr. Sarah Smith", False),
        ("COMPSCI101 Lab", "class", courses[5], rooms[4], 
         monday.replace(hour=11), monday.replace(hour=13), "Prof. Ada Lovelace", False),
        ("MATHS150 Tutorial", "class", courses[10], rooms[13], 
         monday.replace(hour=14), monday.replace(hour=15), "Dr. Alan Turing", False),
        ("BUS202 Seminar", "class", courses[13], rooms[14], 
         monday.replace(hour=16), monday.replace(hour=17), "Prof. Michael Porter", False),
    ])
    
    # Tuesday Schedule
    tuesday = base_date + timedelta(days=2)
    events.extend([
        ("PHYSICS201 Lab Session", "class", courses[23], rooms[8], 
         tuesday.replace(hour=9), tuesday.replace(hour=12), "Prof. David Kim", False),
        ("STATS100 Lecture", "class", courses[9], rooms[1], 
         tuesday.replace(hour=13), tuesday.replace(hour=14), "Dr. Florence Nightingale", False),
        ("COMPSCI220 Lecture", "class", courses[6], rooms[2], 
         tuesday.replace(hour=15), tuesday.replace(hour=16), "Dr. Michael Chen", False),
        ("URGENT: PHIL105 Venue Change", "class", courses[17], rooms[17], 
         tuesday.replace(hour=17), tuesday.replace(hour=18), "Dr. Emma Wilson", True),
    ])
    
    # Wednesday Schedule  
    wednesday = base_date + timedelta(days=3)
    events.extend([
        ("MECH201 Lecture", "class", courses[2], rooms[3], 
         wednesday.replace(hour=9), wednesday.replace(hour=10), "Prof. James Watt", False),
        ("BIOSCI101 Lab", "class", courses[21], rooms[9], 
         wednesday.replace(hour=11), wednesday.replace(hour=14), "Dr. Marie Curie", False),
        ("STATS100 Mid-term Exam", "exam", courses[9], rooms[0], 
         wednesday.replace(hour=15), wednesday.replace(hour=17), "N/A", True),
        ("ENGL120 Workshop", "class", courses[20], rooms[12], 
         wednesday.replace(hour=18), wednesday.replace(hour=19), "Prof. Virginia Woolf", False),
    ])
    
    # Thursday Schedule
    thursday = base_date + timedelta(days=4)
    events.extend([
        ("CIVIL220 Design Project", "class", courses[3], rooms[5], 
         thursday.replace(hour=9), thursday.replace(hour=11), "Eng. Frank Lloyd Wright", False),
        ("COMPSCI367 AI Workshop", "class", courses[8], rooms[6], 
         thursday.replace(hour=12), thursday.replace(hour=14), "Dr. Geoffrey Hinton", False),
        ("ECON101 Tutorial", "class", courses[15], rooms[15], 
         thursday.replace(hour=15), thursday.replace(hour=16), "Prof. Adam Smith", False),
        ("CHEM110 Lab Session", "class", courses[22], rooms[9], 
         thursday.replace(hour=17), thursday.replace(hour=19), "Dr. Dmitri Mendeleev", False),
    ])
    
    # Friday Schedule
    friday = base_date + timedelta(days=5)
    events.extend([
        ("ENGGEN131 Project Presentation", "class", courses[1], rooms[20], 
         friday.replace(hour=9), friday.replace(hour=11), "Prof. Isambard Brunel", False),
        ("PSYC109 Lecture", "class", courses[19], rooms[17], 
         friday.replace(hour=12), friday.replace(hour=13), "Dr. Sigmund Freud", False),
        ("COMPSCI235 Code Review", "class", courses[7], rooms[7], 
         friday.replace(hour=14), friday.replace(hour=16), "Linus Torvalds", False),
        ("URGENT: MEDSCI142 Lab Cancelled", "class", courses[24], rooms[19], 
         friday.replace(hour=17), friday.replace(hour=19), "Dr. Andreas Vesalius", True),
    ])
    
    # Weekend Exams
    saturday = base_date + timedelta(days=6)
    events.extend([
        ("COMPSCI220 Final Exam", "exam", courses[6], rooms[0], 
         saturday.replace(hour=9), saturday.replace(hour=12), "N/A", False),
        ("MATHS250 Final Exam", "exam", courses[11], rooms[1], 
         saturday.replace(hour=14), saturday.replace(hour=17), "N/A", False),
    ])
    
    # Create all events in the database
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
        print(f"Created event: {title} - {start_time.strftime('%a %d %b, %H:%M')}")

def main():
    """Main function to create all comprehensive data"""
    print("Setting up UNIMATE comprehensive demo data...\n")
    
    # Create all the demo data
    create_users()
    courses = create_courses()
    rooms = create_rooms()
    create_enrollments(courses)
    create_events(courses, rooms)
    
    # Also register the specific card for backward compatibility
    register_card()
    
    print("\n" + "="*60)
    print("COMPREHENSIVE DEMO DATA SETUP COMPLETE!")
    print("="*60)
    print("\nCreated:")
    print(f"- {len(courses)} courses across 5 faculties")
    print(f"- {len(rooms)} rooms across 6 buildings")
    print("- 20+ events spanning multiple days")
    print("- 4 users with diverse course enrollments")
    print("\nYou can now login with:")
    print("- Username: testuser, Password: password123")
    print("- RFID: 5A653600")
    print("\nOr use other demo users: alice, bob, carol (all with password: Pass123!)")

if __name__ == "__main__":
    main() 