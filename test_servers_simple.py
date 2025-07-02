import requests
import sys

def test_backend():
    """Test what the backend root URL returns"""
    print("=== TESTING BACKEND ROOT URL ===")
    
    try:
        response = requests.get('http://localhost:8000/', timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'unknown')}")
        
        content = response.text
        print(f"Content length: {len(content)} characters")
        
        # Check first 300 characters
        preview = content[:300]
        print("Content preview:")
        print(preview)
        print("...")
        
        # Check if it contains index.html
        if 'index.html' in content.lower():
            print("\n🚨 BACKEND ROOT CONTAINS INDEX.HTML!")
            
            # Find the lines with index.html
            lines = content.split('\n')
            for i, line in enumerate(lines, 1):
                if 'index.html' in line.lower():
                    print(f"  Line {i}: {line.strip()}")
        else:
            print("\n✅ Backend root does not contain index.html")
            
        # Check if it contains connected.html content
        if 'connected.html' in content.lower() or 'scan your rfid' in content.lower():
            print("✅ Backend root serves connected.html content")
        else:
            print("❓ Backend root content unclear")
            
    except Exception as e:
        print(f"❌ Backend test failed: {e}")

def test_frontend():
    """Test what the frontend root URL returns"""
    print("\n=== TESTING FRONTEND ROOT URL ===")
    
    try:
        response = requests.get('http://localhost:8080/', timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'unknown')}")
        
        content = response.text
        print(f"Content length: {len(content)} characters")
        
        # Check first 300 characters
        preview = content[:300]
        print("Content preview:")
        print(preview)
        print("...")
        
        # Check if it contains index.html
        if 'index.html' in content.lower():
            print("\n🚨 FRONTEND ROOT CONTAINS INDEX.HTML!")
        else:
            print("\n✅ Frontend root does not contain index.html")
            
    except Exception as e:
        print(f"❌ Frontend test failed: {e}")

def test_logout_behavior():
    """Test what happens when we simulate a logout"""
    print("\n=== TESTING LOGOUT BEHAVIOR ===")
    
    # Test the connected.html page directly
    try:
        response = requests.get('http://localhost:8080/components/connected.html', timeout=5)
        print(f"Connected.html status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Connected.html is accessible")
        else:
            print("❌ Connected.html not accessible")
            
    except Exception as e:
        print(f"❌ Connected.html test failed: {e}")

if __name__ == "__main__":
    test_backend()
    test_frontend()
    test_logout_behavior()
    
    print("\n" + "="*50)
    print("ANALYSIS COMPLETE")
    print("If backend serves connected.html and frontend doesn't")
    print("contain index.html references, the issue might be:")
    print("1. Browser cache")
    print("2. Service worker")
    print("3. Frontend server routing")
    print("4. Hard refresh needed (Ctrl+F5)")
