/**
 * Authentication Module
 * Handles user login, logout, and session management
 */

class AuthManager {
    constructor() {
        this.idleTimer = null;
        this.idleTimeout = 180000; // 3 minutes
        this.init();
    }

    /**
     * Initialize authentication management
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Listen for WebSocket login events
        window.addEventListener('user-login', (event) => {
            this.handleUserLogin(event.detail);
        });

        // Check for existing session on page load
        this.checkExistingSession();
    }

    /**
     * Set up event listeners for forms and buttons
     */
    setupEventListeners() {
        // Handle form login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleFormLogin(e));
        }

        // Handle logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Reset idle timer on user activity
        document.addEventListener('mousemove', () => this.resetIdleTimer());
        document.addEventListener('keypress', () => this.resetIdleTimer());
    }

    /**
     * Handle form-based login
     * @param {Event} e - Form submit event
     */
    async handleFormLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post('/api/login/', {
                username,
                password
            });

            this.handleUserLogin(response.data);
        } catch (error) {
            alert('Invalid credentials');
        }
    }

    /**
     * Handle user login (from form or WebSocket)
     * @param {Object} data - Login data
     */
    handleUserLogin(data) {
        console.log('Login data received:', JSON.stringify(data, null, 2));

        // Store JWT token
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Update UI
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');

        // Set username
        let username = '';
        if (data.user && data.user.username) {
            username = data.user.username;
        } else if (data.username) {
            username = data.username;
        }
        
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = username;
        }

        // Extract events from the response
        let events = [];
        if (data.user && data.user.events) {
            console.log('Found events in data.user.events:', data.user.events.length);
            events = data.user.events;
        } else if (data.events) {
            console.log('Found events in data.events:', data.events.length);
            events = data.events;
        } else {
            console.warn('No events found in the response data');
        }

        console.log('Events to render:', events.length);

        // Notify other modules about login
        window.dispatchEvent(new CustomEvent('auth-login-success', { detail: { events, user: data.user } }));

        // Start idle timer
        this.startIdleTimer();
    }

    /**
     * Handle user logout
     */
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        const dashboard = document.getElementById('dashboard');
        const loginScreen = document.getElementById('login-screen');
        
        if (dashboard) dashboard.classList.add('hidden');
        if (loginScreen) loginScreen.classList.remove('hidden');

        // Clear idle timer
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }

        // Notify other modules about logout
        window.dispatchEvent(new CustomEvent('auth-logout'));
    }

    /**
     * Check for existing session on page load
     */
    checkExistingSession() {
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const token = localStorage.getItem('access_token');

        if (token) {
            console.log("Found stored token, trying to auto-login");
            this.autoLogin(token);
        } else if (isDevelopment) {
            // If running in development mode, show demo data
            console.log("Dev mode - showing sample data");
            this.showDemoMode();
        }
    }

    /**
     * Auto-login with stored token
     * @param {string} token - Stored JWT token
     */
    async autoLogin(token) {
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');

        try {
            // Try to load events from API
            const response = await fetch('/api/events/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const events = await response.json();
                window.dispatchEvent(new CustomEvent('auth-login-success', { detail: { events } }));
            } else {
                throw new Error('Failed to fetch events');
            }
        } catch (error) {
            console.error('Auto-login failed:', error);
            // Fallback to loading sample data
            window.dispatchEvent(new CustomEvent('auth-login-success', { detail: { events: [] } }));
        }
    }

    /**
     * Show demo mode for development
     */
    showDemoMode() {
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('dashboard');
        const userNameElement = document.getElementById('user-name');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');
        if (userNameElement) userNameElement.textContent = "Demo User";

        // Generate demo events
        const demoEvents = [
            {
                "id": 1,
                "title": "ENGGEN205 Lecture",
                "event_type": "class",
                "course": { "code": "ENGGEN205", "name": "Engineering Mechanics" },
                "room": { "building": "ENG", "number": "340" },
                "start_time": new Date().toISOString(),
                "end_time": new Date(Date.now() + 3600000).toISOString(),
                "lecturer": "Dr. Smith",
                "is_urgent": false
            },
            {
                "id": 2,
                "title": "STATS100 Mid-term Exam",
                "event_type": "exam",
                "course": { "code": "STATS100", "name": "Statistics" },
                "room": { "building": "ENG", "number": "401" },
                "start_time": new Date(Date.now() + 86400000).toISOString(),
                "end_time": new Date(Date.now() + 86400000 + 7200000).toISOString(),
                "lecturer": "N/A",
                "is_urgent": true
            }
        ];
        
        window.dispatchEvent(new CustomEvent('auth-login-success', { detail: { events: demoEvents } }));
    }

    /**
     * Start idle timer
     */
    startIdleTimer() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }

        this.idleTimer = setTimeout(() => {
            this.logout();
        }, this.idleTimeout);
    }

    /**
     * Reset idle timer
     */
    resetIdleTimer() {
        this.startIdleTimer();
    }

    /**
     * Get current access token
     * @returns {string|null} Access token
     */
    getToken() {
        return localStorage.getItem('access_token');
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return !!this.getToken();
    }
}

// Export the Auth manager instance
window.AuthManager = AuthManager;