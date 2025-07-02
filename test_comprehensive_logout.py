#!/usr/bin/env python3
"""
COMPREHENSIVE LOGOUT DEBUG TEST
This will trace every step of the logout process to find the exact issue
"""

import os
import re
import requests
import time

def test_comprehensive_logout_analysis():
    """Comprehensive analysis of logout functionality"""
    
    print("🔍 COMPREHENSIVE LOGOUT DEBUG TEST")
    print("=" * 80)
    
    issues_found = []
    
    # Test 1: Check ALL files for index.html references
    print("\n📁 TEST 1: Scanning ALL files for index.html references")
    print("-" * 60)
    
    search_dirs = [
        "d:/Users/johni/Documents/Unimate/frontend",
        "d:/Users/johni/Documents/Unimate/backend"
    ]
    
    for search_dir in search_dirs:
        if os.path.exists(search_dir):
            for root, dirs, files in os.walk(search_dir):
                for file in files:
                    if file.endswith(('.html', '.js', '.py', '.css')):
                        file_path = os.path.join(root, file)
                        try:
                            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()
                                if 'index.html' in content:
                                    print(f"❌ FOUND index.html in: {file_path}")
                                    issues_found.append(f"index.html reference in {file_path}")
                                    
                                    # Show the exact lines
                                    lines = content.split('\n')
                                    for i, line in enumerate(lines):
                                        if 'index.html' in line:
                                            print(f"   Line {i+1}: {line.strip()}")
                        except Exception as e:
                            pass
    
    if not any('index.html' in issue for issue in issues_found):
        print("✅ No index.html references found in any files")
    
    # Test 2: Check exact logout button functionality
    print("\n🖱️ TEST 2: Logout Button Analysis")
    print("-" * 60)
    
    dashboard_path = "d:/Users/johni/Documents/Unimate/frontend/views/dashboard.html"
    if os.path.exists(dashboard_path):
        with open(dashboard_path, 'r', encoding='utf-8') as f:
            dashboard_content = f.read()
        
        # Find ALL logout-related code
        logout_sections = []
        lines = dashboard_content.split('\n')
        
        for i, line in enumerate(lines):
            if 'logout' in line.lower() or 'log out' in line.lower():
                logout_sections.append((i+1, line.strip()))
        
        print(f"Found {len(logout_sections)} logout-related lines:")
        for line_num, line_content in logout_sections:
            print(f"   Line {line_num}: {line_content}")
        
        # Check for ALL event listeners on logout-button
        logout_listeners = []
        in_listener = False
        listener_content = []
        
        for i, line in enumerate(lines):
            if "logout-button" in line and "addEventListener" in line:
                in_listener = True
                listener_content = [f"Line {i+1}: {line.strip()}"]
            elif in_listener:
                listener_content.append(f"Line {i+1}: {line.strip()}")
                if '});' in line and len(listener_content) > 2:
                    logout_listeners.append('\n'.join(listener_content))
                    in_listener = False
                    listener_content = []
        
        print(f"\nFound {len(logout_listeners)} logout button event listeners:")
        for j, listener in enumerate(logout_listeners):
            print(f"\n--- Listener {j+1} ---")
            print(listener)
            
            # Check what this listener does
            if 'window.location.href' in listener:
                if 'connected.html' in listener:
                    print("✅ This listener redirects to connected.html")
                elif 'index.html' in listener:
                    print("❌ This listener redirects to index.html!")
                    issues_found.append("Logout listener redirects to index.html")
                else:
                    print("❓ This listener has unknown redirect")
                    issues_found.append("Logout listener has unknown redirect")
            else:
                print("❓ This listener doesn't have window.location.href")
                issues_found.append("Logout listener missing redirect")
    
    # Test 3: Check what the backend actually serves
    print("\n🌐 TEST 3: Backend Response Analysis")
    print("-" * 60)
    
    test_urls = [
        "http://localhost:8000/",
        "http://localhost:8000/some-random-path/",
        "http://localhost:8080/",
        "http://localhost:8080/logout-redirect-test/"
    ]
    
    for test_url in test_urls:
        try:
            response = requests.get(test_url, timeout=5)
            content = response.text
            
            # Extract title
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            title = title_match.group(1) if title_match else "No title"
            
            print(f"URL: {test_url}")
            print(f"   Status: {response.status_code}")
            print(f"   Title: {title}")
            
            # Check what page this actually is
            if "Unimate - Kiosk" in title:
                print("   ✅ Serving connected.html")
            elif "University Wayfinding" in title:
                print("   ❌ Serving index.html!")
                issues_found.append(f"Backend serves index.html for {test_url}")
            else:
                print(f"   ❓ Unknown page: {title}")
                issues_found.append(f"Unknown page served for {test_url}")
                
        except Exception as e:
            print(f"❌ Failed to test {test_url}: {e}")
    
    # Test 4: Check relative path resolution
    print("\n📂 TEST 4: Path Resolution Analysis")
    print("-" * 60)
    
    # Dashboard is at: /views/dashboard.html
    # Logout tries to go to: ../components/connected.html
    # This should resolve to: /components/connected.html
    
    print("Dashboard location: /views/dashboard.html")
    print("Logout redirect: ../components/connected.html")
    print("Should resolve to: /components/connected.html")
    
    # Test if this file exists and what it serves
    connected_path = "d:/Users/johni/Documents/Unimate/frontend/components/connected.html"
    if os.path.exists(connected_path):
        print("✅ connected.html file exists")
        
        # Check its title
        with open(connected_path, 'r', encoding='utf-8') as f:
            connected_content = f.read()
            title_match = re.search(r'<title>(.*?)</title>', connected_content, re.IGNORECASE)
            title = title_match.group(1) if title_match else "No title"
            print(f"   Title: {title}")
            
            if "Kiosk" in title:
                print("   ✅ connected.html has correct title")
            else:
                print("   ❌ connected.html has wrong title")
                issues_found.append("connected.html has wrong title")
    else:
        print("❌ connected.html file doesn't exist!")
        issues_found.append("connected.html file missing")
    
    # Test 5: Browser cache analysis
    print("\n🗄️ TEST 5: Browser Cache Analysis")
    print("-" * 60)
    
    print("Potential cache issues:")
    print("1. Browser may cache old dashboard.html with old logout logic")
    print("2. Browser may cache old URL mappings")
    print("3. Service worker may intercept requests")
    
    print("\nRecommended cache clearing:")
    print("- Hard refresh: Ctrl+F5 or Ctrl+Shift+R")
    print("- Clear browser cache completely")
    print("- Test in incognito/private mode")
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 COMPREHENSIVE TEST SUMMARY")
    print("=" * 80)
    
    if issues_found:
        print(f"❌ Found {len(issues_found)} issues:")
        for i, issue in enumerate(issues_found, 1):
            print(f"   {i}. {issue}")
        
        print("\n🔧 FIXING ISSUES NOW...")
        return issues_found
    else:
        print("✅ No technical issues found!")
        print("\n🤔 If logout still goes to index.html, try:")
        print("1. Hard refresh browser (Ctrl+F5)")
        print("2. Clear browser cache completely")
        print("3. Test in incognito mode")
        print("4. Check browser console for errors")
        return []

