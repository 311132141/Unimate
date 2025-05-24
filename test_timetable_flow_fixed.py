#!/usr/bin/env python3
"""
Test script to verify the complete login and timetable flow
"""
import requests
import json
import time

def test_complete_flow():
    print("=== TESTING UNIMATE TIMETABLE FLOW ===\n")
    
    # Base URL
    base_url = "http://localhost:8000"
    
    # Test 1: Login endpoint
    print("1. Testing login endpoint...")
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/login/", json=login_data)
        
        if response.status_code == 200:
            print("✅ Login successful!")
            data = response.json()
            
            # Extract token
            access_token = data.get('access')
            
            # Check user data
            user = data.get('user', {})
            events = user.get('events', [])
            
            print(f"   - Username: {user.get('username')}")
            print(f"   - Access token: {access_token[:20]}...")
            print(f"   - Events returned: {len(events)}")
            
            if events:
                print("\n   📅 Events for testuser:")
                for i, event in enumerate(events, 1):
                    course = event.get('course', {})
                    room = event.get('room', {})
                    print(f"      {i}. {event.get('title')} ({course.get('code', 'N/A')})")
                    print(f"         - Room: {room.get('building', 'N/A')} {room.get('number', 'N/A')}")
                    print(f"         - Lecturer: {event.get('lecturer', 'N/A')}")
                    print(f"         - Type: {event.get('event_type', 'N/A')}")
                    if event.get('is_urgent'):
                        print(f"         - ⚠️  URGENT")
            else:
                print("   ❌ No events returned in login response!")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error during login: {str(e)}")
        return
    
    # Test 2: Check user-events endpoint
    print("\n2. Testing user-events endpoint...")
    try:
        response = requests.get(f"{base_url}/api/user-events/?username=testuser")
        
        if response.status_code == 200:
            print("✅ User events endpoint working!")
            data = response.json()
            user = data.get('user', {})
            events = user.get('events', [])
            
            print(f"   - Found {len(events)} events for testuser")
            
            # Show first 3 events
            for i, event in enumerate(events[:3], 1):
                course = event.get('course', {})
                print(f"   {i}. {event.get('title')} - {course.get('code', 'N/A')}")
        else:
            print(f"❌ User events endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error accessing user events: {str(e)}")
    
    # Test 3: Check WebSocket connectivity
    print("\n3. Testing WebSocket endpoint...")
    print("   - WebSocket URL: ws://localhost:8000/ws/unimate/")
    print("   - Note: WebSocket requires asynchronous client for full test")
    
    # Test 4: Frontend accessibility
    print("\n4. Testing frontend accessibility...")
    frontend_urls = [
        "http://localhost:8080/",
        "http://localhost:8080/pages/index.html",
        "http://localhost:8080/pages/dashboard.html",
        "http://localhost:8080/static/js/app.js"
    ]
    
    for url in frontend_urls:
        try:
            response = requests.get(url, timeout=2)
            status = "✅" if response.status_code == 200 else "❌"
            print(f"   {status} {url} - Status: {response.status_code}")
        except:
            print(f"   ❌ {url} - Could not connect")
    
    print("\n=== TEST COMPLETE ===")
    print("\nTo manually test:")
    print("1. Open http://localhost:8080/pages/index.html")
    print("2. Login with: testuser / password123")
    print("3. You should see 6 events in the timetable")
    print("\nEvents should include:")
    print("- ENGGEN205 Lecture (ENG 401-403)")
    print("- COMPSCI101 Lab (ENG Lab A)")
    print("- STATS100 Lecture (SCI 201B)")
    print("- STATS100 Mid-term Exam (ENG 401-403) - URGENT")
    print("- BUS202 Seminar (BUS Seminar Room 201)")
    print("- BIOSCI101 Lab (SCI Chemistry Lab)")

if __name__ == "__main__":
    # Give servers a moment to fully start
    print("Waiting for servers to start...")
    time.sleep(2)
    
    test_complete_flow() 
