#!/usr/bin/env python3
import requests
import json

def test_user_events():
    try:
        # Test the new user events endpoint
        print("Testing user events API...")
        response = requests.get('http://localhost:8000/api/user-events/?username=testuser')
        
        if response.status_code == 200:
            data = response.json()
            user = data['user']
            events = user['events']
            
            print(f"✅ API Success! User: {user['username']}")
            print(f"📅 Found {len(events)} events for testuser:")
            
            for event in events:
                print(f"  - {event['title']} ({event['course_code']})")
                print(f"    📍 {event['room_building']} {event['room_number']}")
                print(f"    🕐 {event['start_time']} - {event['end_time']}")
                if event.get('is_urgent'):
                    print(f"    ⚠️  URGENT")
                print()
                
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def test_login():
    try:
        print("\nTesting login API...")
        response = requests.post('http://localhost:8000/api/login/', 
                               json={'username': 'testuser', 'password': 'password123'})
        
        if response.status_code == 200:
            data = response.json()
            user = data['user']
            events = user['events']
            
            print(f"✅ Login Success! User: {user['username']}")
            print(f"📅 Found {len(events)} events via login:")
            
            for event in events:
                print(f"  - {event['title']}")
                
        else:
            print(f"❌ Login Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_user_events()
    test_login() 
import requests
import json

def test_user_events():
    try:
        # Test the new user events endpoint
        print("Testing user events API...")
        response = requests.get('http://localhost:8000/api/user-events/?username=testuser')
        
        if response.status_code == 200:
            data = response.json()
            user = data['user']
            events = user['events']
            
            print(f"✅ API Success! User: {user['username']}")
            print(f"📅 Found {len(events)} events for testuser:")
            
            for event in events:
                print(f"  - {event['title']} ({event['course_code']})")
                print(f"    📍 {event['room_building']} {event['room_number']}")
                print(f"    🕐 {event['start_time']} - {event['end_time']}")
                if event.get('is_urgent'):
                    print(f"    ⚠️  URGENT")
                print()
                
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def test_login():
    try:
        print("\nTesting login API...")
        response = requests.post('http://localhost:8000/api/login/', 
                               json={'username': 'testuser', 'password': 'password123'})
        
        if response.status_code == 200:
            data = response.json()
            user = data['user']
            events = user['events']
            
            print(f"✅ Login Success! User: {user['username']}")
            print(f"📅 Found {len(events)} events via login:")
            
            for event in events:
                print(f"  - {event['title']}")
                
        else:
            print(f"❌ Login Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_user_events()
    test_login() 