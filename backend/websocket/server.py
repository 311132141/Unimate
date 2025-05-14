#!/usr/bin/env python
"""
UNIMATE WebSocket Server
-----------------------
A production-ready WebSocket server for the Unimate application.
This can be run standalone or alongside the Django server.
"""
import asyncio
import websockets
import json
import logging
import argparse
import signal
import os
import sys

# Configure logging with better formatting
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.StreamHandler(stream=sys.stdout)
    ]
)
logger = logging.getLogger('websocket_server')

# Store connected clients
connected_clients = {}  # map client_id -> websocket
kiosk_clients = {}  # map kiosk_id -> set of websockets

# Server status
server_running = True

async def handle_connection(websocket, path):
    """Handle a WebSocket connection"""
    client_id = id(websocket)
    kiosk_id = "unknown"
    
    # Extract kiosk ID from path if available
    # Path format: /ws/kiosk/{kiosk_id}/
    try:
        parts = path.strip('/').split('/')
        if len(parts) >= 3 and parts[0] == 'ws' and parts[1] == 'kiosk':
            kiosk_id = parts[2]
    except:
        pass
    
    logger.info(f"New client {client_id} connected from kiosk '{kiosk_id}' on path '{path}'")
    
    # Register the client
    connected_clients[client_id] = websocket
    
    # Register with kiosk group if applicable
    if kiosk_id != "unknown":
        if kiosk_id not in kiosk_clients:
            kiosk_clients[kiosk_id] = set()
        kiosk_clients[kiosk_id].add(websocket)
        logger.info(f"Client {client_id} registered with kiosk {kiosk_id}")
    
    try:
        # Send a welcome message
        await websocket.send(json.dumps({
            "type": "connection_established",
            "message": f"Connected to Unimate WebSocket Server (Kiosk: {kiosk_id})"
        }))
        
        # Handle messages in a loop
        async for message in websocket:
            logger.info(f"Received from client {client_id}: {message[:100]}")
            
            try:
                data = json.loads(message)
                msg_type = data.get('type', '')
                
                # Handle different message types
                if msg_type == 'kiosk_status':
                    # Process kiosk status update
                    await handle_kiosk_status(websocket, client_id, kiosk_id, data)
                    
                elif msg_type == 'user_auth':
                    # Process user authentication event
                    await handle_user_auth(websocket, client_id, kiosk_id, data)
                    
                elif msg_type == 'ping':
                    # Simple ping response
                    await websocket.send(json.dumps({
                        "type": "pong",
                        "timestamp": data.get('timestamp')
                    }))
                    
                else:
                    # Echo back unknown message types
                    await websocket.send(json.dumps({
                        "type": "echo",
                        "message": f"Received unknown message type: {msg_type}",
                        "original": data
                    }))
            
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON from client {client_id}: {message[:50]}")
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
    
    except websockets.exceptions.ConnectionClosed as e:
        logger.info(f"Connection closed for client {client_id}: code={e.code}, reason='{e.reason}'")
    
    except Exception as e:
        logger.error(f"Error handling client {client_id}: {str(e)}", exc_info=True)
    
    finally:
        # Unregister client
        if client_id in connected_clients:
            del connected_clients[client_id]
        
        # Unregister from kiosk group
        if kiosk_id in kiosk_clients and websocket in kiosk_clients[kiosk_id]:
            kiosk_clients[kiosk_id].remove(websocket)
            if len(kiosk_clients[kiosk_id]) == 0:
                del kiosk_clients[kiosk_id]
        
        logger.info(f"Client {client_id} disconnected")

async def handle_kiosk_status(websocket, client_id, kiosk_id, data):
    """Process a kiosk status update"""
    status = data.get('status', '')
    logger.info(f"Kiosk {kiosk_id} status updated to '{status}'")
    
    # Acknowledge the status update
    await websocket.send(json.dumps({
        "type": "kiosk.status.ack",
        "kiosk_id": kiosk_id,
        "status": status,
        "received": True
    }))
    
    # Broadcast to admin clients (to be implemented)
    message = {
        "type": "kiosk.status.update",
        "kiosk_id": kiosk_id,
        "status": status,
        "timestamp": str(asyncio.get_event_loop().time())
    }
    await broadcast_to_admins(message)

async def handle_user_auth(websocket, client_id, kiosk_id, data):
    """Process a user authentication event"""
    user = data.get('user', {})
    username = user.get('username', 'unknown')
    
    logger.info(f"User {username} authenticated at kiosk {kiosk_id}")
    
    # Echo back acknowledgment
    await websocket.send(json.dumps({
        "type": "user.auth.ack",
        "user": username,
        "kiosk_id": kiosk_id,
        "received": True
    }))

async def broadcast_to_kiosk(kiosk_id, message):
    """Broadcast a message to all clients of a specific kiosk"""
    if kiosk_id not in kiosk_clients or not kiosk_clients[kiosk_id]:
        return
    
    clients = kiosk_clients[kiosk_id].copy()
    logger.info(f"Broadcasting to {len(clients)} clients of kiosk {kiosk_id}")
    
    for client in clients:
        try:
            await client.send(json.dumps(message))
        except websockets.exceptions.ConnectionClosed:
            # The connection cleanup will happen in the handler
            pass

async def broadcast_to_admins(message):
    """Broadcast a message to admin clients"""
    # For now, just log the message
    logger.info(f"Would broadcast to admins: {message}")

async def heartbeat():
    """Send periodic heartbeat messages to all clients"""
    while server_running:
        await asyncio.sleep(30)  # Every 30 seconds
        
        client_count = len(connected_clients)
        if client_count > 0:
            logger.info(f"Sending heartbeat to {client_count} clients")
            
            # Create heartbeat message
            message = {
                "type": "heartbeat",
                "timestamp": str(asyncio.get_event_loop().time()),
                "clients": client_count,
                "kiosks": len(kiosk_clients)
            }
            
            # Send to all clients
            for client_id, websocket in list(connected_clients.items()):
                try:
                    await websocket.send(json.dumps(message))
                except websockets.exceptions.ConnectionClosed:
                    # The connection cleanup will happen in the handler
                    pass

def signal_handler():
    """Handle termination signals"""
    global server_running
    logger.info("Received termination signal. Shutting down...")
    server_running = False

async def main(host, port):
    """Main entry point"""
    global server_running
    
    logger.info(f"Starting UNIMATE WebSocket server on {host}:{port}")
    
    # Create stop condition
    stop = asyncio.Future()
    
    # Register signal handlers
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            loop.add_signal_handler(sig, lambda: stop.set_result(None))
        except NotImplementedError:
            # Windows doesn't support SIGTERM handling
            pass
    
    # Start the heartbeat task
    heartbeat_task = asyncio.create_task(heartbeat())
    
    # Start the WebSocket server
    async with websockets.serve(handle_connection, host, port):
        logger.info(f"WebSocket server running on ws://{host}:{port}")
        
        try:
            # Run until stopped
            await stop
        finally:
            # Cleanup
            server_running = False
            heartbeat_task.cancel()
            try:
                await heartbeat_task
            except asyncio.CancelledError:
                pass
            
            logger.info("WebSocket server shutdown complete")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='UNIMATE WebSocket Server')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', type=int, default=8765, help='Port to bind to')
    parser.add_argument('--loglevel', default='INFO', 
                       choices=['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
                       help='Logging level')
    
    args = parser.parse_args()
    
    # Set log level
    logging.getLogger('websocket_server').setLevel(getattr(logging, args.loglevel))
    
    try:
        asyncio.run(main(args.host, args.port))
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
        sys.exit(0) 