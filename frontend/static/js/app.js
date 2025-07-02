// WebSocket connection
let ws = null;

// Test function to simulate RFID scan via REST API
function testRFIDScan() {
    console.log("🧪 Testing RFID scan via REST API...");
    
    // Use direct backend URL instead of proxy
    const apiUrl = 'http://localhost:8000/api/scan/';
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'rfid_uid': '5A653600'  // Alice's card
        })
    })
    .then(response => {
        console.log("🧪 REST API response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("🧪 REST API response data:", data);
        if (data.user) {
            console.log("🧪 Manually triggering login flow...");
            handleUserLogin(data);
        }
    })
    .catch(error => {
        console.error("🧪 REST API test failed:", error);
    });
}

// Immediate test - don't wait for DOM
console.log("🚀 app.js loading immediately!");

// Add button immediately
setTimeout(() => {
    console.log("Adding test button immediately...");
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test RFID Scan';
    testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: red; color: white; padding: 10px; border: none; cursor: pointer; border-radius: 5px;';
    testBtn.onclick = testRFIDScan;
    
    if (document.body) {
        document.body.appendChild(testBtn);
        console.log("✅ Test button added to body");
    } else {
        console.log("❌ Document.body not available yet");
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(testBtn);
            console.log("✅ Test button added after DOM loaded");
        });
    }
}, 100);

// Initialize WebSocket connection
function initWebSocket() {
    try {
        console.log("Attempting WebSocket connection...");
        let wsUrl = `ws://localhost:8000/ws/unimate/`;
        
        console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
        ws = new WebSocket(wsUrl);

        ws.onopen = function() {
            console.log("✓ WebSocket connection established successfully!");
        };

        ws.onmessage = function (event) {
            console.log("📨 WebSocket message received:", event.data);
            
            try {
                const data = JSON.parse(event.data);
                console.log("📨 Parsed WebSocket data:", data);
                
                if (data.type === 'user.login') {
                    console.log("🎯 Processing user login message");
                    handleUserLogin(data.message);
                }
            } catch (error) {
                console.error("❌ Error parsing WebSocket message:", error);
            }
        };

        ws.onclose = function (event) {
            console.log("❌ WebSocket connection closed. Code:", event.code, "Reason:", event.reason);
            console.log("🔄 Will retry in 5 seconds...");
            setTimeout(initWebSocket, 5000);
        };

        ws.onerror = function (error) {
            console.error("❌ WebSocket error occurred:", error);
        };
    } catch (error) {
        console.error("❌ Failed to initialize WebSocket:", error);
    }
}

// Handle user login from RFID scan
function handleUserLogin(data) {
    console.log('🎯 Login data received:', JSON.stringify(data, null, 2));

    // Clear any existing tokens first
    localStorage.clear();
    console.log('🧹 Cleared localStorage');

    // Store JWT token
    if (data.access) {
        localStorage.setItem('access_token', data.access);
        console.log('✅ Stored access_token:', data.access.substring(0, 50) + '...');
    } else {
        console.log('❌ No access token in data:', data);
    }
    
    if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
        console.log('✅ Stored refresh_token');
    } else {
        console.log('❌ No refresh token in data');
    }

    // Show success message and redirect to dashboard
    showLoginSuccessAndRedirect(data);
}

// Show login success message and redirect to dashboard
function showLoginSuccessAndRedirect(data) {
    console.log("Showing login success and redirecting to dashboard.html...");
    
    // Store user data for the dashboard page
    localStorage.setItem('user_data', JSON.stringify(data));
    
    // Store individual values that dashboard.html expects
    let username = 'User';
    if (data.user && data.user.username) {
        username = data.user.username;
    } else if (data.username) {
        username = data.username;
    }
    localStorage.setItem('username', username);
    console.log('✅ Stored username:', username);
    
    // Show brief success message
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(34, 197, 94, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    overlay.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; text-align: center; max-width: 400px;">
            <div style="color: #22c55e; font-size: 4rem; margin-bottom: 1rem;">✓</div>
            <h2 style="color: #1f2937; font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">Login Successful!</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">Welcome, ${username}</p>
            <div style="color: #9ca3af; font-size: 0.875rem;">Redirecting to dashboard...</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Redirect to dashboard.html after 2 seconds
    setTimeout(() => {
        window.location.href = '/views/dashboard.html';
    }, 2000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded - initializing app");
    initWebSocket();
});
