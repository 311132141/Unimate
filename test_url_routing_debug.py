#!/usr/bin/env python3
"""
Test script to debug URL routing issues
This will test if the backend is serving connected.html instead of index.html
"""

import requests
import sys
import time

def test_url_routing():
    print("🔍 Testing URL routing to ensure connected.html is served instead of index.html")
    
    base_url = "http://localhost:8000"
    
    # Test cases
    test_urls = [
        "/",
        "/dashboard/",
        "/some-random-path/",
        "/views/dashboard.html"
    ]
    
    print(f"Testing against backend at: {base_url}")
    
    for test_url in test_urls:
        full_url = f"{base_url}{test_url}"
        print(f"\n📍 Testing URL: {full_url}")
        
        try:
            response = requests.get(full_url, timeout=5)
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                content = response.text
                
                # Check what's actually being served
                if "connected.html" in content or "Unimate - Connect Your Card" in content:
                    print("   ✅ PASS: Serving connected.html content")
                elif "index.html" in content or content.strip().startswith("<!DOCTYPE html>"):
                    print("   ❌ FAIL: Serving index.html or unknown HTML content")
                    print(f"   First 200 chars: {content[:200]}...")
                else:
                    print(f"   ⚠️  UNKNOWN: Content type unclear")
                    print(f"   First 100 chars: {content[:100]}...")
                    
            elif response.status_code == 404:
                print("   ❌ FAIL: 404 Not Found")
            else:
                print(f"   ⚠️  Unexpected status code: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("   ❌ FAIL: Connection refused - backend not running")
            return False
        except Exception as e:
            print(f"   ❌ FAIL: Error - {e}")
            return False
            
    return True

def test_file_serving_function():
    print("\n🔍 Testing file serving function directly")
    
    # Test if the files exist
    import os
    
    frontend_dir = "d:\\Users\\johni\\Documents\\Unimate\\frontend"
    connected_file = os.path.join(frontend_dir, "components", "connected.html")
    
    print(f"Checking if connected.html exists at: {connected_file}")
    if os.path.exists(connected_file):
        print("   ✅ connected.html file exists")
        
        # Read first few lines to verify content
        with open(connected_file, 'r') as f:
            first_lines = f.read(500)
            if "Unimate" in first_lines:
                print("   ✅ connected.html has expected content")
            else:
                print("   ⚠️  connected.html content might be unexpected")
                print(f"   First 200 chars: {first_lines[:200]}...")
    else:
        print("   ❌ connected.html file does not exist!")
        return False
        
    return True

def main():
    print("=" * 60)
    print("URL ROUTING DEBUG TEST")
    print("=" * 60)
    
    # Test 1: Check if files exist
    if not test_file_serving_function():
        print("\n❌ File existence test failed!")
        return
    
    # Test 2: Test URL routing
    if not test_url_routing():
        print("\n❌ URL routing test failed!")
        return
        
    print("\n" + "=" * 60)
    print("✅ All tests completed. Check results above.")
    print("=" * 60)

if __name__ == "__main__":
    main()
