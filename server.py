#!/usr/bin/env python3
"""Simple HTTP server with cache disabled for development."""
import http.server
import socketserver
from datetime import datetime

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler that disables all caching."""
    
    def end_headers(self):
        """Add cache control headers before ending headers."""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Log with timestamp."""
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {format % args}")

PORT = 5000
Handler = NoCacheHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Serving HTTP on 0.0.0.0 port {PORT} (no cache)")
    print(f"Open http://0.0.0.0:{PORT}/preview.html to view the extension")
    httpd.serve_forever()
