import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class UnimateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("UnimateConsumer: connect() called")
        
        # Join the "unimate" group to receive RFID scan notifications
        await self.channel_layer.group_add("unimate", self.channel_name)
        
        # Accept the WebSocket connection
        await self.accept()
        logger.info("UnimateConsumer: Connection accepted and joined 'unimate' group")
        
        # Send a welcome message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to UNIMATE WebSocket'
        }))

    async def disconnect(self, close_code):
        logger.info(f"UnimateConsumer: disconnect() called with close_code: {close_code}")
        
        # Leave the "unimate" group
        await self.channel_layer.group_discard("unimate", self.channel_name)

    async def receive(self, text_data):
        logger.info(f"UnimateConsumer: received data: {text_data[:100]}")
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'test':
                # Echo back test messages
                logger.info("UnimateConsumer: Received test message, echoing back")
                await self.send(text_data=json.dumps({
                    'type': 'test_response',
                    'message': 'Server received: ' + text_data_json.get('message', 'No message'),
                    'timestamp': text_data_json.get('timestamp')
                }))
        except json.JSONDecodeError:
            logger.error(f"UnimateConsumer: Invalid JSON received: {text_data[:100]}")

    async def user_login(self, event):
        # Handle user login events for the main unimate group
        logger.info("UnimateConsumer: Handling user login event")
        message_data = event['message']
        
        # Send the login data with navigation instructions
        await self.send(text_data=json.dumps({
            'type': 'user.login',
            'message': message_data,
            'action': message_data.get('action', 'login'),
            'redirect': message_data.get('redirect')
        }))

class KioskConsumer(AsyncWebsocketConsumer):
    """Dedicated consumer for kiosk connections used in the test script"""
    
    async def connect(self):
        logger.info("KioskConsumer: connect() called")
        
        # Get kiosk ID from URL route
        self.kiosk_id = self.scope['url_route']['kwargs']['kiosk_id']
        logger.info(f"KioskConsumer: Connecting kiosk with ID: {self.kiosk_id}")
        
        # Accept the connection
        await self.accept()
        logger.info("KioskConsumer: Connection accepted")
        
        # Send a welcome message back to confirm connection
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f"Connected to kiosk {self.kiosk_id}"
        }))
    
    async def disconnect(self, close_code):
        logger.info(f"KioskConsumer: disconnect called with code: {close_code}")
    
    async def receive(self, text_data):
        logger.info(f"KioskConsumer: received data: {text_data[:100]}")
        # Parse incoming messages
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'test':
                # Echo back test messages
                logger.info("KioskConsumer: Received test message, echoing back")
                await self.send(text_data=json.dumps({
                    'type': 'test_response',
                    'message': 'Server received: ' + data.get('message', 'No message'),
                    'timestamp': data.get('timestamp')
                }))
        except json.JSONDecodeError:
            logger.error(f"KioskConsumer: JSON decode error for message: {text_data[:100]}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def user_login(self, event):
        # Handle user login events
        logger.info("KioskConsumer: Handling user login event")
        message_data = event['message']
        
        # Send the login data with navigation instructions
        await self.send(text_data=json.dumps({
            'type': 'user.login',
            'message': message_data,
            'action': message_data.get('action', 'login'),
            'redirect': message_data.get('redirect')
        })) 