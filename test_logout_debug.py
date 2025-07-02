#!/usr/bin/env python3
"""
Test logout functionality to debug why it goes to index.html instead of connected.html
"""

import requests
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_logout_redirect():
    """Test the logout functionality end-to-end"""
    
    print("🧪 Testing Logout Redirect Functionality")
    print("=" * 60)
    
    try:
        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        print("🌐 Starting browser...")
        driver = webdriver.Chrome(options=chrome_options)
        
        try:
            # Step 1: Go to the main page
            print("\n📍 Step 1: Loading main page")
            driver.get("http://localhost:8080/")
            time.sleep(2)
            
            current_url = driver.current_url
            page_title = driver.title
            print(f"   Current URL: {current_url}")
            print(f"   Page Title: {page_title}")
            
            # Check if we're on the right page
            if "Kiosk" in page_title:
                print("   ✅ Successfully loaded connected.html")
            else:
                print(f"   ❌ Wrong page loaded: {page_title}")
            
            # Step 2: Simulate login by clicking red button
            print("\n📍 Step 2: Clicking red test button to login")
            test_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Test RFID Scan')]"))
            )
            test_button.click()
            
            # Wait for redirect to dashboard
            print("   Waiting for redirect to dashboard...")
            WebDriverWait(driver, 10).until(
                lambda d: "dashboard" in d.current_url.lower() or "Dashboard" in d.title
            )
            
            current_url = driver.current_url
            page_title = driver.title
            print(f"   Current URL: {current_url}")
            print(f"   Page Title: {page_title}")
            
            if "dashboard" in current_url.lower() or "Dashboard" in page_title:
                print("   ✅ Successfully redirected to dashboard")
            else:
                print(f"   ❌ Failed to redirect to dashboard")
                return False
            
            # Step 3: Click logout button
            print("\n📍 Step 3: Clicking logout button")
            logout_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.ID, "logout-button"))
            )
            logout_button.click()
            
            # Wait for redirect after logout
            print("   Waiting for redirect after logout...")
            time.sleep(3)
            
            final_url = driver.current_url
            final_title = driver.title
            print(f"   Final URL: {final_url}")
            print(f"   Final Title: {final_title}")
            
            # Check what page we ended up on
            if "Kiosk" in final_title:
                print("   ✅ SUCCESS: Logout redirected to connected.html")
                return True
            elif "index" in final_url.lower() or "University Wayfinding" in final_title:
                print("   ❌ FAIL: Logout redirected to index.html")
                return False
            else:
                print(f"   ❓ UNKNOWN: Logout redirected to unknown page: {final_title}")
                return False
                
        finally:
            driver.quit()
            
    except Exception as e:
        print(f"❌ Browser test failed: {e}")
        return False

def test_dashboard_logout_code():
    """Test the logout code in dashboard.html directly"""
    
    print("\n🧪 Testing Dashboard Logout Code")
    print("=" * 60)
    
    try:
        # Read the dashboard.html file
        dashboard_path = "d:/Users/johni/Documents/Unimate/frontend/views/dashboard.html"
        with open(dashboard_path, 'r', encoding='utf-8') as f:
            dashboard_content = f.read()
        
        # Look for logout button event listener
        if "logout-button" in dashboard_content:
            print("✅ Found logout-button in dashboard.html")
        else:
            print("❌ No logout-button found in dashboard.html")
            return False
        
        # Look for the redirect logic
        if "connected.html" in dashboard_content:
            print("✅ Found connected.html references in dashboard.html")
            
            # Count how many times connected.html appears
            connected_count = dashboard_content.count("connected.html")
            print(f"   Found {connected_count} references to connected.html")
            
            # Look for specific logout redirect
            if "window.location.href = '../components/connected.html'" in dashboard_content:
                print("✅ Found correct logout redirect to ../components/connected.html")
            else:
                print("❌ Logout redirect not found or incorrect")
                
        if "index.html" in dashboard_content:
            print("❌ PROBLEM: Found index.html references in dashboard.html")
            index_count = dashboard_content.count("index.html")
            print(f"   Found {index_count} references to index.html")
            
            # Find the lines containing index.html
            lines = dashboard_content.split('\n')
            for i, line in enumerate(lines):
                if "index.html" in line:
                    print(f"   Line {i+1}: {line.strip()}")
        else:
            print("✅ No index.html references found in dashboard.html")
            
        return True
        
    except Exception as e:
        print(f"❌ Error reading dashboard.html: {e}")
        return False

def test_manual_logout():
    """Test logout manually by checking localStorage and redirect"""
    
    print("\n🧪 Manual Logout Test")
    print("=" * 60)
    
    print("📝 Manual test steps:")
    print("1. Open browser to http://localhost:8080/")
    print("2. Click red 'Test RFID Scan' button")
    print("3. Wait for dashboard to load")
    print("4. Open browser console (F12)")
    print("5. Check localStorage: localStorage.getItem('access_token')")
    print("6. Click logout button")
    print("7. Check where you end up and what's in localStorage")
    print("8. Expected: Should go to connected.html (title: 'Unimate - Kiosk')")
    print("9. Expected: localStorage should be cleared")

if __name__ == "__main__":
    print("🔍 LOGOUT FUNCTIONALITY DEBUG TEST")
    print("=" * 70)
    
    # Test 1: Check the dashboard code
    print("TEST 1: Checking dashboard logout code...")
    code_test_passed = test_dashboard_logout_code()
    
    # Test 2: Try automated browser test (might fail if selenium not available)
    print("\nTEST 2: Automated browser test...")
    try:
        browser_test_passed = test_logout_redirect()
    except Exception as e:
        print(f"❌ Automated test failed (selenium might not be available): {e}")
        browser_test_passed = False
    
    # Test 3: Manual test instructions
    test_manual_logout()
    
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY:")
    print(f"   Code Analysis: {'✅ PASS' if code_test_passed else '❌ FAIL'}")
    print(f"   Browser Test: {'✅ PASS' if browser_test_passed else '❌ FAIL'}")
    print("   Manual Test: 👤 USER ACTION REQUIRED")
    
    if not code_test_passed or not browser_test_passed:
        print("\n🔧 RECOMMENDED ACTIONS:")
        print("1. Check dashboard.html for any remaining index.html references")
        print("2. Verify logout button redirects to ../components/connected.html")
        print("3. Test manually in browser with console open")
    else:
        print("\n✅ All automated tests passed!")
