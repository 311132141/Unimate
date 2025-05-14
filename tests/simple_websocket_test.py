#!/usr/bin/env python
"""
UNIMATE WebSocket Test Script
----------------------------
This script tests if the WebSocket endpoints are functioning properly.
"""
import websocket
import json
import time
import sys
import threading

# Configure endpoints
WEBSOCKET_URL = "ws://localhost:8000/ws/unimate/"
KIOSK_WEBSOCKET_URL = "ws://localhost:8000/ws/kiosk/test-kiosk-123/"

def test_websocket_connection(url, timeout=5):
    """Test a WebSocket connection"""
    print(f"Testing WebSocket connection to {url}...")
    
    result = {
        "connected": False,
        "received_connect_message": False,
        "received_test_response": False,
        "details": []
    }
    
    try:
        # Define a message handler
        def on_message(ws, message):
            print(f"Received message: {message}")
            result["details"].append(message)
            
            # Check message type
            try:
                msg_data = json.loads(message)
                if msg_data.get("type") == "connection_established":
                    result["received_connect_message"] = True
                elif msg_data.get("type") == "test_response":
                    result["received_test_response"] = True
                    ws.close()
            except:
                pass
        
        # Define an open handler
        def on_open(ws):
            print(f"Connection opened to {url}")
            result["connected"] = True
            
            # Send a test message
            message = {
                'type': 'test',
                'message': 'Hello from test script!',
                'timestamp': time.time()
            }
            ws.send(json.dumps(message))
            print(f"Sent test message: {message}")
        
        # Connect to the WebSocket
        ws = websocket.WebSocketApp(
            url,
            on_message=on_message,
            on_open=on_open
        )
        
        # Create a thread to run the WebSocket connection
        websocket_thread = threading.Thread(target=ws.run_forever)
        websocket_thread.daemon = True
        websocket_thread.start()
        
        # Wait for timeout or success
        start_time = time.time()
        while time.time() - start_time < timeout:
            if result["received_test_response"]:
                # Full success, no need to wait further
                break
            time.sleep(0.1)
        
        # Force close connection if still open
        if websocket_thread.is_alive():
            ws.close()
            websocket_thread.join(1)
        
        # Determine test success
        success = result["connected"] and result["received_connect_message"]
        complete_success = success and result["received_test_response"]
        
        return complete_success, result["details"]
        
    except Exception as e:
        print(f"Error connecting to {url}: {e}")
        return False, [str(e)]

def main():
    print("=" * 60)
    print("UNIMATE WEBSOCKET TEST")
    print("=" * 60)
    
    # Test main WebSocket
    main_success, main_details = test_websocket_connection(WEBSOCKET_URL)
    
    # Test kiosk WebSocket
    kiosk_success, kiosk_details = test_websocket_connection(KIOSK_WEBSOCKET_URL)
    
    # Print results
    print("\n" + "=" * 60)
    print("TEST RESULTS")
    print("=" * 60)
    
    print(f"Main WebSocket: {'[PASSED]' if main_success else '[FAILED]'}")
    for detail in main_details:
        print(f"  Details: {detail}")
        
    print(f"Kiosk WebSocket: {'[PASSED]' if kiosk_success else '[FAILED]'}")
    for detail in kiosk_details:
        print(f"  Details: {detail}")
    
    # Return exit code
    if main_success and kiosk_success:
        print("\n[SUCCESS] ALL WEBSOCKET TESTS PASSED!")
        return 0
    else:
        print("\n[ERROR] SOME WEBSOCKET TESTS FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 