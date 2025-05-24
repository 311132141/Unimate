#!/usr/bin/env python3
"""
Final test to verify dashboard is working completely
"""
import requests
import json

def test_complete_dashboard_flow():
    print("=== FINAL DASHBOARD TEST ===\n")
    
    base_url = "http://localhost:8000"
    
    # Test the user-events endpoint that the dashboard calls
    print("1. Testing /api/user-events/ endpoint...")
    try:
        response = requests.get(f"{base_url}/api/user-events/?username=testuser")
        
        if response.status_code == 200:
            data = response.json()
            user = data['user']
            events = user['events']
            
            print(f"✅ SUCCESS! Found {len(events)} events for testuser")
            print("\n📅 Events that will appear in dashboard:")
            
            for i, event in enumerate(events, 1):
                course_info = event.get('course', {})
                room_info = event.get('room', {})
                
                print(f"{i}. {event['title']}")
                print(f"   Course: {course_info.get('code', 'N/A')}")
                print(f"   Room: {room_info.get('building', 'N/A')} {room_info.get('number', 'N/A')}")
                print(f"   Time: {event['start_time']} - {event['end_time']}")
                print(f"   Lecturer: {event.get('lecturer', 'N/A')}")
                if event.get('is_urgent'):
                    print(f"   ⚠️  URGENT EVENT")
                print()
                
            return True
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

def test_login_endpoint():
    print("2. Testing /api/login/ endpoint...")
    try:
        response = requests.post('http://localhost:8000/api/login/', 
                               json={'username': 'testuser', 'password': 'password123'})
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful - Token generated")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

if __name__ == "__main__":
    success1 = test_complete_dashboard_flow()
    success2 = test_login_endpoint()
    
    if success1 and success2:
        print("\n🎉 ALL TESTS PASSED! Dashboard should now work correctly.")
        print("\n📋 Next steps:")
        print("1. Open http://localhost:8080/pages/index.html")
        print("2. Login with username: testuser, password: password123")
        print("3. You should see 6 events in your timetable")
    else:
        print("\n❌ Some tests failed. Please check the errors above.") 
"""
Final test to verify dashboard is working completely
"""
import requests
import json

def test_complete_dashboard_flow():
    print("=== FINAL DASHBOARD TEST ===\n")
    
    base_url = "http://localhost:8000"
    
    # Test the user-events endpoint that the dashboard calls
    print("1. Testing /api/user-events/ endpoint...")
    try:
        response = requests.get(f"{base_url}/api/user-events/?username=testuser")
        
        if response.status_code == 200:
            data = response.json()
            user = data['user']
            events = user['events']
            
            print(f"✅ SUCCESS! Found {len(events)} events for testuser")
            print("\n📅 Events that will appear in dashboard:")
            
            for i, event in enumerate(events, 1):
                course_info = event.get('course', {})
                room_info = event.get('room', {})
                
                print(f"{i}. {event['title']}")
                print(f"   Course: {course_info.get('code', 'N/A')}")
                print(f"   Room: {room_info.get('building', 'N/A')} {room_info.get('number', 'N/A')}")
                print(f"   Time: {event['start_time']} - {event['end_time']}")
                print(f"   Lecturer: {event.get('lecturer', 'N/A')}")
                if event.get('is_urgent'):
                    print(f"   ⚠️  URGENT EVENT")
                print()
                
            return True
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

def test_login_endpoint():
    print("2. Testing /api/login/ endpoint...")
    try:
        response = requests.post('http://localhost:8000/api/login/', 
                               json={'username': 'testuser', 'password': 'password123'})
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful - Token generated")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

if __name__ == "__main__":
    success1 = test_complete_dashboard_flow()
    success2 = test_login_endpoint()
    
    if success1 and success2:
        print("\n🎉 ALL TESTS PASSED! Dashboard should now work correctly.")
        print("\n📋 Next steps:")
        print("1. Open http://localhost:8080/pages/index.html")
        print("2. Login with username: testuser, password: password123")
        print("3. You should see 6 events in your timetable")
    else:
        print("\n❌ Some tests failed. Please check the errors above.") 