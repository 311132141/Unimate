#!/usr/bin/env python
"""
UNIMATE Core Functionality Verification Script
---------------------------------------------
This script tests just the core functionality of the UNIMATE application:
1. WebSocket connectivity
2. RFID scan API

No frontend components are tested.
"""
import requests
import websocket
import json
import time
import threading
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('core_verifier')

# Test configuration
CONFIG = {
    'backend_host': 'localhost',
    'backend_port': 8000,
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
        'valid_rfid': {'status': None, 'details': None},
        'invalid_rfid': {'status': None, 'details': None},
    }
}

# WebSocket Test Functions
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
        'message': 'Hello from verification test!',
        'timestamp': time.time()
    }
    
    test_ws_endpoint('main', url, test_message)

def test_kiosk_ws():
    """Test the kiosk WebSocket endpoint"""
    kiosk_id = f"test-kiosk-{int(time.time())}"
    url = f"ws://{CONFIG['backend_host']}:{CONFIG['backend_port']}/ws/kiosk/{kiosk_id}/"
    
    test_message = {
        'type': 'test',
        'message': 'Hello from verification test!',
        'timestamp': time.time()
    }
    
    test_ws_endpoint('kiosk', url, test_message)

# API Test Functions
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

def check_servers_running():
    """Check if the backend server is running"""
    try:
        requests.get(
            f"http://{CONFIG['backend_host']}:{CONFIG['backend_port']}/", 
            timeout=CONFIG['request_timeout']
        )
        logger.info("Backend server is running.")
        return True
    except requests.RequestException as e:
        logger.error(f"Backend server is not running: {e}")
        print("[ERROR] Backend server is not running.")
        print(f"Please start the server with 'python run.py --asgi' and try again.")
        return False

def run_websocket_tests():
    """Run all WebSocket tests"""
    logger.info("Running WebSocket tests...")
    test_main_ws()
    test_kiosk_ws()

def run_api_tests():
    """Run all API tests"""
    logger.info("Running API tests...")
    test_valid_rfid()
    test_invalid_rfid()

def print_results():
    """Print test results"""
    print("\n" + "=" * 60)
    print("UNIMATE CORE FUNCTIONALITY VERIFICATION RESULTS")
    print("=" * 60)
    
    all_passed = True
    
    # WebSocket tests
    print("\n[WEBSOCKET] WEBSOCKET TESTS:")
    for endpoint, result in results['websocket'].items():
        status = "[PASSED]" if result['status'] else "[FAILED]"
        if not result['status']:
            all_passed = False
        print(f"  {endpoint.upper()}: {status}")
        if result['details']:
            print(f"    Details: {result['details']}")
    
    # API tests
    print("\n[API] API TESTS:")
    for endpoint, result in results['api'].items():
        status = "[PASSED]" if result['status'] else "[FAILED]"
        if not result['status']:
            all_passed = False
        print(f"  {endpoint.upper()}: {status}")
        if result['details']:
            print(f"    Details: {result['details']}")
    
    # Overall result
    print("\n" + "=" * 60)
    if all_passed:
        print("[SUCCESS] ALL CORE FUNCTIONALITY TESTS PASSED!")
        print("The WebSocket and API components of UNIMATE are working correctly.")
        return 0
    else:
        print("[ERROR] SOME TESTS FAILED. Please check the results above for details.")
        return 1

def main():
    """Main entry point"""
    print("=" * 60)
    print("UNIMATE CORE FUNCTIONALITY VERIFICATION")
    print("=" * 60)
    print(f"Testing backend at: http://{CONFIG['backend_host']}:{CONFIG['backend_port']}")
    print("=" * 60)
    
    # Check if servers are running
    if not check_servers_running():
        return 1
    
    # Run tests
    run_websocket_tests()
    run_api_tests()
    
    # Print results and return appropriate exit code
    return print_results()

if __name__ == "__main__":
    sys.exit(main()) 