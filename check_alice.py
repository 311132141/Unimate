#!/usr/bin/env python3
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.append('backend')
django.setup()

from django.contrib.auth.models import User
from unimate.models import UserProfile

def check_alice():
    print("=== CHECKING USER ALICE ===")
    
    # List all users first
    print("Available users:")
    users = User.objects.all()
    for user in users:
        try:
            profile = UserProfile.objects.get(user=user)
            print(f"  - {user.username} (RFID: {profile.rfid_uid})")
        except UserProfile.DoesNotExist:
            print(f"  - {user.username} (No profile)")
    
    # Check specifically for alice
    try:
        alice = User.objects.get(username='alice')
        profile = UserProfile.objects.get(user=alice)
        print(f"\n✅ Alice exists!")
        print(f"   Username: {alice.username}")
        print(f"   Profile ID: {profile.id}")
        print(f"   RFID UID: {profile.rfid_uid}")
        return True
    except User.DoesNotExist:
        print(f"\n❌ Alice user does not exist!")
        return False
    except UserProfile.DoesNotExist:
        print(f"\n❌ Alice exists but has no profile!")
        return False

if __name__ == "__main__":
    check_alice() 
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.append('backend')
django.setup()

from django.contrib.auth.models import User
from unimate.models import UserProfile

def check_alice():
    print("=== CHECKING USER ALICE ===")
    
    # List all users first
    print("Available users:")
    users = User.objects.all()
    for user in users:
        try:
            profile = UserProfile.objects.get(user=user)
            print(f"  - {user.username} (RFID: {profile.rfid_uid})")
        except UserProfile.DoesNotExist:
            print(f"  - {user.username} (No profile)")
    
    # Check specifically for alice
    try:
        alice = User.objects.get(username='alice')
        profile = UserProfile.objects.get(user=alice)
        print(f"\n✅ Alice exists!")
        print(f"   Username: {alice.username}")
        print(f"   Profile ID: {profile.id}")
        print(f"   RFID UID: {profile.rfid_uid}")
        return True
    except User.DoesNotExist:
        print(f"\n❌ Alice user does not exist!")
        return False
    except UserProfile.DoesNotExist:
        print(f"\n❌ Alice exists but has no profile!")
        return False

if __name__ == "__main__":
    check_alice() 