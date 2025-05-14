#!/usr/bin/env python
"""
Quick WebSocket Test Client
--------------------------
This is a simple script to test a WebSocket connection.
"""
import websocket
import json

def main():
    try:
        print("Connecting to WebSocket server...")
        ws = websocket.create_connection("ws://localhost:8765")
        
        print("Connected! Sending test message...")
        ws.send(json.dumps({
            "type": "test",
            "message": "Hello, server!"
        }))
        
        print("Waiting for response...")
        result = ws.recv()
        print(f"Received: {result}")
        
        ws.close()
        print("Connection closed successfully")
        return True
    except Exception as e:
        print(f"Error occurred: {e}")
        return False

if __name__ == "__main__":
    main() 