#!/usr/bin/env python3
"""
Test WebSocket message sending to debug if the frontend receives WebSocket messages properly
"""

import asyncio
import websockets
import json

async def test_websocket_connection():
    """Test direct WebSocket connection and message sending"""
    
    try:
        # Connect to the backend WebSocket
        uri = "ws://localhost:8000/ws/unimate/"
        print(f"🔗 Connecting to WebSocket: {uri}")
        
        async with websockets.connect(uri) as websocket:
            print("✅ WebSocket connected!")
            
            # Listen for the connection established message
            welcome_message = await websocket.recv()
            print(f"📨 Received welcome: {welcome_message}")
            
            # Send a test message
            test_message = {
                "type": "test",
                "message": "Manual WebSocket test",
                "timestamp": "2025-07-03T00:00:00Z"
            }
            await websocket.send(json.dumps(test_message))
            print(f"📤 Sent test message: {test_message}")
            
            # Wait for response
            response = await websocket.recv()
            print(f"📨 Received response: {response}")
            
            # Now simulate what the ESP8266 API call should trigger
            # This is trickier since the API call needs to trigger the WebSocket message
            # We would need to make the API call while connected to the WebSocket
            
            print("\n🤖 Now make an ESP8266 scan or click the red button...")
            print("   This WebSocket should receive a user.login message")
            
            # Wait for any incoming messages (like user.login)
            try:
                while True:
                    message = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                    print(f"📨 Received message: {message}")
                    
                    # Parse the message
                    try:
                        data = json.loads(message)
                        if data.get('type') == 'user.login':
                            print("🎯 SUCCESS: Received user.login message!")
                            print(f"   User data: {data.get('message', {}).get('username', 'Unknown')}")
                            break
                    except json.JSONDecodeError:
                        print("   (Non-JSON message)")
                        
            except asyncio.TimeoutError:
                print("⏰ Timeout waiting for messages")
                
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing WebSocket Connection and Message Handling")
    print("=" * 60)
    asyncio.run(test_websocket_connection())
