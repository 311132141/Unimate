#!/usr/bin/env python
"""
Minimal UNIMATE API Test Script
------------------------------
This script tests only the REST API endpoints (skipping WebSockets)
"""

import requests
import sys

def test_api_endpoints():
    base_url = "http://localhost:8000"
    token = None
    all_tests_passed = True
    
    print("\nTesting UNIMATE REST API Endpoints\n" + "-" * 40)
    
    # Test 1: RFID Scan endpoint
    print("\nTest 1: RFID Scan API")
    try:
        # Valid RFID
        response = requests.post(f"{base_url}/api/scan/", json={"rfid_uid": "04A1B2C3D4"})
        if response.status_code == 200:
            print("✅ Valid RFID scan: Success")
            token = response.json().get('access')
            print(f"   Received authentication token")
        else:
            print(f"❌ Valid RFID scan failed: {response.status_code}")
            all_tests_passed = False
            
        # Invalid RFID
        response = requests.post(f"{base_url}/api/scan/", json={"rfid_uid": "INVALID_UID"})
        if response.status_code == 404:
            print("✅ Invalid RFID scan: Correctly returns 404")
        else:
            print(f"❌ Invalid RFID scan failed: {response.status_code}")
            all_tests_passed = False
    except Exception as e:
        print(f"❌ RFID test exception: {str(e)}")
        all_tests_passed = False
    
    # If we don't have a token from RFID test, try credential login
    if not token:
        print("\nTest 2: Credential Login API")
        try:
            response = requests.post(f"{base_url}/api/login/", 
                                   json={"username": "bob", "password": "Pass123!"})
            if response.status_code == 200:
                print("✅ Credential login: Success")
                token = response.json().get('access')
                print(f"   Received authentication token")
            else:
                print(f"❌ Credential login failed: {response.status_code}")
                all_tests_passed = False
        except Exception as e:
            print(f"❌ Login test exception: {str(e)}")
            all_tests_passed = False
    
    # Test 3: Events API (with auth token)
    print("\nTest 3: Events API")
    if token:
        headers = {"Authorization": f"Bearer {token}"}
        try:
            response = requests.get(f"{base_url}/api/events/", headers=headers)
            if response.status_code == 200:
                events = response.json()
                print(f"✅ Events API: Success (received {len(events)} events)")
            else:
                print(f"❌ Events API failed: {response.status_code}")
                all_tests_passed = False
        except Exception as e:
            print(f"❌ Events test exception: {str(e)}")
            all_tests_passed = False
    else:
        print("⚠️ Events API: Skipped (no auth token available)")
    
    # Test 4: Route API
    print("\nTest 4: Route API")
    try:
        response = requests.get(f"{base_url}/api/route/", 
                              params={"from": "kiosk-1", "to": "ENG340"})
        if response.status_code == 200:
            print("✅ Route API: Success")
        else:
            print(f"❌ Route API failed: {response.status_code}")
            all_tests_passed = False
    except Exception as e:
        print(f"❌ Route test exception: {str(e)}")
        all_tests_passed = False
    
    # Summary
    print("\n" + "-" * 40)
    if all_tests_passed:
        print("✅ ALL REST API TESTS PASSED")
        print("\nNOTE: WebSocket tests were skipped due to Django dev server limitations.")
        print("      To properly test WebSockets, deploy with a production ASGI server.")
        return True
    else:
        print("❌ SOME TESTS FAILED (see above)")
        return False

if __name__ == "__main__":
    try:
        success = test_api_endpoints()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\nTest interrupted by user.")
        sys.exit(130)
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")
        sys.exit(1) 