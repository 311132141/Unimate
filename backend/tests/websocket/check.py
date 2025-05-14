#!/usr/bin/env python
"""
WebSocket Connection Test
-------------------------
Simple standalone script to check WebSocket connections to a Django Channels server.
"""
import sys
import json
import time
import websocket
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

def on_message(ws, message):
    logger.info(f"Message received: {message}")

def on_error(ws, error):
    logger.error(f"Error: {error}")
    if hasattr(error, "__dict__"):
        for key, value in error.__dict__.items():
            logger.error(f"Error detail - {key}: {value}")

def on_close(ws, close_status_code, close_msg):
    logger.info(f"Connection closed. Code: {close_status_code}, Message: {close_msg}")

def on_open(ws):
    logger.info("Connection established!")
    # Send a test message
    ws.send(json.dumps({
        "type": "kiosk_status",
        "status": "online"
    }))
    logger.info("Test message sent")

def main():
    ws_url = "ws://localhost:8000/ws/kiosk/test-kiosk/"
    if len(sys.argv) > 1:
        ws_url = sys.argv[1]
    
    logger.info(f"Connecting to: {ws_url}")
    
    # Enable trace for debugging
    websocket.enableTrace(True)
    
    # Create WebSocket connection
    ws = websocket.WebSocketApp(
        ws_url,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    
    # Connect with 10 second timeout
    ws.run_forever(ping_interval=5, ping_timeout=3)
    
if __name__ == "__main__":
    main() 