#!/usr/bin/env python
"""
RFID Connection Test Script
---------------------------
This script tests if the backend RFID scan endpoint is working correctly
by simulating card scans. It helps diagnose connection issues between
the ESP32 and server without modifying the ESP32 code.
"""

import requests
import time
import socket
import json
import sys
import argparse

# Test card IDs
TEST_CARDS = [
    "5A653600",   # Your actual RFID card
    "04B5C6D7E8", # Bob's card
    "0499AA11BB"  # Carol's card
]

def get_local_ip():
    """Get the local IP address of this machine"""
    try:
        # Create a socket to determine the IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Connect to Google DNS (doesn't send data)
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        # Fallback if the above doesn't work
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)

def test_scan_endpoint(server_url, card_id, kiosk_id):
    """Test the RFID scan endpoint with a card ID"""
    endpoint = f"{server_url}/api/scan/"
    
    payload = {
        "rfid_uid": card_id,
        "kiosk": kiosk_id
    }
    
    print(f"Testing endpoint: {endpoint}")
    print(f"Payload: {json.dumps(payload)}")
    
    try:
        response = requests.post(endpoint, json=payload, timeout=5)
        
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print("SUCCESS! Server accepted the card scan.")
            try:
                print(f"Response: {json.dumps(response.json(), indent=2)}")
            except:
                print(f"Response: {response.text[:100]}...")
            return True
        else:
            print(f"Error: Server returned {response.status_code}")
            print(f"Response: {response.text[:100]}...")
            return False
            
    except requests.exceptions.ConnectTimeout:
        print("Error: Connection timed out. Server might be down or unreachable.")
        return False
    except requests.exceptions.ConnectionError:
        print("Error: Connection error. Server is not running or firewall is blocking the connection.")
        return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def check_firewall_status():
    """Check if the firewall might be blocking connections to port 8000"""
    print("\nChecking if port 8000 is open locally...")
    
    try:
        # Try to create a socket binding to port 8000
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        result = s.connect_ex(('127.0.0.1', 8000))
        s.close()
        
        if result == 0:
            print("Port 8000 is open and accepting connections locally.")
            return True
        else:
            print("Port 8000 appears to be closed locally.")
            print("The server might not be running or the firewall might be blocking it.")
            return False
    except:
        print("Could not check port status.")
        return False

def main():
    parser = argparse.ArgumentParser(description="Test the RFID scan endpoint")
    parser.add_argument("--url", help="Server URL (default: auto-detect)", default=None)
    parser.add_argument("--card", help="RFID card ID to test with", default=TEST_CARDS[0])
    parser.add_argument("--kiosk", help="Kiosk ID to use", default="test-kiosk-1")
    parser.add_argument("--continuous", action="store_true", help="Continuously send scans")
    args = parser.parse_args()
    
    # Get the server URL
    if args.url:
        server_url = args.url
    else:
        # Try localhost first
        server_url = "http://localhost:8000"
        
    print(f"Local IP address: {get_local_ip()}")
    print(f"Using server URL: {server_url}")
    
    # Check firewall status
    check_firewall_status()
    
    # Test the endpoint
    print("\n--- Testing RFID Scan Endpoint ---")
    
    if args.continuous:
        print("Sending continuous scans. Press Ctrl+C to stop...")
        try:
            while True:
                for card in TEST_CARDS:
                    print(f"\nTesting card: {card}")
                    test_scan_endpoint(server_url, card, args.kiosk)
                    time.sleep(5)  # Wait 5 seconds between scans
        except KeyboardInterrupt:
            print("\nTest stopped by user.")
    else:
        success = test_scan_endpoint(server_url, args.card, args.kiosk)
        
        if not success:
            # Try with local IP
            local_ip = get_local_ip()
            print(f"\nTrying with local IP: {local_ip}...")
            server_url = f"http://{local_ip}:8000"
            test_scan_endpoint(server_url, args.card, args.kiosk)
    
    print("\n--- Troubleshooting Tips ---")
    print("1. Ensure the backend server is running with: python run.py --asgi")
    print("2. Check that port 8000 is open in your firewall")
    print("3. Update the ESP32 code with your correct IP address:")
    print(f"   const char *serverUrl = \"http://{get_local_ip()}:8000/api/scan/\";")
    print("4. Make sure ESP32 and your computer are on the same network")

if __name__ == "__main__":
    main() 