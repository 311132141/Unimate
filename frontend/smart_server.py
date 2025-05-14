#!/usr/bin/env python
"""
Smart Server for Unimate Frontend
This script will automatically find an available port if the default port is in use.

Usage:
  python smart_server.py         - Start regular server 
  python smart_server.py proxy   - Start proxy server
"""

import http.server
import socketserver
import os
import mimetypes
import sys
import socket
import webbrowser
import time
import urllib.request
import urllib.error
import json

# Add MIME types for our files
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/html', '.html')

# Default port
DEFAULT_PORT = 8080
BACKEND_PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def do_GET(self):
        # Special handling for root path
        if self.path == '/' or self.path == '':
            self.path = '/components/connected.html'
        
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def guess_type(self, path):
        """Override the default MIME type guessing behavior."""
        base, ext = os.path.splitext(path)
        if ext in mimetypes.types_map:
            return mimetypes.types_map[ext]
        
        # Special cases
        if ext == '.css':
            return 'text/css'
        elif ext == '.js':
            return 'application/javascript'
        elif ext == '.html':
            return 'text/html'
        
        return 'application/octet-stream'  # Default

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # If it's an API request, proxy to the backend
        if self.path.startswith('/api/'):
            self.proxy_request('GET')
        else:
            # For other requests, serve from the local directory
            super().do_GET()
            
            # Special handling for root path after super().do_GET()
            if (self.path == '/' or self.path == '') and hasattr(self, 'path_handled') and not self.path_handled:
                self.path = '/components/connected.html'
                super().do_GET()
    
    def do_POST(self):
        # If it's an API request, proxy to the backend
        if self.path.startswith('/api/'):
            self.proxy_request('POST')
        else:
            self.send_error(404, "Not Found")
    
    def proxy_request(self, method):
        # Build the backend URL
        backend_url = f"http://localhost:{BACKEND_PORT}{self.path}"
        
        # Copy headers
        headers = {}
        for key, value in self.headers.items():
            if key.lower() != 'host':
                headers[key] = value
        
        # Read request body if it's a POST
        content_length = int(self.headers.get('Content-Length', 0))
        body = None
        if content_length > 0:
            body = self.rfile.read(content_length)
        
        try:
            # Create and send the request to the backend
            req = urllib.request.Request(
                backend_url, 
                data=body,
                headers=headers,
                method=method
            )
            
            # Get the response
            with urllib.request.urlopen(req) as response:
                # Copy status code
                self.send_response(response.status)
                
                # Copy headers
                for key, value in response.getheaders():
                    self.send_header(key, value)
                self.end_headers()
                
                # Copy response body
                self.wfile.write(response.read())
                
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e),
                "status": e.code
            }).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e),
                "status": 500
            }).encode('utf-8'))

def find_available_port(start_port=DEFAULT_PORT, max_attempts=10):
    """Find an available port starting from start_port"""
    for port_offset in range(max_attempts):
        port = start_port + port_offset
        try:
            # Try to bind to the port to see if it's available
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue  # Port is in use, try the next one
    
    # If we get here, no ports were available
    return None

def start_server(use_proxy=False):
    """Start either the regular or proxy server on an available port"""
    # Change to the current directory (where this script is)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Find an available port
    port = find_available_port()
    if port is None:
        print(f"Error: No available ports found after trying {max_attempts} ports.")
        return 1
    
    # Set up the server with the appropriate handler
    Handler = ProxyHTTPRequestHandler if use_proxy else CustomHTTPRequestHandler
    server_type = "proxy" if use_proxy else "regular"
    
    print(f"\nStarting {server_type} server on port {port}")
    if use_proxy:
        print(f"API requests will be forwarded to http://localhost:{BACKEND_PORT}")
    
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            url = f"http://localhost:{port}/components/connected.html"
            print(f"Server running at {url}")
            
            # Open the browser
            webbrowser.open(url)
            
            # Start the server
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"\nError starting server: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    # Check if we should use proxy mode
    use_proxy = len(sys.argv) > 1 and sys.argv[1].lower() == "proxy"
    
    # Start the server
    sys.exit(start_server(use_proxy)) 