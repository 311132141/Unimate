#!/usr/bin/env python3
"""
Simulate ESP8266 RFID card scan to debug the difference between red button and real card scan
"""

import requests
import json

def test_esp8266_request():
    """Simulate exactly what the ESP8266 would send"""
    
    # This simulates the ESP8266 request
    esp8266_url = "http://192.168.20.22:8000/api/scan/"
    esp8266_data = {
        "rfid_uid": "5A653600",  # Alice's card
        "kiosk_id": "kiosk-1"    # ESP8266 might send this
    }
    
    print("🤖 Simulating ESP8266 RFID scan request...")
    print(f"URL: {esp8266_url}")
    print(f"Data: {json.dumps(esp8266_data, indent=2)}")
    
    try:
        response = requests.post(
            esp8266_url,
            json=esp8266_data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'ESP8266HTTPClient'  # ESP8266 specific user agent
            },
            timeout=10
        )
        
        print(f"\n📊 Response Status: {response.status_code}")
        print(f"📊 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"📊 Response Data: {json.dumps(response_data, indent=2)}")
            
            if 'user' in response_data:
                print("✅ SUCCESS: Backend returned user data")
                print(f"   User: {response_data['user']}")
                if 'access' in response_data:
                    print("✅ SUCCESS: Access token provided")
                else:
                    print("❌ ISSUE: No access token in response")
            else:
                print("❌ ISSUE: No user data in response")
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ CONNECTION ERROR: {e}")
        print("   This means the ESP8266 cannot reach the backend")
    except Exception as e:
        print(f"❌ ERROR: {e}")

def test_red_button_request():
    """Test the same request the red button makes"""
    
    button_url = "http://localhost:8000/api/scan/"
    button_data = {
        "rfid_uid": "5A653600"  # Same card, no kiosk_id
    }
    
    print("\n🔴 Simulating Red Button request...")
    print(f"URL: {button_url}")
    print(f"Data: {json.dumps(button_data, indent=2)}")
    
    try:
        response = requests.post(
            button_url,
            json=button_data,
            headers={
                'Content-Type': 'application/json'
            },
            timeout=5
        )
        
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"📊 Response Data: {json.dumps(response_data, indent=2)}")
            
            if 'user' in response_data:
                print("✅ SUCCESS: Backend returned user data")
                if 'access' in response_data:
                    print("✅ SUCCESS: Access token provided")
                else:
                    print("❌ ISSUE: No access token in response")
            else:
                print("❌ ISSUE: No user data in response")
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    print("🔍 DEBUGGING ESP8266 vs Red Button")
    print("=" * 50)
    
    # Test what red button does (this should work)
    test_red_button_request()
    
    # Test what ESP8266 would do  
    test_esp8266_request()
    
    print("\n" + "=" * 50)
    print("Compare the two responses above to find the difference!")
