#!/usr/bin/env python
"""
Direct RFID Connection Test Script
---------------------------------
A very simple script to test multiple server configurations to find one that works.
"""

import requests
import socket
import time
import sys

# RFID card to use for testing
CARD_ID = "5A653600"
KIOSK_ID = "test-kiosk-1"

def get_all_ips():
    """Get all IP addresses on this machine"""
    hostname = socket.gethostname()
    ip_list = []
    
    # Try to get IP from hostname
    try:
        ip_list.append(socket.gethostbyname(hostname))
    except:
        pass
    
    # Try to get all IPs from socket connections
    try:
        ip_list.append(socket.gethostbyname_ex(hostname)[2][0])
    except:
        pass
    
    # Add local IPs
    ip_list.extend(['127.0.0.1', 'localhost'])
    
    # Add common LAN IPs
    for i in range(1, 10):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            if ip not in ip_list:
                ip_list.append(ip)
            
            # Add subnet variations
            parts = ip.split('.')
            if len(parts) == 4:
                base_ip = f"{parts[0]}.{parts[1]}.{parts[2]}."
                for j in range(1, 5):  # Try a few nearby addresses
                    test_ip = f"{base_ip}{int(parts[3]) + j}"
                    if test_ip not in ip_list:
                        ip_list.append(test_ip)
        except:
            pass
    
    # Try common local network IP patterns
    common_ips = [
        "192.168.0.1", "192.168.1.1", "192.168.20.1",  # Common router IPs
        "192.168.20.22",  # Specific IP from your output
    ]
    
    for ip in common_ips:
        if ip not in ip_list:
            ip_list.append(ip)
    
    return ip_list

def test_scan_endpoint(server_url, card_id, kiosk_id):
    """Test the RFID scan endpoint with a card ID"""
    payload = {
        "rfid_uid": card_id,
        "kiosk": kiosk_id
    }
    
    print(f"Testing: {server_url}")
    
    try:
        response = requests.post(server_url, json=payload, timeout=2)
        
        print(f"  Status code: {response.status_code}")
        if response.status_code == 200:
            print("  SUCCESS! Server accepted the card scan.")
            return True
        else:
            return False
            
    except requests.exceptions.ConnectionError:
        print("  Failed: Connection error")
        return False
    except requests.exceptions.Timeout:
        print("  Failed: Timeout")
        return False
    except Exception as e:
        print(f"  Failed: {str(e)}")
        return False

def main():
    print("======= RFID Direct Connection Test =======")
    
    # Try different port configurations
    ports = [8000, 8080, 8765, 80]
    
    # Get all possible IP addresses
    ip_addresses = get_all_ips()
    print(f"Found {len(ip_addresses)} IP addresses to test: {ip_addresses}")
    
    # Try different URL patterns
    found_working_url = False
    for ip in ip_addresses:
        for port in ports:
            # Test http://IP:PORT/api/scan/
            url = f"http://{ip}:{port}/api/scan/"
            if test_scan_endpoint(url, CARD_ID, KIOSK_ID):
                print(f"\n✅ WORKING URL FOUND: {url}")
                print(f"Update your ESP32 code with:")
                print(f'const char *serverUrl = "{url}";')
                found_working_url = True
                break
            
            # Test backend specific format
            url = f"http://{ip}:{port}/unimate/api/scan/"
            if test_scan_endpoint(url, CARD_ID, KIOSK_ID):
                print(f"\n✅ WORKING URL FOUND: {url}")
                print(f"Update your ESP32 code with:")
                print(f'const char *serverUrl = "{url}";')
                found_working_url = True
                break
            
            # Test root URL just in case
            url = f"http://{ip}:{port}/"
            if test_scan_endpoint(url, CARD_ID, KIOSK_ID):
                print(f"\n✅ WORKING URL FOUND: {url}")
                print(f"Update your ESP32 code with:")
                print(f'const char *serverUrl = "{url}";')
                found_working_url = True
                break
        
        if found_working_url:
            break
    
    if not found_working_url:
        print("\n❌ No working URL found. Make sure the backend server is running.")
        print("Try running: python run.py --asgi")
        print("Or: cd backend && python manage.py runserver 0.0.0.0:8000")
    
    # Test ESP32-specific steps
    print("\n== ESP32 Troubleshooting ==")
    print("1. Check that the ESP32 is on the same WiFi network as your computer")
    print("2. Verify your WiFi credentials in the ESP32 code:")
    print('   const char *ssid = "Your_WiFi_Name";')
    print('   const char *password = "Your_WiFi_Password";')
    print("3. Try enabling test mode in the ESP32 code by setting:")
    print('   bool testMode = true;')
    print("4. Check firewall settings to allow incoming connections on port 8000")

if __name__ == "__main__":
    main() 