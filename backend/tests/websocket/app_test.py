#!/usr/bin/env python
"""
Unimate WebSocket Test Client
----------------------------
Test connectivity to the main Unimate WebSocket endpoint.
"""
import websocket
import json
import time
import threading

def on_message(ws, message):
    print(f"Message received: {message}")

def on_error(ws, error):
    print(f"Error occurred: {error}")

def on_close(ws, close_status_code, close_msg):
    print(f"Connection closed: {close_status_code}, {close_msg}")

def on_open(ws):
    print("Connection opened")
    # Send a test message
    ws.send(json.dumps({"type": "test", "message": "Hello, Unimate!"}))
    print("Test message sent")

def test_main_ws():
    # Try the main WebSocket endpoint
    url = "ws://localhost:8000/ws/unimate/"
    print(f"Testing connection to main endpoint: {url}")
    test_ws(url)

def test_kiosk_ws():
    # Try the kiosk WebSocket endpoint
    url = "ws://localhost:8000/ws/kiosk/test-kiosk/"
    print(f"Testing connection to kiosk endpoint: {url}")
    test_ws(url)

def test_standalone():
    # Try the standalone WebSocket server
    url = "ws://localhost:8765"
    print(f"Testing connection to standalone server: {url}")
    test_ws(url)

def test_ws(url):
    try:
        websocket.enableTrace(True)
        ws = websocket.WebSocketApp(
            url,
            on_open=on_open,
            on_message=on_message,
            on_error=on_error,
            on_close=on_close
        )
        
        # Run the WebSocket connection in a thread
        wst = threading.Thread(target=ws.run_forever)
        wst.daemon = True
        wst.start()
        
        # Wait for a few seconds to see messages
        time.sleep(5)
        
        # Close the connection
        ws.close()
        print(f"Test completed for {url}")
    except Exception as e:
        print(f"Error in test_ws: {e}")

if __name__ == "__main__":
    try:
        print("Testing all WebSocket endpoints...")
        test_standalone()
        time.sleep(1)
        test_main_ws()
        time.sleep(1)
        test_kiosk_ws()
    except Exception as e:
        print(f"Error: {e}") 