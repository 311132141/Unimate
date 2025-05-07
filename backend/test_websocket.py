#!/usr/bin/env python
"""
Simplified WebSocket Test
------------------------
This is a standalone script to test WebSocket connections.
"""
import websocket
import json
import time
import sys

# Define callback functions
def on_message(ws, message):
    print(f"Message received: {message}")

def on_error(ws, error):
    print(f"Error occurred: {error}")

def on_close(ws, close_status_code, close_msg):
    print(f"Connection closed: {close_status_code}, {close_msg}")

def on_open(ws):
    print("Connection opened")
    # Send a test message
    ws.send(json.dumps({"type": "test", "message": "Hello, server!"}))

# Main function
def main():
    # Set the WebSocket URL
    ws_url = "ws://localhost:8000/ws/kiosk/kiosk-1/"
    
    print(f"Connecting to {ws_url}")
    
    # Enable trace for debugging
    websocket.enableTrace(True)
    
    # Create a WebSocket connection
    ws = websocket.WebSocketApp(
        ws_url,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    
    # Run the WebSocket connection
    ws.run_forever()

if __name__ == "__main__":
    main() 