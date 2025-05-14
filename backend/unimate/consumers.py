import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class UnimateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("UnimateConsumer: connect() called")
        await self.channel_layer.group_add("unimate", self.channel_name)
        await self.accept()
        logger.info("UnimateConsumer: Connection accepted")

    async def disconnect(self, close_code):
        logger.info(f"UnimateConsumer: disconnect() called with close_code: {close_code}")
        await self.channel_layer.group_discard("unimate", self.channel_name)

    async def receive(self, text_data):
        logger.info(f"UnimateConsumer: received data: {text_data[:100]}")
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        
        if message_type == 'user.login':
            await self.channel_layer.group_send(
                "unimate",
                {
                    'type': 'user.login',
                    'message': text_data_json.get('message')
                }
            )
        elif message_type == 'test':
            # Echo back test messages
            logger.info("UnimateConsumer: Received test message, echoing back")
            await self.send(text_data=json.dumps({
                'type': 'test_response',
                'message': 'Server received: ' + text_data_json.get('message', 'No message'),
                'timestamp': text_data_json.get('timestamp')
            }))

    async def user_login(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user.login',
            'message': event['message']
        }))

class KioskConsumer(AsyncWebsocketConsumer):
    """Dedicated consumer for kiosk connections used in the test script"""
    
    async def connect(self):
        print("KioskConsumer: connect() called - DEBUG PRINT")  # Console debug print
        logger.info("KioskConsumer: connect() called")
        
        self.kiosk_id = self.scope['url_route']['kwargs']['kiosk_id']
        logger.info(f"KioskConsumer: Connecting kiosk with ID: {self.kiosk_id}")
        self.group_name = f"kiosk_{self.kiosk_id}"
        
        # Debug the scope to see what's coming in
        print(f"KioskConsumer: WebSocket scope: {self.scope}")
        logger.info(f"KioskConsumer: WebSocket scope headers: {self.scope.get('headers', [])}")
        
        # Join kiosk-specific group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        # Also join the general unimate group to receive broadcasts
        await self.channel_layer.group_add(
            "unimate",
            self.channel_name
        )
        
        # Accept the connection before sending any messages
        logger.info("KioskConsumer: About to accept connection")
        await self.accept()
        logger.info("KioskConsumer: Connection accepted")
        
        # Send a welcome message back to confirm connection
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f"Connected to kiosk {self.kiosk_id}"
        }))
        logger.info("KioskConsumer: Welcome message sent")
    
    async def disconnect(self, close_code):
        logger.info(f"KioskConsumer: disconnect called with code: {close_code}")
        # Leave both groups
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        await self.channel_layer.group_discard(
            "unimate",
            self.channel_name
        )
    
    async def receive(self, text_data):
        logger.info(f"KioskConsumer: received data: {text_data[:100]}")
        # Parse and route incoming messages
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'kiosk_status':
                # Forward status updates to the kiosk group
                logger.info(f"KioskConsumer: forwarding kiosk status: {data.get('status')}")
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        'type': 'kiosk.status',
                        'status': data.get('status')
                    }
                )
        except json.JSONDecodeError:
            logger.error(f"KioskConsumer: JSON decode error for message: {text_data[:100]}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def user_login(self, event):
        # Handle user login events (from general unimate broadcasts)
        logger.info("KioskConsumer: Handling user login event")
        await self.send(text_data=json.dumps({
            'type': 'user.login',
            'message': event['message']
        }))
    
    async def kiosk_status(self, event):
        # Handle kiosk status updates
        logger.info(f"KioskConsumer: Handling kiosk status update: {event.get('status')}")
        await self.send(text_data=json.dumps({
            'type': 'kiosk.status',
            'status': event['status']
        })) 