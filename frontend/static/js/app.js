/**
 * Legacy App.js - Updated to use modular architecture
 * 
 * This file now serves as a compatibility layer for existing functionality
 * while using the new modular system underneath.
 */

// Global variables for backward compatibility
let ws = null;
let mapScene = null;
let mapCamera = null;
let mapRenderer = null;

// Legacy function wrappers for backward compatibility
function initWebSocket() {
    console.log("Legacy initWebSocket called - using modular WebSocketManager");
    if (window.webSocketManagerInstance) {
        window.webSocketManagerInstance.init();
        ws = window.webSocketManagerInstance.ws; // For compatibility
    }
}

function initMap() {
    console.log("Legacy initMap called - using modular MapManager");
    if (window.mapManagerInstance) {
        window.mapManagerInstance.init();
        // Set global references for compatibility
        mapScene = window.mapManagerInstance.scene;
        mapCamera = window.mapManagerInstance.camera;
        mapRenderer = window.mapManagerInstance.renderer;
    }
}

function handleUserLogin(data) {
    console.log("Legacy handleUserLogin called - using modular AuthManager");
    if (window.authManagerInstance) {
        window.authManagerInstance.handleUserLogin(data);
    }
}

function renderTimetable(events) {
    console.log("Legacy renderTimetable called - using modular TimetableManager");
    if (window.timetableManagerInstance) {
        window.timetableManagerInstance.renderTimetable(events);
    }
}

function showEventDetails(event) {
    console.log("Legacy showEventDetails called - using modular TimetableManager");
    if (window.timetableManagerInstance) {
        window.timetableManagerInstance.showEventDetails(event);
    }
}

function visualizeRoute(routeData) {
    console.log("Legacy visualizeRoute called - using modular MapManager");
    if (window.mapManagerInstance) {
        window.mapManagerInstance.visualizeRoute(routeData);
    }
}

function clearRoute() {
    console.log("Legacy clearRoute called - using modular MapManager");
    if (window.mapManagerInstance) {
        window.mapManagerInstance.clearRoute();
    }
}

function fitCameraToRoute(points) {
    console.log("Legacy fitCameraToRoute called - using modular MapManager");
    if (window.mapManagerInstance) {
        window.mapManagerInstance.fitCameraToRoute(points);
    }
}

function startIdleTimer() {
    console.log("Legacy startIdleTimer called - using modular AuthManager");
    if (window.authManagerInstance) {
        window.authManagerInstance.startIdleTimer();
    }
}

// Legacy initialization - now delegates to modular system
document.addEventListener('DOMContentLoaded', function () {
    console.log("Legacy DOM loaded handler - modular system will handle initialization");
    
    // Note: The modular system initialization happens in modules/app.js
    // This is just for any legacy code that might depend on these functions
    
    setTimeout(() => {
        // Ensure backward compatibility by setting up legacy globals after modules load
        if (window.webSocketManagerInstance) {
            ws = window.webSocketManagerInstance.ws;
        }
        if (window.mapManagerInstance) {
            mapScene = window.mapManagerInstance.scene;
            mapCamera = window.mapManagerInstance.camera;
            mapRenderer = window.mapManagerInstance.renderer;
        }
    }, 100);
}); 