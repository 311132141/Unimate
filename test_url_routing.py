#!/usr/bin/env python3
"""
Test script to debug URL routing and ensure connected.html is served instead of index.html
"""
import requests
import sys
import os

def test_backend_urls():
    """Test that backend URLs serve connected.html instead of index.html"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Backend URL Routing")
    print("=" * 50)
    
    # Test cases for different URLs that should serve connected.html
    test_urls = [
        "/",
        "/dashboard",
        "/login",
        "/nonexistent",
        "/views/dashboard.html",
        "/components/connected.html"
    ]
    
    for url in test_urls:
        full_url = f"{base_url}{url}"
        try:
            print(f"\n📍 Testing: {full_url}")
            response = requests.get(full_url, timeout=5)
            
            # Check response status
            print(f"   Status: {response.status_code}")
            
            # Check content type
            content_type = response.headers.get('content-type', '')
            print(f"   Content-Type: {content_type}")
            
            # Check if response contains connected.html content
            content = response.text
            
            # Look for indicators that this is connected.html vs index.html
            if "RFID Scanner" in content or "Tap your card" in content:
                print(f"   ✅ Serving connected.html content")
                result = "PASS"
            elif "University Wayfinding" in content and "Three.js" in content:
                print(f"   ❌ Serving index.html content (OLD)")
                result = "FAIL - Still serving index.html"
            elif "File" in content and "not found" in content:
                print(f"   ❌ File not found error")
                result = "FAIL - File not found"
            else:
                print(f"   ❓ Unknown content type")
                print(f"   First 200 chars: {content[:200]}...")
                result = "UNKNOWN"
            
            print(f"   Result: {result}")
            
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Connection failed - backend not running?")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)

def test_frontend_proxy():
    """Test that frontend proxy serves connected.html"""
    base_url = "http://localhost:8080"
    
    print("\n🧪 Testing Frontend Proxy Routing")
    print("=" * 50)
    
    test_urls = [
        "/",
        "/components/connected.html"
    ]
    
    for url in test_urls:
        full_url = f"{base_url}{url}"
        try:
            print(f"\n📍 Testing: {full_url}")
            response = requests.get(full_url, timeout=5)
            
            print(f"   Status: {response.status_code}")
            content_type = response.headers.get('content-type', '')
            print(f"   Content-Type: {content_type}")
            
            content = response.text
            if "RFID Scanner" in content or "Tap your card" in content:
                print(f"   ✅ Serving connected.html content")
            elif "University Wayfinding" in content:
                print(f"   ❌ Serving index.html content (OLD)")
            else:
                print(f"   ❓ Unknown content")
                print(f"   First 200 chars: {content[:200]}...")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Connection failed - frontend not running?")
        except Exception as e:
            print(f"   ❌ Error: {e}")

def check_file_existence():
    """Check which HTML files actually exist"""
    print("\n🧪 Checking File Existence")
    print("=" * 50)
    
    frontend_dir = "d:/Users/johni/Documents/Unimate/frontend"
    
    files_to_check = [
        "views/index.html",
        "components/connected.html",
        "components/standalone.html"
    ]
    
    for file_path in files_to_check:
        full_path = os.path.join(frontend_dir, file_path)
        exists = os.path.exists(full_path)
        print(f"   {file_path}: {'✅ EXISTS' if exists else '❌ NOT FOUND'}")
        
        if exists:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if "RFID Scanner" in content or "Tap your card" in content:
                    print(f"      → Contains connected.html content")
                elif "University Wayfinding" in content:
                    print(f"      → Contains index.html content")
                else:
                    print(f"      → Unknown content type")

if __name__ == "__main__":
    print("🔍 URL Routing Debug Test")
    print("=" * 50)
    
    # Check file existence first
    check_file_existence()
    
    # Test backend
    test_backend_urls()
    
    # Test frontend proxy
    test_frontend_proxy()
    
    print("\n✅ Test completed!")
