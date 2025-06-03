/**
 * WebSocket Module
 * Handles WebSocket connection and messaging for real-time features
 */

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectInterval = 5000;
    }

    /**
     * Initialize WebSocket connection
     */
    init() {
        try {
            console.log("Attempting WebSocket connection...");
            // Only attempt WebSocket if in production or specifically enabled
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                this.ws = new WebSocket(`ws://${window.location.host}/ws/unimate/`);

                this.ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                };

                this.ws.onclose = () => {
                    console.log("WebSocket connection closed, will retry in 5s");
                    setTimeout(() => this.init(), this.reconnectInterval);
                };

                this.ws.onerror = (error) => {
                    console.log("WebSocket error, falling back to REST API only mode");
                    this.ws = null; // Clear the WebSocket object on error
                };
            } else {
                console.log("Development mode - skipping WebSocket initialization");
            }
        } catch (error) {
            console.log("Failed to initialize WebSocket, continuing with REST API only:", error);
        }
    }

    /**
     * Handle incoming WebSocket messages
     * @param {Object} data - Message data
     */
    handleMessage(data) {
        if (data.type === 'user.login') {
            // Dispatch custom event for login
            window.dispatchEvent(new CustomEvent('user-login', { detail: data.message }));
        }
    }

    /**
     * Send message through WebSocket
     * @param {Object} message - Message to send
     */
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    /**
     * Close WebSocket connection
     */
    close() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Export the WebSocket manager instance
window.WebSocketManager = WebSocketManager;