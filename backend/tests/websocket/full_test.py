#!/usr/bin/env python
"""
Comprehensive WebSocket Testing Script
-------------------------------------
This script tests all WebSocket endpoints in the Unimate application.
"""
import websocket
import json
import time
import threading
import logging
import argparse
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('websocket_tester')

# Globals to track connection status
connection_results = {
    'standalone': False,
    'main': False,
    'kiosk': False
}

# Test result details
test_details = {
    'standalone': {'error': None, 'response': None},
    'main': {'error': None, 'response': None},
    'kiosk': {'error': None, 'response': None}
}

def on_message(ws, message, endpoint):
    """Handle incoming WebSocket messages"""
    logger.info(f"[{endpoint}] Received message: {message}")
    test_details[endpoint]['response'] = message

def on_error(ws, error, endpoint):
    """Handle WebSocket errors"""
    logger.error(f"[{endpoint}] Error: {error}")
    test_details[endpoint]['error'] = str(error)

def on_close(ws, close_status_code, close_msg, endpoint):
    """Handle WebSocket connection closing"""
    logger.info(f"[{endpoint}] Connection closed: {close_status_code}, {close_msg}")

def on_open(ws, endpoint, test_message):
    """Handle WebSocket connection opening"""
    logger.info(f"[{endpoint}] Connection opened")
    connection_results[endpoint] = True
    
    # Send test message after connection is established
    logger.info(f"[{endpoint}] Sending test message")
    ws.send(json.dumps(test_message))
    logger.info(f"[{endpoint}] Test message sent")

def test_standalone_server():
    """Test connection to standalone WebSocket server"""
    url = "ws://localhost:8765"
    logger.info(f"Testing standalone WebSocket server at {url}")
    
    test_message = {
        'type': 'test',
        'message': 'Hello from Python test!',
        'timestamp': time.time()
    }
    
    run_test('standalone', url, test_message)

def test_main_endpoint():
    """Test connection to main WebSocket endpoint"""
    url = "ws://localhost:8000/ws/unimate/"
    logger.info(f"Testing main WebSocket endpoint at {url}")
    
    test_message = {
        'type': 'test',
        'message': 'Hello from Python test!',
        'timestamp': time.time()
    }
    
    run_test('main', url, test_message)

def test_kiosk_endpoint():
    """Test connection to kiosk WebSocket endpoint"""
    kiosk_id = f"test-kiosk-{int(time.time())}"
    url = f"ws://localhost:8000/ws/kiosk/{kiosk_id}/"
    logger.info(f"Testing kiosk WebSocket endpoint at {url}")
    
    test_message = {
        'type': 'kiosk_status',
        'status': 'active',
        'timestamp': time.time()
    }
    
    run_test('kiosk', url, test_message)

def run_test(endpoint, url, test_message):
    """Run a WebSocket test for a given endpoint"""
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
        timeout = 5  # seconds
        start_time = time.time()
        while time.time() - start_time < timeout:
            if test_details[endpoint]['response'] is not None:
                # We got a response, test is successful
                logger.info(f"[{endpoint}] Test completed successfully")
                break
            if test_details[endpoint]['error'] is not None:
                # We got an error, test failed
                logger.error(f"[{endpoint}] Test failed with error")
                break
            time.sleep(0.1)
        
        # Close connection
        ws.close()
        
        # Wait for thread to join
        time.sleep(1)
    
    except Exception as e:
        logger.error(f"[{endpoint}] Unexpected error: {e}")
        test_details[endpoint]['error'] = str(e)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="WebSocket Test Script")
    parser.add_argument("--standalone", action="store_true", help="Test standalone server only")
    parser.add_argument("--main", action="store_true", help="Test main endpoint only")
    parser.add_argument("--kiosk", action="store_true", help="Test kiosk endpoint only")
    args = parser.parse_args()
    
    # If no specific tests are requested, run all tests
    run_all = not (args.standalone or args.main or args.kiosk)
    
    # Run requested tests
    if args.standalone or run_all:
        test_standalone_server()
    
    if args.main or run_all:
        test_main_endpoint()
    
    if args.kiosk or run_all:
        test_kiosk_endpoint()
    
    # Print summary
    logger.info("\n=== Test Results ===")
    
    all_passed = True
    
    for endpoint, result in connection_results.items():
        if result and test_details[endpoint]['response'] is not None:
            logger.info(f"✅ {endpoint.upper()}: Connection successful, response received")
        elif result:
            logger.info(f"⚠️ {endpoint.upper()}: Connection successful, but no response received")
            all_passed = False
        else:
            logger.error(f"❌ {endpoint.upper()}: Connection failed")
            if test_details[endpoint]['error']:
                logger.error(f"   Error: {test_details[endpoint]['error']}")
            all_passed = False
    
    if all_passed:
        logger.info("\n✅ All tests passed! WebSocket functionality is working correctly.")
        return 0
    else:
        logger.error("\n❌ Some tests failed. Please check the logs for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 