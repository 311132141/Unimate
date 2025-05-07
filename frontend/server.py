import http.server
import socketserver
import os
import mimetypes

# Add MIME types for our files
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/html', '.html')

# Custom HTTP request handler
class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def do_GET(self):
        # Special handling for root path
        if self.path == '/' or self.path == '':
            self.path = '/connected.html'
        
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

# Set up the server
PORT = 8080
Handler = CustomHTTPRequestHandler

# Change to the current directory (where this script is)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Start server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print(f"Open http://localhost:{PORT}/connected.html in your browser")
    httpd.serve_forever() 