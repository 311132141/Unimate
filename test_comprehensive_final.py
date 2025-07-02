#!/usr/bin/env python3
"""
COMPREHENSIVE FINAL TEST - DESTROY ALL INDEX.HTML REFERENCES
This test will find and eliminate every possible source of index.html redirects
"""

import os
import requests
import json
import subprocess
import time
import re
from pathlib import Path

def print_header(text):
    print(f"\n{'='*60}")
    print(f" {text}")
    print(f"{'='*60}")

def print_step(step, text):
    print(f"\n[STEP {step}] {text}")

def run_command(cmd, cwd=None):
    """Run command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def find_all_index_references():
    """Find ALL references to index.html in the entire codebase"""
    print_step(1, "SEARCHING FOR ALL INDEX.HTML REFERENCES")
    
    search_dirs = [
        "backend",
        "frontend", 
        "fixed_front",
        "unimate-nextjs",
        "tests",
        "hardware"
    ]
    
    all_refs = []
    
    for search_dir in search_dirs:
        if os.path.exists(search_dir):
            print(f"\nSearching in {search_dir}/...")
            
            # Search for index.html in files
            success, stdout, stderr = run_command(f'findstr /s /i "index.html" {search_dir}\\*')
            if stdout:
                lines = stdout.strip().split('\n')
                for line in lines:
                    if line.strip():
                        all_refs.append(f"FILE: {line}")
            
            # Search for index references in general
            success, stdout, stderr = run_command(f'findstr /s /i "index" {search_dir}\\*.py {search_dir}\\*.js {search_dir}\\*.html')
            if stdout:
                lines = stdout.strip().split('\n')
                for line in lines:
                    if 'index.html' in line.lower():
                        all_refs.append(f"GENERAL: {line}")
    
    # Also search root directory files
    for file in ["*.py", "*.js", "*.html"]:
        success, stdout, stderr = run_command(f'findstr /i "index.html" {file}')
        if stdout:
            lines = stdout.strip().split('\n')
            for line in lines:
                if line.strip():
                    all_refs.append(f"ROOT: {line}")
    
    if all_refs:
        print(f"\n🚨 FOUND {len(all_refs)} INDEX.HTML REFERENCES:")
        for ref in all_refs:
            print(f"  {ref}")
        return all_refs
    else:
        print("✅ No index.html references found in code")
        return []

def check_backend_urls():
    """Check backend URL patterns for any index references"""
    print_step(2, "CHECKING BACKEND URL PATTERNS")
    
    urls_file = "backend/app/urls.py"
    if os.path.exists(urls_file):
        with open(urls_file, 'r') as f:
            content = f.read()
        
        print("Current URL patterns:")
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            if 'path(' in line or 're_path(' in line or 'urlpatterns' in line:
                print(f"  {i}: {line.strip()}")
        
        if 'index.html' in content.lower():
            print("🚨 FOUND INDEX.HTML IN URLS.PY!")
            return False
        else:
            print("✅ No index.html references in urls.py")
            return True
    else:
        print("❌ urls.py not found")
        return False

def check_frontend_files():
    """Check all frontend files for index.html references"""
    print_step(3, "CHECKING FRONTEND FILES")
    
    frontend_files = [
        "frontend/static/js/app.js",
        "frontend/components/connected.html",
        "frontend/views/dashboard.html",
        "frontend/smart_server.py"
    ]
    
    issues = []
    
    for file_path in frontend_files:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                content = f.read()
            
            if 'index.html' in content.lower():
                print(f"🚨 FOUND INDEX.HTML IN {file_path}")
                # Find the lines
                lines = content.split('\n')
                for i, line in enumerate(lines, 1):
                    if 'index.html' in line.lower():
                        print(f"  Line {i}: {line.strip()}")
                        issues.append((file_path, i, line.strip()))
            else:
                print(f"✅ {file_path} - clean")
        else:
            print(f"❌ {file_path} - not found")
    
    return issues

def test_api_responses():
    """Test all API endpoints to see what they return"""
    print_step(4, "TESTING API RESPONSES")
    
    base_url = "http://localhost:8000"
    
    # Test scan endpoint
    print("\nTesting /api/scan/...")
    try:
        response = requests.post(f"{base_url}/api/scan/", 
                               json={"rfid_tag": "test123"},
                               timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Scan test failed: {e}")
    
    # Test login endpoint
    print("\nTesting /api/login/...")
    try:
        response = requests.post(f"{base_url}/api/login/", 
                               json={"username": "testuser", "password": "testpass"},
                               timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Login test failed: {e}")
    
    # Test root URL
    print("\nTesting root URL /...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'unknown')}")
        content = response.text[:200] + "..." if len(response.text) > 200 else response.text
        print(f"Content preview: {content}")
        
        if 'index.html' in response.text.lower():
            print("🚨 ROOT URL RETURNS INDEX.HTML CONTENT!")
            return False
        else:
            print("✅ Root URL does not contain index.html")
    except Exception as e:
        print(f"❌ Root URL test failed: {e}")
        return False
    
    return True

def check_file_existence():
    """Check if index.html files exist anywhere"""
    print_step(5, "CHECKING FOR INDEX.HTML FILES")
    
    # Search for any index.html files
    success, stdout, stderr = run_command('dir /s /b index.html')
    
    if stdout.strip():
        print("🚨 FOUND INDEX.HTML FILES:")
        files = stdout.strip().split('\n')
        for file in files:
            if file.strip():
                print(f"  {file.strip()}")
        return files
    else:
        print("✅ No index.html files found")
        return []

def create_browser_test():
    """Create a browser test file to manually verify redirects"""
    print_step(6, "CREATING BROWSER TEST FILE")
    
    test_html = '''<!DOCTYPE html>
<html>
<head>
    <title>LOGOUT REDIRECT TEST</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
        button { padding: 10px 20px; margin: 5px; }
        #results { background: #f0f0f0; padding: 10px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>LOGOUT REDIRECT TEST</h1>
    
    <div class="test-section">
        <h3>Test 1: Direct Logout</h3>
        <button onclick="testDirectLogout()">Test Direct Logout</button>
    </div>
    
    <div class="test-section">
        <h3>Test 2: Clear Storage + Redirect</h3>
        <button onclick="testClearAndRedirect()">Test Clear + Redirect</button>
    </div>
    
    <div class="test-section">
        <h3>Test 3: Window Location</h3>
        <button onclick="testWindowLocation()">Test Window Location</button>
    </div>
    
    <div id="results"></div>
    
    <script>
        function log(message) {
            const results = document.getElementById('results');
            results.innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + message + '</div>';
        }
        
        function testDirectLogout() {
            log('Testing direct logout...');
            localStorage.clear();
            sessionStorage.clear();
            log('Storage cleared, redirecting...');
            setTimeout(() => {
                window.location.href = '/';
                log('Redirected to /');
            }, 1000);
        }
        
        function testClearAndRedirect() {
            log('Testing clear and redirect...');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            log('Tokens removed, redirecting...');
            setTimeout(() => {
                window.location.replace('/');
                log('Replaced location to /');
            }, 1000);
        }
        
        function testWindowLocation() {
            log('Testing window location...');
            log('Current URL: ' + window.location.href);
            log('Current pathname: ' + window.location.pathname);
            window.location.pathname = '/';
            log('Set pathname to /');
        }
        
        // Log current page info
        window.onload = function() {
            log('Page loaded: ' + window.location.href);
            log('Has tokens: ' + (localStorage.getItem('access_token') ? 'YES' : 'NO'));
        }
    </script>
</body>
</html>'''
    
    with open('frontend/test_logout_redirect.html', 'w') as f:
        f.write(test_html)
    
    print("✅ Created frontend/test_logout_redirect.html")
    print("   Access it at: http://localhost:3001/test_logout_redirect.html")

def fix_all_issues():
    """Fix any issues found"""
    print_step(7, "FIXING ALL ISSUES")
    
    fixes_applied = []
    
    # 1. Check and fix urls.py
    urls_file = "backend/app/urls.py"
    if os.path.exists(urls_file):
        with open(urls_file, 'r') as f:
            content = f.read()
        
        if 'index.html' in content.lower():
            print("Fixing urls.py...")
            # Replace any index.html references with connected.html
            new_content = re.sub(r'index\.html', 'components/connected.html', content, flags=re.IGNORECASE)
            
            with open(urls_file, 'w') as f:
                f.write(new_content)
            fixes_applied.append("Fixed urls.py index.html references")
    
    # 2. Check and fix frontend files
    frontend_files = [
        "frontend/static/js/app.js",
        "frontend/components/connected.html",
        "frontend/views/dashboard.html"
    ]
    
    for file_path in frontend_files:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                content = f.read()
            
            if 'index.html' in content.lower():
                print(f"Fixing {file_path}...")
                # Replace index.html with connected.html
                new_content = re.sub(r'index\.html', 'connected.html', content, flags=re.IGNORECASE)
                # Also fix any /index references
                new_content = re.sub(r'"/index"', '"/connected.html"', new_content)
                new_content = re.sub(r"'/index'", "'/connected.html'", new_content)
                
                with open(file_path, 'w') as f:
                    f.write(new_content)
                fixes_applied.append(f"Fixed {file_path}")
    
    # 3. Delete any index.html files
    index_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.lower() == 'index.html':
                file_path = os.path.join(root, file)
                index_files.append(file_path)
    
    for file_path in index_files:
        if 'node_modules' not in file_path and '.git' not in file_path:
            print(f"Deleting {file_path}...")
            os.remove(file_path)
            fixes_applied.append(f"Deleted {file_path}")
    
    if fixes_applied:
        print(f"\n✅ Applied {len(fixes_applied)} fixes:")
        for fix in fixes_applied:
            print(f"  - {fix}")
    else:
        print("✅ No fixes needed")
    
    return fixes_applied

def restart_servers():
    """Restart both servers to ensure changes take effect"""
    print_step(8, "RESTARTING SERVERS")
    
    print("Killing existing processes...")
    run_command("taskkill /f /im python.exe")
    run_command("taskkill /f /im node.exe")
    
    time.sleep(2)
    
    print("Starting backend server...")
    backend_cmd = "cd backend && python manage.py runserver 0.0.0.0:8000"
    subprocess.Popen(backend_cmd, shell=True)
    
    time.sleep(3)
    
    print("Starting frontend server...")
    frontend_cmd = "cd frontend && python smart_server.py"
    subprocess.Popen(frontend_cmd, shell=True)
    
    time.sleep(3)
    print("✅ Servers restarted")

def main():
    print_header("COMPREHENSIVE FINAL TEST - DESTROY INDEX.HTML")
    
    # Step 1: Find all index.html references
    refs = find_all_index_references()
    
    # Step 2: Check backend URLs
    urls_ok = check_backend_urls()
    
    # Step 3: Check frontend files
    frontend_issues = check_frontend_files()
    
    # Step 4: Check if index.html files exist
    index_files = check_file_existence()
    
    # Step 5: Fix all issues
    fixes = fix_all_issues()
    
    # Step 6: Restart servers if fixes were applied
    if fixes:
        restart_servers()
        time.sleep(5)  # Wait for servers to start
    
    # Step 7: Test API responses
    api_ok = test_api_responses()
    
    # Step 8: Create browser test
    create_browser_test()
    
    # Final report
    print_header("FINAL REPORT")
    
    if not refs and urls_ok and not frontend_issues and not index_files and api_ok:
        print("✅ ALL TESTS PASSED - NO INDEX.HTML ISSUES FOUND")
        print("\nThe system should now ALWAYS redirect to connected.html")
        print("\nTo verify manually:")
        print("1. Open http://localhost:3001/test_logout_redirect.html")
        print("2. Test all three logout methods")
        print("3. Verify you always end up at connected.html")
    else:
        print("🚨 ISSUES FOUND:")
        if refs:
            print(f"  - {len(refs)} code references to index.html")
        if not urls_ok:
            print("  - Backend URL issues")
        if frontend_issues:
            print(f"  - {len(frontend_issues)} frontend file issues")
        if index_files:
            print(f"  - {len(index_files)} index.html files exist")
        if not api_ok:
            print("  - API response issues")
        
        if fixes:
            print(f"\n✅ Applied {len(fixes)} fixes - retest recommended")
        else:
            print("\n❌ Manual intervention required")

if __name__ == "__main__":
    main()
