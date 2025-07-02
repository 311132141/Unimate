#!/usr/bin/env python3
"""
DIRECT FIX FOR INDEX.HTML ISSUES
This script will directly check and fix the most likely sources
"""

import os
import re
import json

def check_and_fix_urls():
    """Check and fix backend URLs"""
    print("=== CHECKING BACKEND URLS ===")
    
    urls_file = "backend/app/urls.py"
    if os.path.exists(urls_file):
        with open(urls_file, 'r') as f:
            content = f.read()
        
        print("Current urls.py content:")
        print(content)
        
        if 'index.html' in content.lower():
            print("\n🚨 FOUND INDEX.HTML IN URLS.PY - FIXING...")
            new_content = content.replace('index.html', 'components/connected.html')
            
            with open(urls_file, 'w') as f:
                f.write(new_content)
            print("✅ Fixed urls.py")
        else:
            print("✅ No index.html in urls.py")
    
def check_and_fix_frontend():
    """Check and fix frontend files"""
    print("\n=== CHECKING FRONTEND FILES ===")
    
    files_to_check = [
        "frontend/static/js/app.js",
        "frontend/components/connected.html", 
        "frontend/views/dashboard.html"
    ]
    
    for file_path in files_to_check:
        print(f"\nChecking {file_path}...")
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                content = f.read()
            
            if 'index.html' in content.lower():
                print(f"🚨 FOUND INDEX.HTML IN {file_path} - FIXING...")
                
                # Show the problematic lines
                lines = content.split('\n')
                for i, line in enumerate(lines, 1):
                    if 'index.html' in line.lower():
                        print(f"  Line {i}: {line.strip()}")
                
                # Fix the content
                new_content = re.sub(r'index\.html', 'connected.html', content, flags=re.IGNORECASE)
                new_content = re.sub(r'"/index"', '"/connected.html"', new_content)
                new_content = re.sub(r"'/index'", "'/connected.html'", new_content)
                new_content = re.sub(r'"/"', '"/connected.html"', new_content)
                new_content = re.sub(r"'/'", "'/connected.html'", new_content)
                
                with open(file_path, 'w') as f:
                    f.write(new_content)
                print(f"✅ Fixed {file_path}")
            else:
                print(f"✅ No index.html in {file_path}")
        else:
            print(f"❌ {file_path} not found")

def delete_index_files():
    """Delete any index.html files"""
    print("\n=== DELETING INDEX.HTML FILES ===")
    
    dirs_to_check = ["frontend", "backend", "fixed_front"]
    
    for dir_name in dirs_to_check:
        if os.path.exists(dir_name):
            for root, dirs, files in os.walk(dir_name):
                for file in files:
                    if file.lower() == 'index.html':
                        file_path = os.path.join(root, file)
                        print(f"🚨 FOUND INDEX.HTML: {file_path}")
                        try:
                            os.remove(file_path)
                            print(f"✅ Deleted {file_path}")
                        except Exception as e:
                            print(f"❌ Failed to delete {file_path}: {e}")

def check_specific_redirects():
    """Check for specific redirect issues in key files"""
    print("\n=== CHECKING SPECIFIC REDIRECT ISSUES ===")
    
    # Check app.js for redirect logic
    app_js = "frontend/static/js/app.js"
    if os.path.exists(app_js):
        with open(app_js, 'r') as f:
            content = f.read()
        
        print("Checking app.js for redirect logic...")
        
        # Look for window.location redirects
        redirect_patterns = [
            r'window\.location\s*=\s*["\']([^"\']*)["\']',
            r'window\.location\.href\s*=\s*["\']([^"\']*)["\']',
            r'window\.location\.replace\s*\(\s*["\']([^"\']*)["\']',
            r'location\.href\s*=\s*["\']([^"\']*)["\']'
        ]
        
        for pattern in redirect_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                url = match.group(1)
                print(f"  Found redirect to: {url}")
                if url == "/" or url == "/index" or "index.html" in url:
                    print(f"  🚨 PROBLEMATIC REDIRECT: {match.group(0)}")
    
    # Check dashboard.html for logout logic
    dashboard_html = "frontend/views/dashboard.html"
    if os.path.exists(dashboard_html):
        with open(dashboard_html, 'r') as f:
            content = f.read()
        
        print("\nChecking dashboard.html for logout logic...")
        
        # Look for logout redirects
        logout_patterns = [
            r'window\.location[^;]*',
            r'location\.href[^;]*'
        ]
        
        for pattern in logout_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                print(f"  Found logout redirect: {match.group(0)}")

def create_test_page():
    """Create a simple test page to verify redirects"""
    print("\n=== CREATING TEST PAGE ===")
    
    test_html = '''<!DOCTYPE html>
<html>
<head>
    <title>Redirect Test</title>
</head>
<body>
    <h1>Redirect Test Page</h1>
    <p>Current URL: <span id="current-url"></span></p>
    <p>Page loaded at: <span id="load-time"></span></p>
    
    <button onclick="testRedirect()">Test Logout Redirect</button>
    <button onclick="clearAndGo()">Clear Storage and Go to Root</button>
    
    <div id="log"></div>
    
    <script>
        document.getElementById('current-url').textContent = window.location.href;
        document.getElementById('load-time').textContent = new Date().toLocaleString();
        
        function log(msg) {
            document.getElementById('log').innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + msg + '</div>';
        }
        
        function testRedirect() {
            log('Testing redirect...');
            localStorage.clear();
            log('Storage cleared');
            
            // Force redirect to connected.html
            setTimeout(() => {
                window.location.href = '/components/connected.html';
                log('Redirected to /components/connected.html');
            }, 1000);
        }
        
        function clearAndGo() {
            log('Clearing storage and going to root...');
            localStorage.clear();
            sessionStorage.clear();
            
            setTimeout(() => {
                window.location.href = '/';
                log('Went to /');
            }, 1000);
        }
    </script>
</body>
</html>'''
    
    with open('frontend/redirect_test.html', 'w') as f:
        f.write(test_html)
    
    print("✅ Created frontend/redirect_test.html")
    print("   Access at: http://localhost:3001/redirect_test.html")

def main():
    print("DIRECT INDEX.HTML FIX SCRIPT")
    print("=" * 50)
    
    check_and_fix_urls()
    check_and_fix_frontend()
    delete_index_files()
    check_specific_redirects()
    create_test_page()
    
    print("\n" + "=" * 50)
    print("SUMMARY:")
    print("1. Checked and fixed backend URLs")
    print("2. Checked and fixed frontend files")
    print("3. Deleted any index.html files")
    print("4. Created test page at /redirect_test.html")
    print("\nNext steps:")
    print("1. Restart both servers")
    print("2. Test at http://localhost:3001/redirect_test.html")
    print("3. Verify logout always goes to connected.html")

if __name__ == "__main__":
    main()
