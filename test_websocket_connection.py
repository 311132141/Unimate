#!/usr/bin/env python3
"""
Simple WebSocket Connection Test
-------------------------------
Tests WebSocket connectivity to help diagnose connection issues.
"""

import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    """Test WebSocket connection to the backend server"""
    
    # Test URLs
    test_urls = [
        "ws://localhost:8000/ws/unimate/",
        "ws://localhost:8000/ws/kiosk/test-kiosk-1/",
        "ws://127.0.0.1:8000/ws/unimate/",
        "ws://127.0.0.1:8000/ws/kiosk/test-kiosk-1/"
    ]
    
    for url in test_urls:
        print(f"\n🔗 Testing connection to: {url}")
        try:
                        # Try to connect            async with websockets.connect(url) as websocket:
                print(f"✅ Successfully connected to {url}")
                
                # Send a test message
                test_message = {
                    "type": "test",
                    "message": "Hello from test script",
                    "timestamp": "2025-05-24T22:15:00Z"
                }
                
                await websocket.send(json.dumps(test_message))
                print(f"📤 Sent test message: {test_message}")
                
                # Wait for response
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=3)
                    print(f"📥 Received response: {response}")
                except asyncio.TimeoutError:
                    print("⏰ No response received within 3 seconds")
                
        except ConnectionRefusedError as e:
            print(f"❌ Connection refused: {e}")
        except OSError as e:
            print(f"❌ Network error: {e}")
        except asyncio.TimeoutError:
            print(f"❌ Connection timeout")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

def main():
    """Main entry point"""
    print("🧪 WebSocket Connection Test")
    print("=" * 50)
    
    try:
        asyncio.run(test_websocket_connection())
    except KeyboardInterrupt:
        print("\n\n⚠️ Test interrupted by user")
    except Exception as e:
        print(f"\n\n💥 Test failed with error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Test completed")

if __name__ == "__main__":
    main() 
"""
Simple WebSocket Connection Test
-------------------------------
Tests WebSocket connectivity to help diagnose connection issues.
"""

import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    """Test WebSocket connection to the backend server"""
    
    # Test URLs
    test_urls = [
        "ws://localhost:8000/ws/unimate/",
        "ws://localhost:8000/ws/kiosk/test-kiosk-1/",
        "ws://127.0.0.1:8000/ws/unimate/",
        "ws://127.0.0.1:8000/ws/kiosk/test-kiosk-1/"
    ]
    
    for url in test_urls:
        print(f"\n🔗 Testing connection to: {url}")
        try:
                        # Try to connect            async with websockets.connect(url) as websocket:
                print(f"✅ Successfully connected to {url}")
                
                # Send a test message
                test_message = {
                    "type": "test",
                    "message": "Hello from test script",
                    "timestamp": "2025-05-24T22:15:00Z"
                }
                
                await websocket.send(json.dumps(test_message))
                print(f"📤 Sent test message: {test_message}")
                
                # Wait for response
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=3)
                    print(f"📥 Received response: {response}")
                except asyncio.TimeoutError:
                    print("⏰ No response received within 3 seconds")
                
        except ConnectionRefusedError as e:
            print(f"❌ Connection refused: {e}")
        except OSError as e:
            print(f"❌ Network error: {e}")
        except asyncio.TimeoutError:
            print(f"❌ Connection timeout")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

def main():
    """Main entry point"""
    print("🧪 WebSocket Connection Test")
    print("=" * 50)
    
    try:
        asyncio.run(test_websocket_connection())
    except KeyboardInterrupt:
        print("\n\n⚠️ Test interrupted by user")
    except Exception as e:
        print(f"\n\n💥 Test failed with error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Test completed")

if __name__ == "__main__":
    main() 