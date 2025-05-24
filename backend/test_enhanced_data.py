#!/usr/bin/env python
"""
Test script for enhanced data setup
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from django.contrib.auth.models import User
from unimate.models import UserProfile, Course, Room, Enrollment, Event

def clean_database():
    """Clean up existing data"""
    print("Cleaning existing data...")
    Event.objects.all().delete()
    Enrollment.objects.all().delete()
    Course.objects.all().delete()
    Room.objects.all().delete()
    UserProfile.objects.all().delete()
    User.objects.filter(username__in=['alice', 'bob', 'carol', 'testuser']).delete()
    print("Database cleaned.")

def test_setup():
    """Test the setup"""
    clean_database()
    
    # Try importing and running the enhanced setup
    try:
        from setup_data_enhanced import main as enhanced_main
        enhanced_main()
        print("Enhanced setup completed successfully!")
        
        # Check results
        print(f"Created {Course.objects.count()} courses")
        print(f"Created {Room.objects.count()} rooms") 
        print(f"Created {Event.objects.count()} events")
        print(f"Created {User.objects.count()} users")
        
    except Exception as e:
        print(f"Error in enhanced setup: {e}")
        print("Using basic setup instead...")
        from setup_data import main as basic_main
        basic_main()

if __name__ == "__main__":
    test_setup() 
"""
Test script for enhanced data setup
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from django.contrib.auth.models import User
from unimate.models import UserProfile, Course, Room, Enrollment, Event

def clean_database():
    """Clean up existing data"""
    print("Cleaning existing data...")
    Event.objects.all().delete()
    Enrollment.objects.all().delete()
    Course.objects.all().delete()
    Room.objects.all().delete()
    UserProfile.objects.all().delete()
    User.objects.filter(username__in=['alice', 'bob', 'carol', 'testuser']).delete()
    print("Database cleaned.")

def test_setup():
    """Test the setup"""
    clean_database()
    
    # Try importing and running the enhanced setup
    try:
        from setup_data_enhanced import main as enhanced_main
        enhanced_main()
        print("Enhanced setup completed successfully!")
        
        # Check results
        print(f"Created {Course.objects.count()} courses")
        print(f"Created {Room.objects.count()} rooms") 
        print(f"Created {Event.objects.count()} events")
        print(f"Created {User.objects.count()} users")
        
    except Exception as e:
        print(f"Error in enhanced setup: {e}")
        print("Using basic setup instead...")
        from setup_data import main as basic_main
        basic_main()

if __name__ == "__main__":
    test_setup() 