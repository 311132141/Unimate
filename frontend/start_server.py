#!/usr/bin/env python
"""
Simple starter script for Unimate frontend servers.
Usage:
  python start_server.py         - Starts regular server
  python start_server.py proxy   - Starts proxy server
"""

import sys
import os
import subprocess

def start_server(server_type="regular"):
    """Start either the regular server or proxy server"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)  # Ensure we're in the frontend directory
    
    if server_type.lower() == "proxy":
        print("Starting proxy server (with backend API forwarding)...")
        subprocess.run(["python", "proxy.py"])
    else:
        print("Starting regular frontend server...")
        subprocess.run(["python", "server.py"])

if __name__ == "__main__":
    # Get server type from command line arguments
    server_type = "regular"
    if len(sys.argv) > 1 and sys.argv[1].lower() == "proxy":
        server_type = "proxy"
    
    # Start the appropriate server
    start_server(server_type) 