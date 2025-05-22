import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class UnimateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("UnimateConsumer: connect() called")
        
        # Accept the WebSocket connection
        await self.accept()
        logger.info("UnimateConsumer: Connection accepted")
        
        # Send a welcome message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to UNIMATE WebSocket'
        }))

    async def disconnect(self, close_code):
        logger.info(f"UnimateConsumer: disconnect() called with close_code: {close_code}")

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

class KioskConsumer(AsyncWebsocketConsumer):
    """Dedicated consumer for kiosk connections used in the test script"""
    
    async def connect(self):
        logger.info("KioskConsumer: connect() called")
        
        # Get kiosk ID from URL route
        self.kiosk_id = self.scope['url_route']['kwargs']['kiosk_id']
        logger.info(f"KioskConsumer: Connecting kiosk with ID: {self.kiosk_id}")
        
        # Join the kiosk group to receive messages
        self.kiosk_group_name = f"kiosk_{self.kiosk_id}"
        logger.info(f"KioskConsumer: Setting up channel layer, joining group {self.kiosk_group_name}")
        
        # Accept the connection first
        await self.accept()
        logger.info("KioskConsumer: Connection accepted")
        
        # Join the kiosk-specific group
        try:
            await self.channel_layer.group_add(
                self.kiosk_group_name,
                self.channel_name
            )
            logger.info(f"KioskConsumer: Joined group {self.kiosk_group_name}")
        except Exception as e:
            logger.error(f"KioskConsumer: Error joining group {self.kiosk_group_name}: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f"Failed to join group: {str(e)}"
            }))
        
        # Also join the unimate group
        try:
            await self.channel_layer.group_add(
                "unimate",
                self.channel_name
            )
            logger.info("KioskConsumer: Joined group 'unimate'")
        except Exception as e:
            logger.error(f"KioskConsumer: Error joining unimate group: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f"Failed to join unimate group: {str(e)}"
            }))
        
        # Send a welcome message back to confirm connection
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f"Connected to kiosk {self.kiosk_id}",
            'kiosk_id': self.kiosk_id
        }))
    
    async def disconnect(self, close_code):
        logger.info(f"KioskConsumer: disconnect called with code: {close_code}")
        
        # Leave the groups
        try:
            # Leave the kiosk group
            await self.channel_layer.group_discard(
                self.kiosk_group_name,
                self.channel_name
            )
            logger.info(f"KioskConsumer: Left group {self.kiosk_group_name}")
            
            # Leave the unimate group
            await self.channel_layer.group_discard(
                "unimate",
                self.channel_name
            )
            logger.info("KioskConsumer: Left group 'unimate'")
        except Exception as e:
            logger.error(f"KioskConsumer: Error leaving groups: {str(e)}")
    
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
        logger.info(f"KioskConsumer: Handling user login event for kiosk {self.kiosk_id}")
        logger.info(f"KioskConsumer: Message content: {event}")
        
        # Forward the exact message to the client
        message = json.dumps({
            'type': 'user.login',
            'message': event['message']
        })
        logger.info(f"KioskConsumer: Sending to client: {message[:100]}...")
        await self.send(text_data=message) 