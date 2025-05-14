#!/usr/bin/env python
"""
Direct WebSocket Server
----------------------
This is a standalone WebSocket server for testing, independent of Django.
"""
import asyncio
import websockets
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger('websocket_server')

# Store connected clients
connected_clients = set()

async def handle_connection(websocket, path):
    """Handle a WebSocket connection"""
    client_id = id(websocket)
    logger.info(f"New client connected: {client_id} on path {path}")
    
    # Add the client to our set
    connected_clients.add(websocket)
    
    try:
        # Send a welcome message
        await websocket.send(json.dumps({
            "type": "connection_established",
            "message": "Welcome to the Unimate WebSocket server!"
        }))
        
        # Handle messages in a loop
        async for message in websocket:
            logger.info(f"Received message from client {client_id}: {message}")
            
            # Try to parse the message as JSON
            try:
                data = json.loads(message)
                msg_type = data.get('type', '')
                
                if msg_type == 'kiosk_status':
                    # Echo the status back as a response
                    response = {
                        "type": "kiosk.status",
                        "status": data.get('status', ''),
                        "received": True
                    }
                    await websocket.send(json.dumps(response))
                    logger.info(f"Sent response to client {client_id}")
                
                elif msg_type == 'test':
                    # Send a test response
                    response = {
                        "type": "test_response",
                        "message": "Test message received successfully!"
                    }
                    await websocket.send(json.dumps(response))
                
                else:
                    # Echo back unknown message types
                    response = {
                        "type": "echo",
                        "original_message": data
                    }
                    await websocket.send(json.dumps(response))
            
            except json.JSONDecodeError:
                # Not valid JSON, just echo it back
                logger.warning(f"Received invalid JSON from client {client_id}")
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format",
                    "original": message
                }))
    
    except websockets.exceptions.ConnectionClosed as e:
        logger.info(f"Client {client_id} connection closed: {e.code}, {e.reason}")
    
    finally:
        # Remove the client from our set
        connected_clients.remove(websocket)
        logger.info(f"Client {client_id} disconnected")

async def broadcast_message(message):
    """Broadcast a message to all connected clients"""
    if not connected_clients:
        logger.info("No clients connected, message not sent")
        return
    
    logger.info(f"Broadcasting message to {len(connected_clients)} clients")
    disconnected_clients = set()
    
    # Send message to all connected clients
    for client in connected_clients:
        try:
            await client.send(json.dumps(message))
        except websockets.exceptions.ConnectionClosed:
            disconnected_clients.add(client)
    
    # Clean up any disconnected clients
    for client in disconnected_clients:
        connected_clients.remove(client)

async def heartbeat():
    """Send periodic heartbeat messages to clients"""
    while True:
        await asyncio.sleep(30)  # Every 30 seconds
        if connected_clients:
            logger.info(f"Sending heartbeat to {len(connected_clients)} clients")
            await broadcast_message({
                "type": "heartbeat",
                "timestamp": str(asyncio.get_event_loop().time())
            })

async def main():
    """Main entry point"""
    logger.info("Starting standalone WebSocket server")
    
    # Start the heartbeat task
    heartbeat_task = asyncio.create_task(heartbeat())
    
    # Start the WebSocket server
    async with websockets.serve(handle_connection, "0.0.0.0", 8765):
        logger.info("WebSocket server running on ws://0.0.0.0:8765")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main()) 