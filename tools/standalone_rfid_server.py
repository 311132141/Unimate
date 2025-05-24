#!/usr/bin/env python
"""
Standalone RFID Server
---------------------
This script runs a simple HTTP server that responds to RFID scan requests.
It doesn't require the full Django backend to work.
"""

import http.server
import socketserver
import json
import threading
import socket
import time
import logging
import argparse
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("RFID-Server")

# Default port
DEFAULT_PORT = 8000

# Store recent scans
recent_scans = []
MAX_SCANS = 10

# Valid RFID cards
VALID_CARDS = {
    "5A653600": {"name": "Your Card", "user_id": 1, "status": "active"},
    "04B5C6D7E8": {"name": "Bob", "user_id": 2, "status": "active"},
    "0499AA11BB": {"name": "Carol", "user_id": 3, "status": "active"}
}

def get_local_ip():
    """Get the local IP address of this machine"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        # Fallback
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)

class RFIDHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests - show a simple status page"""
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>RFID Test Server</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                h1 {{ color: #333; }}
                .card {{ background: #f9f9f9; border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px; }}
                .success {{ background: #d4edda; }}
                .info {{ background-color: #e0f7fa; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <h1>RFID Test Server</h1>
            
            <div class="info">
                <p><strong>Server URL:</strong> http://{get_local_ip()}:{DEFAULT_PORT}/api/scan/</p>
                <p>Update your ESP32 code with this URL to test RFID scanning.</p>
            </div>
            
            <h2>Recent Scans</h2>
        """
        
        if not recent_scans:
            html += "<p>No scans received yet.</p>"
        else:
            for scan in recent_scans:
                card_class = "card success" if scan["valid"] else "card"
                html += f"""
                <div class="{card_class}">
                    <p><strong>RFID:</strong> {scan["rfid_uid"]}</p>
                    <p><strong>Kiosk:</strong> {scan["kiosk"]}</p>
                    <p><strong>Time:</strong> {scan["time"]}</p>
                    <p><strong>Status:</strong> {"Valid" if scan["valid"] else "Invalid"}</p>
                </div>
                """
        
        html += """
            <script>
                // Auto-refresh the page every 5 seconds
                setTimeout(function() { location.reload(); }, 5000);
            </script>
        </body>
        </html>
        """
        
        self.wfile.write(html.encode())
    
    def do_POST(self):
        """Handle POST requests - process RFID scans"""
        if self.path == '/api/scan/' or self.path == '/api/scan':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                rfid_uid = data.get('rfid_uid', '')
                kiosk_id = data.get('kiosk', 'unknown')
                
                logger.info(f"RFID scan received: {rfid_uid} from kiosk {kiosk_id}")
                
                # Check if the card is valid
                valid_card = rfid_uid in VALID_CARDS
                
                # Create scan record
                scan = {
                    "rfid_uid": rfid_uid,
                    "kiosk": kiosk_id,
                    "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "valid": valid_card
                }
                
                # Add to recent scans
                recent_scans.insert(0, scan)
                if len(recent_scans) > MAX_SCANS:
                    recent_scans.pop()
                
                # Create response
                if valid_card:
                    # Get user info
                    user_info = VALID_CARDS[rfid_uid]
                    
                    response = {
                        "success": True,
                        "access": "mock_access_token",
                        "refresh": "mock_refresh_token",
                        "user": {
                            "id": user_info["user_id"],
                            "username": user_info["name"],
                            "events": []
                        }
                    }
                    status_code = 200
                else:
                    response = {
                        "success": False,
                        "error": "Invalid RFID card"
                    }
                    status_code = 404
                
                # Send response
                self.send_response(status_code)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
        else:
            # For other POST requests, return 404
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Override to use our logger instead of default logging"""
        logger.info("%s - %s" % (self.address_string(), format % args))

def run_server(port=DEFAULT_PORT):
    """Run the HTTP server"""
    try:
        with socketserver.TCPServer(("", port), RFIDHandler) as httpd:
            local_ip = get_local_ip()
            logger.info(f"Server running at http://{local_ip}:{port}/")
            logger.info(f"ESP32 scan endpoint: http://{local_ip}:{port}/api/scan/")
            logger.info("Press Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Error starting server: {e}")

def main():
    parser = argparse.ArgumentParser(description="Run a standalone RFID test server")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"Port to run the server on (default: {DEFAULT_PORT})")
    args = parser.parse_args()
    
    logger.info("Starting standalone RFID test server...")
    logger.info(f"Valid test cards: {', '.join(VALID_CARDS.keys())}")
    
    run_server(args.port)

if __name__ == "__main__":
    main() 