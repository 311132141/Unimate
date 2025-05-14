#!/usr/bin/env python
"""
Comprehensive WebSocket Test Script
----------------------------------
Tests all WebSocket functionality in the UNIMATE application.

This script:
1. Connects to main WebSocket endpoint
2. Connects to kiosk-specific WebSocket endpoint
3. Sends and receives test messages
4. Tests RFID card scanning integration

Usage:
    python websocket_test.py [--url WS_URL]

Options:
    --url WS_URL    Base WebSocket URL (default: ws://localhost:8000)
"""

import argparse
import asyncio
import json
import logging
import sys
import time
import websockets
import requests
from threading import Thread

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('websocket_tester')

class WebSocketTester:
    def __init__(self, base_url="ws://localhost:8000", api_base="http://localhost:8000"):
        self.base_url = base_url
        self.api_base = api_base
        self.kiosk_id = f"test-kiosk-{int(time.time())}"
        self.main_ws = None
        self.kiosk_ws = None
        self.test_results = {
            "main_connect": False,
            "kiosk_connect": False,
            "main_message": False,
            "kiosk_message": False,
            "rfid_notification": False
        }
        self.events = []

    async def connect_main(self):
        """Connect to the main WebSocket endpoint."""
        url = f"{self.base_url}/ws/unimate/"
        logger.info(f"Connecting to main WebSocket at {url}")
        
        try:
            self.main_ws = await websockets.connect(url)
            logger.info("✅ Connected to main WebSocket")
            self.test_results["main_connect"] = True
            
            # Set up a task to receive messages
            asyncio.create_task(self.receive_messages(self.main_ws, "main"))
            return True
        except Exception as e:
            logger.error(f"❌ Failed to connect to main WebSocket: {e}")
            return False

    async def connect_kiosk(self):
        """Connect to the kiosk-specific WebSocket endpoint."""
        url = f"{self.base_url}/ws/kiosk/{self.kiosk_id}/"
        logger.info(f"Connecting to kiosk WebSocket at {url}")
        
        try:
            self.kiosk_ws = await websockets.connect(url)
            logger.info(f"✅ Connected to kiosk WebSocket (ID: {self.kiosk_id})")
            self.test_results["kiosk_connect"] = True
            
            # Set up a task to receive messages
            asyncio.create_task(self.receive_messages(self.kiosk_ws, "kiosk"))
            return True
        except Exception as e:
            logger.error(f"❌ Failed to connect to kiosk WebSocket: {e}")
            return False

    async def send_test_message(self, endpoint="main"):
        """Send a test message to a WebSocket endpoint."""
        ws = self.main_ws if endpoint == "main" else self.kiosk_ws
        
        if ws is None or ws.open == False:
            logger.error(f"❌ Cannot send message: {endpoint} WebSocket is not connected")
            return False
        
        message = {
            "type": "test",
            "message": f"Test message from {endpoint} endpoint",
            "timestamp": time.time()
        }
        
        try:
            await ws.send(json.dumps(message))
            logger.info(f"✅ Sent test message to {endpoint} endpoint")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to send test message to {endpoint} endpoint: {e}")
            return False

    async def receive_messages(self, ws, endpoint):
        """Receive and process messages from a WebSocket."""
        try:
            async for message in ws:
                logger.info(f"📥 Received message from {endpoint}: {message}")
                
                try:
                    data = json.loads(message)
                    message_type = data.get("type")
                    
                    # Handle different message types
                    if message_type == "test_response":
                        logger.info(f"✅ Test message response received on {endpoint}")
                        self.test_results[f"{endpoint}_message"] = True
                    
                    elif message_type == "user.login":
                        logger.info("✅ User login notification received")
                        self.test_results["rfid_notification"] = True
                    
                    elif message_type == "connection_established":
                        logger.info(f"✅ Connection confirmed for {endpoint}")
                    
                    # Add the received message to our events list
                    self.events.append({
                        "endpoint": endpoint,
                        "type": message_type,
                        "data": data,
                        "timestamp": time.time()
                    })
                    
                except json.JSONDecodeError:
                    logger.warning(f"Received non-JSON message: {message}")
        
        except websockets.exceptions.ConnectionClosed:
            logger.warning(f"⚠️ {endpoint} WebSocket connection closed")
        except Exception as e:
            logger.error(f"❌ Error in receive_messages({endpoint}): {e}")

    async def test_rfid_scan(self):
        """Test RFID card scanning API and WebSocket integration."""
        # Make sure we're connected to at least one WebSocket
        if not self.main_ws and not self.kiosk_ws:
            logger.error("❌ Cannot test RFID scan: no WebSocket connections")
            return False
        
        logger.info("Testing RFID card scanning...")
        
        # Use Alice's card UID
        payload = {
            "rfid_uid": "04A1B2C3D4",
            "kiosk": self.kiosk_id
        }
        
        try:
            response = requests.post(f"{self.api_base}/api/scan/", json=payload)
            
            if response.status_code == 200:
                logger.info("✅ RFID scan API request succeeded")
                
                # Wait a bit for the WebSocket notification
                logger.info("Waiting for WebSocket notification...")
                await asyncio.sleep(2)
                
                if self.test_results["rfid_notification"]:
                    logger.info("✅ WebSocket notification for RFID scan received")
                    return True
                else:
                    logger.error("❌ No WebSocket notification received for RFID scan")
            else:
                logger.error(f"❌ RFID scan API request failed: {response.status_code}")
                logger.error(f"Response: {response.text}")
        
        except Exception as e:
            logger.error(f"❌ Error during RFID scan test: {e}")
        
        return False

    async def run_all_tests(self):
        """Run all WebSocket tests."""
        logger.info("=" * 50)
        logger.info("UNIMATE WebSocket Tester")
        logger.info("=" * 50)
        
        # Test connection to main endpoint
        main_connected = await self.connect_main()
        if main_connected:
            await asyncio.sleep(1)
            await self.send_test_message("main")
        
        # Test connection to kiosk endpoint
        kiosk_connected = await self.connect_kiosk()
        if kiosk_connected:
            await asyncio.sleep(1)
            await self.send_test_message("kiosk")
        
        # Test RFID card scanning if at least one WebSocket is connected
        if main_connected or kiosk_connected:
            await asyncio.sleep(1)
            await self.test_rfid_scan()
        
        # Wait a bit for responses to come in
        logger.info("Waiting for responses...")
        await asyncio.sleep(3)
        
        # Print test results
        self.print_results()
        
        # Close connections
        if self.main_ws:
            await self.main_ws.close()
        if self.kiosk_ws:
            await self.kiosk_ws.close()
        
        # Return overall success
        return all(self.test_results.values())

    def print_results(self):
        """Print test results in a formatted way."""
        logger.info("\n" + "=" * 50)
        logger.info("WebSocket Test Results")
        logger.info("=" * 50)
        
        for test, result in self.test_results.items():
            status = "✅ PASSED" if result else "❌ FAILED"
            logger.info(f"{test.ljust(20)}: {status}")
        
        if all(self.test_results.values()):
            logger.info("\n✅ All WebSocket tests passed!")
        else:
            logger.info("\n⚠️ Some WebSocket tests failed")
            
        # Print all events
        if self.events:
            logger.info("\nEvent Timeline:")
            for i, event in enumerate(self.events, 1):
                logger.info(f"{i}. [{event['endpoint']}] Type: {event['type']}")

async def main():
    parser = argparse.ArgumentParser(description="Test WebSocket functionality in UNIMATE")
    parser.add_argument("--url", default="ws://localhost:8000", help="Base WebSocket URL")
    parser.add_argument("--api", default="http://localhost:8000", help="Base API URL")
    args = parser.parse_args()
    
    tester = WebSocketTester(args.url, args.api)
    success = await tester.run_all_tests()
    
    # Exit with status code based on test results
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    asyncio.run(main()) 