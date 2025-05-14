#!/usr/bin/env python
"""
UNIMATE API Test Script
----------------------
This script tests if the RFID API endpoint is functioning properly.
"""
import requests
import json
import sys

# Configure endpoints
API_URL = "http://localhost:8000/api/scan/"
VALID_RFID = "04A1B2C3D4"  # Alice's card
INVALID_RFID = "INVALID_UID"

def test_rfid_api():
    """Test the RFID API endpoint"""
    print("Testing RFID API...")
    
    results = {
        "valid_rfid": {
            "success": False,
            "details": None
        },
        "invalid_rfid": {
            "success": False,
            "details": None
        }
    }
    
    # Test valid RFID
    print(f"\nTesting valid RFID card: {VALID_RFID}")
    try:
        payload = {
            "rfid_uid": VALID_RFID,
            "kiosk": "test-kiosk"
        }
        
        response = requests.post(
            API_URL,
            json=payload,
            timeout=5
        )
        
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            results["valid_rfid"]["success"] = True
            try:
                data = response.json()
                results["valid_rfid"]["details"] = data
                print(f"Response: {json.dumps(data, indent=2)}")
            except:
                results["valid_rfid"]["details"] = response.text
                print(f"Response: {response.text}")
        else:
            results["valid_rfid"]["details"] = f"Unexpected status code: {response.status_code}"
            print(f"Unexpected status code: {response.status_code}")
    
    except Exception as e:
        results["valid_rfid"]["details"] = str(e)
        print(f"Error testing valid RFID: {e}")
    
    # Test invalid RFID
    print(f"\nTesting invalid RFID card: {INVALID_RFID}")
    try:
        payload = {
            "rfid_uid": INVALID_RFID,
            "kiosk": "test-kiosk" 
        }
        
        response = requests.post(
            API_URL,
            json=payload,
            timeout=5
        )
        
        print(f"Status code: {response.status_code}")
        # For invalid RFID, we expect a 404 Not Found
        if response.status_code == 404:
            results["invalid_rfid"]["success"] = True
            results["invalid_rfid"]["details"] = "Successfully rejected invalid RFID"
            print("Successfully rejected invalid RFID")
        else:
            try:
                data = response.json()
                results["invalid_rfid"]["details"] = data
                print(f"Response: {json.dumps(data, indent=2)}")
            except:
                results["invalid_rfid"]["details"] = response.text
                print(f"Response: {response.text}")
    
    except Exception as e:
        results["invalid_rfid"]["details"] = str(e)
        print(f"Error testing invalid RFID: {e}")
    
    return results

def main():
    print("=" * 60)
    print("UNIMATE API TEST")
    print("=" * 60)
    
    # Test RFID API
    results = test_rfid_api()
    
    # Print results
    print("\n" + "=" * 60)
    print("TEST RESULTS")
    print("=" * 60)
    
    print(f"Valid RFID Test: {'[PASSED]' if results['valid_rfid']['success'] else '[FAILED]'}")
    print(f"  Details: {results['valid_rfid']['details']}")
    
    print(f"Invalid RFID Test: {'[PASSED]' if results['invalid_rfid']['success'] else '[FAILED]'}")
    print(f"  Details: {results['invalid_rfid']['details']}")
    
    # Return exit code
    if results['valid_rfid']['success'] and results['invalid_rfid']['success']:
        print("\n[SUCCESS] ALL API TESTS PASSED!")
        return 0
    else:
        print("\n[ERROR] SOME API TESTS FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 