/**
 * Main App Module
 * Coordinates all other modules and initializes the application
 */

class AppManager {
    constructor() {
        this.webSocketManager = null;
        this.mapManager = null;
        this.authManager = null;
        this.timetableManager = null;
    }

    /**
     * Initialize the application
     */
    init() {
        console.log("Initializing Unimate App with modular architecture");

        // Initialize modules
        this.webSocketManager = new WebSocketManager();
        this.mapManager = new MapManager();
        this.authManager = new AuthManager();
        this.timetableManager = new TimetableManager();

        // Set up inter-module communication
        this.setupEventListeners();

        // Initialize modules
        this.webSocketManager.init();
        this.mapManager.init();

        // Handle window resize for map
        window.addEventListener('resize', () => {
            this.mapManager.handleResize();
        });

        // Store global references for backward compatibility
        window.webSocketManagerInstance = this.webSocketManager;
        window.mapManagerInstance = this.mapManager;
        window.authManagerInstance = this.authManager;
        window.timetableManagerInstance = this.timetableManager;

        console.log("Unimate App initialized successfully");
    }

    /**
     * Set up event listeners for inter-module communication
     */
    setupEventListeners() {
        // Listen for route visualization requests
        window.addEventListener('visualize-route', (event) => {
            this.mapManager.visualizeRoute(event.detail);
        });

        // Listen for auth state changes to clear routes
        window.addEventListener('auth-logout', () => {
            this.mapManager.clearRoute();
        });

        // Listen for auth login to clear previous routes
        window.addEventListener('auth-login-success', () => {
            this.mapManager.clearRoute();
        });
    }

    /**
     * Get module instances
     */
    getModules() {
        return {
            webSocket: this.webSocketManager,
            map: this.mapManager,
            auth: this.authManager,
            timetable: this.timetableManager
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.webSocketManager) {
            this.webSocketManager.close();
        }
        
        // Remove global references
        delete window.webSocketManagerInstance;
        delete window.mapManagerInstance;
        delete window.authManagerInstance;
        delete window.timetableManagerInstance;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded - initializing modular app");
    
    // Create and initialize app
    const app = new AppManager();
    app.init();
    
    // Store app instance globally
    window.appManagerInstance = app;
});

// Export for use in other modules
window.AppManager = AppManager;