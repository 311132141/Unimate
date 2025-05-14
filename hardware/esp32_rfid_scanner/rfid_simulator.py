#!/usr/bin/env python
"""
RFID Scanner Simulator
----------------------
This script simulates the ESP32 RFID scanner sending card UIDs to the server.
It's useful for testing the API without the actual hardware.

Usage:
  python rfid_simulator.py

Demo cards:
  - 04A1B2C3D4 (Alice)
  - 04B5C6D7E8 (Bob)
  - 0499AA11BB (Carol)
"""

import requests
import json
import time
import sys
import os
import random

# Configuration
API_URL = "http://localhost:8000/api/scan/"
KIOSK_ID = "kiosk-simulator"

# Demo cards (from fixtures)
DEMO_CARDS = [
    "04A1B2C3D4",  # Alice
    "04B5C6D7E8",  # Bob
    "0499AA11BB",  # Carol
]

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def simulate_card_scan(rfid_uid):
    """Simulate a card scan by sending a POST request to the API."""
    print(f"Scanning card with UID: {rfid_uid}")
    
    payload = {
        "rfid_uid": rfid_uid,
        "kiosk": KIOSK_ID
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        print(f"Status code: {response.status_code}")
        
        if response.status_code in [200, 204]:
            print("Success! Card recognized.")
            if response.status_code == 200:
                try:
                    data = response.json()
                    print("Response data:")
                    print(json.dumps(data, indent=2))
                except Exception as e:
                    print(f"Failed to parse JSON: {e}")
                    print("Raw response:", response.text[:200])
        else:
            print(f"Error: {response.text}")
    
    except requests.RequestException as e:
        print(f"Request failed: {e}")
    
    print("-" * 40)
    return response.status_code if 'response' in locals() else None

def interactive_mode():
    """Run the simulator in interactive mode."""
    clear_screen()
    print("=" * 40)
    print("RFID Scanner Simulator (Interactive Mode)")
    print("=" * 40)
    
    while True:
        print("\nChoose an option:")
        print("1. Scan Alice's card (04A1B2C3D4)")
        print("2. Scan Bob's card (04B5C6D7E8)")
        print("3. Scan Carol's card (0499AA11BB)")
        print("4. Enter custom card UID")
        print("5. Random invalid card")
        print("q. Quit")
        
        choice = input("> ").strip().lower()
        
        if choice == 'q':
            print("Exiting simulator...")
            sys.exit(0)
        elif choice == '1':
            simulate_card_scan(DEMO_CARDS[0])
        elif choice == '2':
            simulate_card_scan(DEMO_CARDS[1])
        elif choice == '3':
            simulate_card_scan(DEMO_CARDS[2])
        elif choice == '4':
            uid = input("Enter card UID: ").strip().upper()
            simulate_card_scan(uid)
        elif choice == '5':
            # Generate a random invalid UID
            invalid_uid = ''.join(random.choice('0123456789ABCDEF') for _ in range(10))
            simulate_card_scan(invalid_uid)
        else:
            print("Invalid choice!")
        
        # Pause before continuing
        input("Press Enter to continue...")
        clear_screen()

def main():
    # Check if the server is reachable
    try:
        response = requests.get("http://localhost:8000/admin/")
        if response.status_code not in [200, 302, 403]:
            print("Warning: Server might not be running correctly")
    except requests.RequestException:
        print("Error: Cannot connect to the server. Is it running?")
        print(f"Expected URL: {API_URL}")
        sys.exit(1)
    
    # Start interactive mode
    interactive_mode()

if __name__ == "__main__":
    main() 