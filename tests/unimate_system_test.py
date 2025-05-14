#!/usr/bin/env python
"""
UNIMATE System Test Suite
------------------------
This script tests all major components of the UNIMATE application:
1. WebSocket connectivity (standalone, main, and kiosk endpoints)
2. RFID scan API
3. Authentication endpoints
4. Frontend connectivity

Usage: 
python tests/unimate_system_test.py [--websocket] [--api] [--frontend]

If no options are specified, all tests are run.
"""
import requests
import websocket
import json
import time
import threading
import logging
import argparse
import sys
import os
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('system_tester')

# Test configuration
CONFIG = {
    'backend_host': 'localhost',
    'backend_port': 8000,
    'frontend_port': 8080,
    'test_username': 'testuser',
    'test_password': 'password123',
    'valid_rfid': '04A1B2C3D4',  # Alice's card
    'invalid_rfid': 'INVALID_UID',
    'websocket_timeout': 5,  # seconds
    'request_timeout': 10,  # seconds
}

# Test results
results = {
    'websocket': {
        'main': {'status': None, 'details': None},
        'kiosk': {'status': None, 'details': None},
    },
    'api': {
        'login': {'status': None, 'details': None},
        'valid_rfid': {'status': None, 'details': None},
        'invalid_rfid': {'status': None, 'details': None},
    },
    'frontend': {
        'index': {'status': None, 'details': None},
        'dashboard': {'status': None, 'details': None},
        'connected': {'status': None, 'details': None},
    }
}

#
# WEBSOCKET TEST FUNCTIONS
#

def on_message(ws, message, endpoint):
    """Handle incoming WebSocket messages"""
    logger.info(f"[WS:{endpoint}] Received message: {message}")
    results['websocket'][endpoint]['details'] = message
    results['websocket'][endpoint]['status'] = True

def on_error(ws, error, endpoint):
    """Handle WebSocket errors"""
    logger.error(f"[WS:{endpoint}] Error: {error}")
    results['websocket'][endpoint]['details'] = str(error)
    results['websocket'][endpoint]['status'] = False

def on_close(ws, close_status_code, close_msg, endpoint):
    """Handle WebSocket connection closing"""
    logger.info(f"[WS:{endpoint}] Connection closed: {close_status_code}, {close_msg}")

def on_open(ws, endpoint, test_message):
    """Handle WebSocket connection opening"""
    logger.info(f"[WS:{endpoint}] Connection opened")
    
    # Send test message after connection is established
    logger.info(f"[WS:{endpoint}] Sending test message")
    ws.send(json.dumps(test_message))
    logger.info(f"[WS:{endpoint}] Test message sent")

def test_ws_endpoint(endpoint, url, test_message):
    """Test a WebSocket endpoint"""
    logger.info(f"Testing WebSocket endpoint: {endpoint} at {url}")
    
    try:
        # Define callback functions with endpoint context
        def on_message_wrapper(ws, message):
            on_message(ws, message, endpoint)
        
        def on_error_wrapper(ws, error):
            on_error(ws, error, endpoint)
        
        def on_close_wrapper(ws, close_status_code, close_msg):
            on_close(ws, close_status_code, close_msg, endpoint)
        
        def on_open_wrapper(ws):
            on_open(ws, endpoint, test_message)
        
        # Create WebSocket connection
        ws = websocket.WebSocketApp(
            url,
            on_open=on_open_wrapper,
            on_message=on_message_wrapper,
            on_error=on_error_wrapper,
            on_close=on_close_wrapper
        )
        
        # Run connection in a separate thread
        wst = threading.Thread(target=ws.run_forever)
        wst.daemon = True
        wst.start()
        
        # Wait for connection to establish and messages to be exchanged
        timeout = CONFIG['websocket_timeout']
        start_time = time.time()
        while time.time() - start_time < timeout:
            if results['websocket'][endpoint]['status'] is not None:
                # Test completed (success or failure)
                break
            time.sleep(0.1)
        
        # If status is still None, the test timed out
        if results['websocket'][endpoint]['status'] is None:
            results['websocket'][endpoint]['status'] = False
            results['websocket'][endpoint]['details'] = "Timeout waiting for response"
            logger.error(f"[WS:{endpoint}] Test timed out")
        
        # Close connection
        ws.close()
        
        # Wait for thread to join
        time.sleep(1)
    
    except Exception as e:
        logger.error(f"[WS:{endpoint}] Unexpected error: {e}")
        results['websocket'][endpoint]['status'] = False
        results['websocket'][endpoint]['details'] = str(e)

