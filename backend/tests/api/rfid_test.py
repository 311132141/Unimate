#!/usr/bin/env python
"""
RFID Scan Test Script
--------------------
This script tests only the RFID scan endpoint of the Unimate API.

Usage: python rfid_test.py
"""
import requests
import json
import sys

# Configuration
API_URL = "http://localhost:8000/api/scan/"
VALID_UID = "04A1B2C3D4"  # Alice's card UID
INVALID_UID = "INVALID_UID"

def test_valid_rfid():
    """Test with a valid RFID UID."""
    print(f"\nTesting valid RFID card scan: {VALID_UID} (Alice)")
    
    payload = {
        "rfid_uid": VALID_UID,
        "kiosk": "kiosk-test"
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Success! Card recognized.")
            try:
                data = response.json()
                print("Token received:")
                print(f"  Access token: {data.get('access', 'Not found')[:20]}...")
                print(f"  User: {data.get('user', {}).get('username', 'Not found')}")
                print("\nFull response data:")
                print(json.dumps(data, indent=2))
                return True
            except Exception as e:
                print(f"❌ Failed to parse JSON: {e}")
                print("Raw response:", response.text[:200])
        else:
            print(f"❌ Failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    return False

def test_invalid_rfid():
    """Test with an invalid RFID UID."""
    print(f"\nTesting invalid RFID card scan: {INVALID_UID}")
    
    payload = {
        "rfid_uid": INVALID_UID,
        "kiosk": "kiosk-test"
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Success! Invalid card correctly rejected.")
            print(f"Response: {response.text}")
            return True
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    return False

def main():
    """Main function."""
    print("=" * 50)
    print("UNIMATE RFID SCAN API TEST")
    print("=" * 50)
    
    # Check if server is running
    try:
        requests.get("http://localhost:8000/")
        print("Server is running.")
    except requests.RequestException:
        print("❌ Error: Cannot connect to server at http://localhost:8000/")
        print("Please start the server with 'python run.py --asgi' and try again.")
        sys.exit(1)
    
    # Run tests
    valid_passed = test_valid_rfid()
    invalid_passed = test_invalid_rfid()
    
    # Print summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Valid RFID test: {'✅ PASSED' if valid_passed else '❌ FAILED'}")
    print(f"Invalid RFID test: {'✅ PASSED' if invalid_passed else '❌ FAILED'}")
    
    # Return exit code 0 if both passed, otherwise 1
    if valid_passed and invalid_passed:
        print("\n✅ All tests passed!")
        return 0
    else:
        print("\n❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 