#!/usr/bin/env python3
import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("=== TESTING BACKEND API ===\n")
    
    # Test 1: Health check (root endpoint)
    print("1. Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Root endpoint accessible")
        else:
            print(f"   ❌ Root endpoint returned {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error accessing root: {e}")
    
    # Test 2: User events endpoint
    print("\n2. Testing user-events endpoint...")
    try:
        response = requests.get(f"{base_url}/api/user-events/?username=alice")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            user = data.get('user', {})
            events = user.get('events', [])
            
            print(f"   ✅ API Success! User: {user.get('username')}")
            print(f"   📅 Found {len(events)} events")
            
            # Show first event details
            if events:
                event = events[0]
                print(f"   📝 First event: {event.get('title')}")
                print(f"   🏫 Course: {event.get('course', {}).get('code', 'N/A')}")
                print(f"   📍 Room: {event.get('room', {}).get('building', 'N/A')} {event.get('room', {}).get('number', 'N/A')}")
                print(f"   🕐 Time: {event.get('start_time')}")
            
        else:
            print(f"   ❌ API Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")
    
    # Test 3: CORS headers
    print("\n3. Testing CORS headers...")
    try:
        response = requests.options(f"{base_url}/api/user-events/")
        print(f"   Status: {response.status_code}")
        cors_headers = {
            key: value for key, value in response.headers.items() 
            if 'cors' in key.lower() or 'access-control' in key.lower()
        }
        if cors_headers:
            print("   ✅ CORS headers found:")
            for key, value in cors_headers.items():
                print(f"      {key}: {value}")
        else:
            print("   ⚠️  No CORS headers found")
    except Exception as e:
        print(f"   ❌ Error checking CORS: {e}")

if __name__ == "__main__":
    test_backend() 
import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("=== TESTING BACKEND API ===\n")
    
    # Test 1: Health check (root endpoint)
    print("1. Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Root endpoint accessible")
        else:
            print(f"   ❌ Root endpoint returned {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error accessing root: {e}")
    
    # Test 2: User events endpoint
    print("\n2. Testing user-events endpoint...")
    try:
        response = requests.get(f"{base_url}/api/user-events/?username=alice")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            user = data.get('user', {})
            events = user.get('events', [])
            
            print(f"   ✅ API Success! User: {user.get('username')}")
            print(f"   📅 Found {len(events)} events")
            
            # Show first event details
            if events:
                event = events[0]
                print(f"   📝 First event: {event.get('title')}")
                print(f"   🏫 Course: {event.get('course', {}).get('code', 'N/A')}")
                print(f"   📍 Room: {event.get('room', {}).get('building', 'N/A')} {event.get('room', {}).get('number', 'N/A')}")
                print(f"   🕐 Time: {event.get('start_time')}")
            
        else:
            print(f"   ❌ API Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")
    
    # Test 3: CORS headers
    print("\n3. Testing CORS headers...")
    try:
        response = requests.options(f"{base_url}/api/user-events/")
        print(f"   Status: {response.status_code}")
        cors_headers = {
            key: value for key, value in response.headers.items() 
            if 'cors' in key.lower() or 'access-control' in key.lower()
        }
        if cors_headers:
            print("   ✅ CORS headers found:")
            for key, value in cors_headers.items():
                print(f"      {key}: {value}")
        else:
            print("   ⚠️  No CORS headers found")
    except Exception as e:
        print(f"   ❌ Error checking CORS: {e}")

if __name__ == "__main__":
    test_backend() 