"""
Test script to verify the complete login and timetable flow
"""
import requests
import json
import time

def test_complete_flow():
    print("=== TESTING UNIMATE TIMETABLE FLOW ===\n")
    
    # Base URL
    base_url = "http://localhost:8000"
    
    # Test 1: Login endpoint
    print("1. Testing login endpoint...")
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/login/", json=login_data)
        
        if response.status_code == 200:
            print("✅ Login successful!")
            data = response.json()
            
            # Extract token
            access_token = data.get('access')
            
            # Check user data
            user = data.get('user', {})
            events = user.get('events', [])
            
            print(f"   - Username: {user.get('username')}")
            print(f"   - Access token: {access_token[:20]}...")
            print(f"   - Events returned: {len(events)}")
            
            if events:
                print("\n   📅 Events for testuser:")
                for i, event in enumerate(events, 1):
                    course = event.get('course', {})
                    room = event.get('room', {})
                    print(f"      {i}. {event.get('title')} ({course.get('code', 'N/A')})")
                    print(f"         - Room: {room.get('building', 'N/A')} {room.get('number', 'N/A')}")
                    print(f"         - Lecturer: {event.get('lecturer', 'N/A')}")
                    print(f"         - Type: {event.get('event_type', 'N/A')}")
                    if event.get('is_urgent'):
                        print(f"         - ⚠️  URGENT")
            else:
                print("   ❌ No events returned in login response!")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error during login: {str(e)}")
        return
    
    # Test 2: Check user-events endpoint
    print("\n2. Testing user-events endpoint...")
    try:
        response = requests.get(f"{base_url}/api/user-events/?username=testuser")
        
        if response.status_code == 200:
            print("✅ User events endpoint working!")
            data = response.json()
            user = data.get('user', {})
            events = user.get('events', [])
            
            print(f"   - Found {len(events)} events for testuser")
            
            # Show first 3 events
            for i, event in enumerate(events[:3], 1):
                course = event.get('course', {})
                print(f"   {i}. {event.get('title')} - {course.get('code', 'N/A')}")
        else:
            print(f"❌ User events endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error accessing user events: {str(e)}")
    
    # Test 3: Check WebSocket connectivity
    print("\n3. Testing WebSocket endpoint...")
    print("   - WebSocket URL: ws://localhost:8000/ws/unimate/")
    print("   - Note: WebSocket requires asynchronous client for full test")
    
    # Test 4: Frontend accessibility
    print("\n4. Testing frontend accessibility...")
    frontend_urls = [
        "http://localhost:8080/",
        "http://localhost:8080/pages/index.html",
        "http://localhost:8080/pages/dashboard.html",
        "http://localhost:8080/static/js/app.js"
    ]
    
    for url in frontend_urls:
        try:
            response = requests.get(url, timeout=2)
            status = "✅" if response.status_code == 200 else "❌"
            print(f"   {status} {url} - Status: {response.status_code}")
        except:
            print(f"   ❌ {url} - Could not connect")
    
    print("\n=== TEST COMPLETE ===")
    print("\nTo manually test:")
    print("1. Open http://localhost:8080/pages/index.html")
    print("2. Login with: testuser / password123")
    print("3. You should see 6 events in the timetable")
    print("\nEvents should include:")
    print("- ENGGEN205 Lecture (ENG 401-403)")
    print("- COMPSCI101 Lab (ENG Lab A)")
    print("- STATS100 Lecture (SCI 201B)")
    print("- STATS100 Mid-term Exam (ENG 401-403) - URGENT")
    print("- BUS202 Seminar (BUS Seminar Room 201)")
    print("- BIOSCI101 Lab (SCI Chemistry Lab)")

if __name__ == "__main__":
    # Give servers a moment to fully start
    print("Waiting for servers to start...")
    time.sleep(2)
    
    test_complete_flow() 