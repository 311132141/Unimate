#!/usr/bin/env python3
"""
Test what both servers are serving
"""

import requests

def test_both_servers():
    print("🔍 Testing both frontend and backend servers")
    
    # Test frontend server
    print("\n📍 Testing Frontend Server (port 8080)")
    try:
        response = requests.get("http://localhost:8080/", timeout=5)
        content = response.text
        if "<title>Unimate - Kiosk</title>" in content:
            print("   ✅ Frontend serving connected.html correctly")
        else:
            print("   ❌ Frontend not serving connected.html")
            print(f"   Found title: {content[content.find('<title>'):content.find('</title>')+8] if '<title>' in content else 'No title found'}")
    except Exception as e:
        print(f"   ❌ Frontend error: {e}")
    
    # Test backend server
    print("\n📍 Testing Backend Server (port 8000)")
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        content = response.text
        if "<title>Unimate - Kiosk</title>" in content:
            print("   ✅ Backend serving connected.html correctly")
        else:
            print("   ❌ Backend not serving connected.html")
            print(f"   Found title: {content[content.find('<title>'):content.find('</title>')+8] if '<title>' in content else 'No title found'}")
    except Exception as e:
        print(f"   ❌ Backend error: {e}")

if __name__ == "__main__":
    test_both_servers()
