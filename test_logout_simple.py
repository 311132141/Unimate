#!/usr/bin/env python3
"""
Simple test to debug logout functionality without selenium
"""

import os

def test_dashboard_logout_code():
    """Test the logout code in dashboard.html directly"""
    
    print("🧪 Testing Dashboard Logout Code")
    print("=" * 60)
    
    try:
        # Read the dashboard.html file
        dashboard_path = "d:/Users/johni/Documents/Unimate/frontend/views/dashboard.html"
        with open(dashboard_path, 'r', encoding='utf-8') as f:
            dashboard_content = f.read()
        
        print("📄 Analyzing dashboard.html content...")
        
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
                
                # Look for any window.location.href in logout context
                lines = dashboard_content.split('\n')
                in_logout_context = False
                for i, line in enumerate(lines):
                    if "logout-button" in line or in_logout_context:
                        in_logout_context = True
                        if "window.location.href" in line:
                            print(f"   Found redirect at line {i+1}: {line.strip()}")
                            in_logout_context = False
                        if "});" in line and in_logout_context:
                            in_logout_context = False
                
        if "index.html" in dashboard_content:
            print("❌ PROBLEM: Found index.html references in dashboard.html")
            index_count = dashboard_content.count("index.html")
            print(f"   Found {index_count} references to index.html")
            
            # Find the lines containing index.html
            lines = dashboard_content.split('\n')
            for i, line in enumerate(lines):
                if "index.html" in line:
                    print(f"   Line {i+1}: {line.strip()}")
                    
            return False  # This is the problem!
        else:
            print("✅ No index.html references found in dashboard.html")
            
        return True
        
    except Exception as e:
        print(f"❌ Error reading dashboard.html: {e}")
        return False

def test_all_html_files():
    """Check all HTML files for index.html references"""
    
    print("\n🧪 Checking All HTML Files for index.html References")
    print("=" * 60)
    
    html_files = [
        "d:/Users/johni/Documents/Unimate/frontend/views/dashboard.html",
        "d:/Users/johni/Documents/Unimate/frontend/components/connected.html"
    ]
    
    for file_path in html_files:
        if os.path.exists(file_path):
            print(f"\n📄 Checking {os.path.basename(file_path)}...")
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if "index.html" in content:
                print(f"   ❌ Found index.html references!")
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if "index.html" in line:
                        print(f"     Line {i+1}: {line.strip()}")
            else:
                print(f"   ✅ No index.html references")
        else:
            print(f"   ❌ File not found: {file_path}")

def test_url_patterns():
    """Check backend URL patterns"""
    
    print("\n🧪 Checking Backend URL Patterns")
    print("=" * 60)
    
    try:
        urls_path = "d:/Users/johni/Documents/Unimate/backend/app/urls.py"
        with open(urls_path, 'r', encoding='utf-8') as f:
            urls_content = f.read()
        
        print("📄 Analyzing backend URLs...")
        
        if "index.html" in urls_content:
            print("❌ Found index.html references in backend URLs")
            lines = urls_content.split('\n')
            for i, line in enumerate(lines):
                if "index.html" in line:
                    print(f"   Line {i+1}: {line.strip()}")
        else:
            print("✅ No index.html references in backend URLs")
            
        if "connected.html" in urls_content:
            print("✅ Found connected.html references in backend URLs")
            connected_count = urls_content.count("connected.html")
            print(f"   Found {connected_count} references to connected.html")
        else:
            print("❌ No connected.html references in backend URLs")
            
    except Exception as e:
        print(f"❌ Error reading urls.py: {e}")

if __name__ == "__main__":
    print("🔍 LOGOUT FUNCTIONALITY DEBUG TEST")
    print("=" * 70)
    
    # Test 1: Check dashboard code
    dashboard_test = test_dashboard_logout_code()
    
    # Test 2: Check all HTML files
    test_all_html_files()
    
    # Test 3: Check backend URLs
    test_url_patterns()
    
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY:")
    print(f"   Dashboard Analysis: {'✅ PASS' if dashboard_test else '❌ FAIL'}")
    
    print("\n🔧 NEXT STEPS:")
    print("1. If index.html found anywhere, remove those references")
    print("2. Ensure all redirects point to connected.html")
    print("3. Test manually in browser with F12 console open")
    print("4. Check browser network tab to see actual redirect URLs")
