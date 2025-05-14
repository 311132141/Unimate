#!/usr/bin/env python
"""
Simple WebSocket Test Script
--------------------------
A minimalist test script to verify WebSocket connectivity.
"""

import asyncio
import websockets
import json
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('websocket_test')

async def test_websocket(url):
    """Test a WebSocket connection."""
    logger.info(f"Connecting to {url}")
    
    try:
        # Connect to the WebSocket server
        async with websockets.connect(url) as websocket:
            logger.info(f"✅ Connected to {url}")
            
            # Wait for the initial connection message
            logger.info("Waiting for connection message...")
            initial_msg = await websocket.recv()
            
            logger.info(f"Received initial message: {initial_msg}")
            try:
                initial_data = json.loads(initial_msg)
                if initial_data.get('type') == 'connection_established':
                    logger.info("✅ Got connection established message")
                else:
                    logger.info(f"⚠️ Unexpected initial message type: {initial_data.get('type')}")
            except json.JSONDecodeError:
                logger.error(f"❌ Received invalid JSON in initial message: {initial_msg}")
            
            # Send a test message
            message = {
                "type": "test",
                "message": "Hello from test client!",
                "timestamp": asyncio.get_event_loop().time()
            }
            
            logger.info(f"Sending test message: {message}")
            await websocket.send(json.dumps(message))
            
            # Wait for a response
            logger.info("Waiting for test response...")
            response = await websocket.recv()
            
            logger.info(f"Received response: {response}")
            
            try:
                data = json.loads(response)
                if data.get('type') == 'test_response':
                    logger.info("✅ Test successful! Received test response.")
                    return True
                else:
                    logger.info(f"⚠️ Received unexpected response type: {data.get('type')}")
            except json.JSONDecodeError:
                logger.error(f"❌ Received invalid JSON: {response}")
            
            return False
            
    except Exception as e:
        logger.error(f"❌ Connection failed: {e}")
        return False

async def main():
    """Main entry point."""
    # Test URLs
    main_url = "ws://localhost:8000/ws/unimate/"
    kiosk_url = "ws://localhost:8000/ws/kiosk/test-kiosk-1/"
    
    logger.info("==== Simple WebSocket Test ====")
    
    # Test main WebSocket endpoint
    logger.info("\nTesting main WebSocket endpoint...")
    main_test = await test_websocket(main_url)
    
    # Test kiosk WebSocket endpoint
    logger.info("\nTesting kiosk WebSocket endpoint...")
    kiosk_test = await test_websocket(kiosk_url)
    
    # Print results
    logger.info("\n==== Test Results ====")
    logger.info(f"Main WebSocket: {'✅ PASSED' if main_test else '❌ FAILED'}")
    logger.info(f"Kiosk WebSocket: {'✅ PASSED' if kiosk_test else '❌ FAILED'}")
    
    # Exit with appropriate code
    if main_test and kiosk_test:
        logger.info("\n✅ All tests passed!")
        sys.exit(0)
    else:
        logger.info("\n❌ Some tests failed.")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 