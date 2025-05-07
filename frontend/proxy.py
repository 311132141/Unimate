import http.server
import socketserver
import os
import urllib.request
import urllib.error
import json

# Configuration
FRONTEND_PORT = 8080  # The port for our frontend server
BACKEND_PORT = 8000   # Django backend port

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # If it's an API request, proxy to the backend
        if self.path.startswith('/api/'):
            self.proxy_request('GET')
        else:
            # For other requests, serve from the local directory
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

# Set up the server
PORT = FRONTEND_PORT
Handler = ProxyHTTPRequestHandler

# Change to the current directory (where this script is)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Start server
print(f"Starting proxy server at http://localhost:{PORT}")
print(f"API requests will be forwarded to http://localhost:{BACKEND_PORT}")
print(f"Open http://localhost:{PORT}/connected.html in your browser")
print("Press Ctrl+C to stop the server")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped by user") 