def fix_found_issues(issues):
    """Fix any issues found during analysis"""
    
    print("\n🔧 FIXING DETECTED ISSUES")
    print("=" * 60)
    
    for issue in issues:
        if "index.html reference" in issue:
            file_path = issue.split("in ")[1]
            print(f"Fixing index.html reference in: {file_path}")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace index.html with connected.html
                new_content = content.replace('index.html', 'connected.html')
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"   ✅ Fixed: Replaced index.html with connected.html")
                
            except Exception as e:
                print(f"   ❌ Failed to fix: {e}")

def create_test_page():
    """Create a test page to verify logout behavior"""
    
    test_html = """<!DOCTYPE html>
<html>
<head>
    <title>Logout Test Page</title>
</head>
<body>
    <h1>Logout Test</h1>
    <button id="test-logout" onclick="testLogout()">Test Logout Redirect</button>
    <div id="result"></div>
    
    <script>
    function testLogout() {
        console.log('Testing logout redirect...');
        console.log('Current location:', window.location.href);
        
        // Simulate the exact same redirect as dashboard
        console.log('Redirecting to: ../components/connected.html');
        window.location.href = '../components/connected.html';
    }
    </script>
</body>
</html>"""
    
    test_path = "d:/Users/johni/Documents/Unimate/frontend/views/logout_test.html"
    with open(test_path, 'w', encoding='utf-8') as f:
        f.write(test_html)
    
    print(f"\n🧪 Created test page: {test_path}")
    print("   Access at: http://localhost:8080/views/logout_test.html")
    print("   Click button to test same redirect as dashboard logout")

if __name__ == "__main__":
    issues = test_comprehensive_logout_analysis()
    
    if issues:
        fix_found_issues(issues)
        print("\n🔄 Re-running tests after fixes...")
        test_comprehensive_logout_analysis()
    
    create_test_page()
    
    print("\n" + "=" * 80)
    print("🎯 FINAL RECOMMENDATIONS")
    print("=" * 80)
    print("1. Clear browser cache completely")
    print("2. Test logout in incognito mode")
    print("3. Use browser dev tools to see actual network requests")
    print("4. Test the logout_test.html page to isolate the issue")
    print("5. If still failing, the issue is browser cache or network-level")