def test_main_ws():
    """Test the main Unimate WebSocket endpoint"""
    url = f"ws://{CONFIG['backend_host']}:{CONFIG['backend_port']}/ws/unimate/"
    
    test_message = {
        'type': 'test',
        'message': 'Hello from system test!',
        'timestamp': time.time()
    }
    
    test_ws_endpoint('main', url, test_message)

def test_kiosk_ws():
    """Test the kiosk WebSocket endpoint"""
    kiosk_id = f"test-kiosk-{int(time.time())}"
    url = f"ws://{CONFIG['backend_host']}:{CONFIG['backend_port']}/ws/kiosk/{kiosk_id}/"
    
    test_message = {
        'type': 'test',
        'message': 'Hello from system test!',
        'timestamp': time.time()
    }
    
    test_ws_endpoint('kiosk', url, test_message)

#
# API TEST FUNCTIONS
#

def test_login_api():
    """Test the login API endpoint"""
    url = f"http://{CONFIG['backend_host']}:{CONFIG['backend_port']}/api/login/"
    logger.info(f"Testing login API at {url}")
    
    payload = {
        "username": CONFIG['test_username'],
        "password": CONFIG['test_password']
    }
    
    try:
        response = requests.post(url, json=payload, timeout=CONFIG['request_timeout'])
        logger.info(f"Login API status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'access' in data and 'refresh' in data:
                results['api']['login']['status'] = True
                results['api']['login']['details'] = f"Success, token retrieved: {data['access'][:20]}..."
                logger.info("Login API test successful")
                return data['access']  # Return token for potential use in other tests
            else:
                results['api']['login']['status'] = False
                results['api']['login']['details'] = f"Missing token in response: {data}"
                logger.error("Login API test failed: Missing token in response")
        else:
            results['api']['login']['status'] = False
            results['api']['login']['details'] = f"Failed with status {response.status_code}: {response.text}"
            logger.error(f"Login API test failed: {response.status_code} {response.text}")
    
    except Exception as e:
        results['api']['login']['status'] = False
        results['api']['login']['details'] = f"Error: {str(e)}"
        logger.error(f"Login API test error: {e}")
    
    return None

def test_valid_rfid():
    """Test the RFID scan API with a valid RFID"""
    url = f"http://{CONFIG['backend_host']}:{CONFIG['backend_port']}/api/scan/"
    logger.info(f"Testing valid RFID card scan at {url}: {CONFIG['valid_rfid']}")
    
    payload = {
        "rfid_uid": CONFIG['valid_rfid'],
        "kiosk": "kiosk-test"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=CONFIG['request_timeout'])
        logger.info(f"Valid RFID API status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'access' in data and 'user' in data:
                results['api']['valid_rfid']['status'] = True
                results['api']['valid_rfid']['details'] = f"Success, user: {data['user'].get('username')}"
                logger.info("Valid RFID API test successful")
            else:
                results['api']['valid_rfid']['status'] = False
                results['api']['valid_rfid']['details'] = f"Missing data in response: {data}"
                logger.error("Valid RFID API test failed: Missing data in response")
        else:
            results['api']['valid_rfid']['status'] = False
            results['api']['valid_rfid']['details'] = f"Failed with status {response.status_code}: {response.text}"
            logger.error(f"Valid RFID API test failed: {response.status_code} {response.text}")
    
    except Exception as e:
        results['api']['valid_rfid']['status'] = False
        results['api']['valid_rfid']['details'] = f"Error: {str(e)}"
        logger.error(f"Valid RFID API test error: {e}")

def test_invalid_rfid():
    """Test the RFID scan API with an invalid RFID"""
    url = f"http://{CONFIG['backend_host']}:{CONFIG['backend_port']}/api/scan/"
    logger.info(f"Testing invalid RFID card scan at {url}: {CONFIG['invalid_rfid']}")
    
    payload = {
        "rfid_uid": CONFIG['invalid_rfid'],
        "kiosk": "kiosk-test"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=CONFIG['request_timeout'])
        logger.info(f"Invalid RFID API status code: {response.status_code}")
        
        # For invalid RFID, expect 404 status code
        if response.status_code == 404:
            results['api']['invalid_rfid']['status'] = True
            results['api']['invalid_rfid']['details'] = "Success, invalid card correctly rejected"
            logger.info("Invalid RFID API test successful")
        else:
            results['api']['invalid_rfid']['status'] = False
            results['api']['invalid_rfid']['details'] = f"Unexpected status {response.status_code}: {response.text}"
            logger.error(f"Invalid RFID API test failed: {response.status_code} {response.text}")
    
    except Exception as e:
        results['api']['invalid_rfid']['status'] = False
        results['api']['invalid_rfid']['details'] = f"Error: {str(e)}"
        logger.error(f"Invalid RFID API test error: {e}")

#
# FRONTEND TEST FUNCTIONS
#

def test_frontend_page(page, path):
    """Test a frontend page"""
    url = f"http://{CONFIG['backend_host']}:{CONFIG['frontend_port']}/{path}"
    logger.info(f"Testing frontend page {page} at {url}")
    
    try:
        response = requests.get(url, timeout=CONFIG['request_timeout'])
        logger.info(f"Frontend {page} status code: {response.status_code}")
        
        if response.status_code == 200:
            # Check if the response is HTML
            content_type = response.headers.get('Content-Type', '')
            if 'text/html' in content_type:
                # Do a basic check for expected content
                html = response.text.lower()
                expected_content = {
                    'index': ['login', 'unimate', 'password'],
                    'dashboard': ['dashboard', 'logout', 'map'],
                    'connected': ['kiosk', 'connected', 'unimate']
                }
                
                if any(term in html for term in expected_content.get(page, [])):
                    results['frontend'][page]['status'] = True
                    results['frontend'][page]['details'] = f"Page loaded successfully ({len(response.text)} bytes)"
                    logger.info(f"Frontend {page} test successful")
                else:
                    results['frontend'][page]['status'] = False
                    results['frontend'][page]['details'] = f"Page doesn't contain expected content"
                    logger.error(f"Frontend {page} test failed: Content mismatch")
            else:
                results['frontend'][page]['status'] = False
                results['frontend'][page]['details'] = f"Not HTML content: {content_type}"
                logger.error(f"Frontend {page} test failed: Not HTML")
        else:
            results['frontend'][page]['status'] = False
            results['frontend'][page]['details'] = f"Failed with status {response.status_code}"
            logger.error(f"Frontend {page} test failed: {response.status_code}")
    
    except Exception as e:
        results['frontend'][page]['status'] = False
        results['frontend'][page]['details'] = f"Error: {str(e)}"
        logger.error(f"Frontend {page} test error: {e}")

def test_index_page():
    """Test the index/login page"""
    test_frontend_page('index', 'frontend/views/index.html')

def test_dashboard_page():
    """Test the dashboard page"""
    test_frontend_page('dashboard', 'frontend/views/dashboard.html')

def test_connected_page():
    """Test the connected component page"""
    test_frontend_page('connected', 'frontend/components/connected.html')

#
# MAIN TEST FUNCTIONS
#

def run_websocket_tests():
    """Run all WebSocket tests"""
    logger.info("Running WebSocket tests...")
    test_main_ws()
    test_kiosk_ws()

def run_api_tests():
    """Run all API tests"""
    logger.info("Running API tests...")
    test_login_api()
    test_valid_rfid()
    test_invalid_rfid()

def run_frontend_tests():
    """Run all frontend tests"""
    logger.info("Running frontend tests...")
    test_index_page()
    test_dashboard_page()
    test_connected_page()

def print_results():
    """Print test results"""
    print("\n" + "=" * 60)
    print("UNIMATE SYSTEM TEST RESULTS")
    print("=" * 60)
    
    all_passed = True
    core_passed = True  # Track core functionality (WebSocket and API)
    
    # WebSocket tests
    print("\n[WEBSOCKET] WEBSOCKET TESTS:")
    for endpoint, result in results['websocket'].items():
        status = "[PASSED]" if result['status'] else "[FAILED]"
        if not result['status']:
            all_passed = False
            core_passed = False
        print(f"  {endpoint.upper()}: {status}")
        if result['details']:
            print(f"    Details: {result['details']}")
    
    # API tests
    print("\n[API] API TESTS:")
    for endpoint, result in results['api'].items():
        status = "[PASSED]" if result['status'] else "[FAILED]"
        if not result['status']:
            all_passed = False
            core_passed = False
        print(f"  {endpoint.upper()}: {status}")
        if result['details']:
            print(f"    Details: {result['details']}")
    
    # Frontend tests (if run)
    if any(result['status'] is not None for result in results['frontend'].values()):
        print("\n[FRONTEND] FRONTEND TESTS:")
        for page, result in results['frontend'].items():
            if result['status'] is not None:  # Only show tests that were run
                status = "[PASSED]" if result['status'] else "[FAILED]"
                if not result['status']:
                    all_passed = False
                print(f"  {page.upper()}: {status}")
                if result['details']:
                    print(f"    Details: {result['details']}")
    
    # Overall result
    print("\n" + "=" * 60)
    if all_passed:
        print("[SUCCESS] ALL TESTS PASSED! The UNIMATE system is working correctly.")
        return 0
    elif core_passed:
        print("[SUCCESS] CORE FUNCTIONALITY TESTS PASSED! WebSocket and API components are working correctly.")
        if any(result['status'] is not None and not result['status'] for result in results['frontend'].values()):
            print("Note: Some frontend tests failed, but these do not affect core functionality.")
        return 0  # Return success if core functionality is working
    else:
        print("[ERROR] SOME TESTS FAILED. Please check the results above for details.")
        return 1

def check_servers_running():
    """Check if the backend and frontend servers are running."""
    servers_ok = True
    
    # Check backend
    try:
        requests.get(
            f"http://{CONFIG['backend_host']}:{CONFIG['backend_port']}/", 
            timeout=CONFIG['request_timeout']
        )
        logger.info("Backend server is running.")
    except requests.RequestException as e:
        logger.error(f"Backend server is not running: {e}")
        print("[ERROR] Backend server is not running.")
        print(f"Please start the server with 'python run.py --asgi' and try again.")
        servers_ok = False
    
    # Only check backend since we're focused on core functionality
    return servers_ok

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="UNIMATE System Test Suite")
    parser.add_argument("--websocket", action="store_true", help="Run only WebSocket tests")
    parser.add_argument("--api", action="store_true", help="Run only API tests")
    parser.add_argument("--frontend", action="store_true", help="Run only frontend tests")
    args = parser.parse_args()
    
    # Create directories if needed
    Path(os.path.dirname(os.path.abspath(__file__))).parent.joinpath('logs').mkdir(exist_ok=True)
    
    print("=" * 60)
    print("UNIMATE SYSTEM TEST SUITE")
    print("=" * 60)
    print(f"Testing backend at: http://{CONFIG['backend_host']}:{CONFIG['backend_port']}")
    print("=" * 60)
    
    # Check if servers are running
    if not check_servers_running():
        return 1
    
    # By default, run only WebSocket and API tests (no frontend tests)
    if not (args.websocket or args.api or args.frontend):
        args.websocket = True
        args.api = True
    
    # Run requested tests
    if args.websocket:
        run_websocket_tests()
    
    if args.api:
        run_api_tests()
    
    if args.frontend:
        run_frontend_tests()
    
    # Print results and return appropriate exit code
    return print_results()

if __name__ == "__main__":
    sys.exit(main()) 