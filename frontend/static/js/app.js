// WebSocket connection
let ws = null;
let mapScene = null;
let mapCamera = null;
let mapRenderer = null;

// Initialize WebSocket connection
function initWebSocket() {
    try {
        console.log("Attempting WebSocket connection...");
        // Only attempt WebSocket if in production or specifically enabled
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            ws = new WebSocket(`ws://${window.location.host}/ws/unimate/`);

            ws.onmessage = function (event) {
                const data = JSON.parse(event.data);
                if (data.type === 'user.login') {
                    handleUserLogin(data.message);
                }
            };

            ws.onclose = function () {
                console.log("WebSocket connection closed, will retry in 5s");
                setTimeout(initWebSocket, 5000);
            };

            ws.onerror = function (error) {
                console.log("WebSocket error, falling back to REST API only mode");
                ws = null; // Clear the WebSocket object on error
            };
        } else {
            console.log("Development mode - skipping WebSocket initialization");
        }
    } catch (error) {
        console.log("Failed to initialize WebSocket, continuing with REST API only:", error);
    }
}

// Initialize 3D map
function initMap() {
    const container = document.getElementById('map-container');

    // Scene setup
    mapScene = new THREE.Scene();
    mapCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    mapRenderer = new THREE.WebGLRenderer();
    mapRenderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(mapRenderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    mapScene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    mapScene.add(directionalLight);

    // Add a simple floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    mapScene.add(floor);

    // Position camera
    mapCamera.position.set(5, 5, 5);
    mapCamera.lookAt(0, 0, 0);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        mapRenderer.render(mapScene, mapCamera);
    }
    animate();
}

// Handle user login
function handleUserLogin(data) {
    console.log('Login data received:', JSON.stringify(data, null, 2));

    // Store JWT token
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // Update UI
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Set username
    let username = '';
    if (data.user && data.user.username) {
        username = data.user.username;
    } else if (data.username) {
        username = data.username;
    }
    document.getElementById('user-name').textContent = username;

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

    // Render timetable
    renderTimetable(events);

    // Start idle timer
    startIdleTimer();

    // Clear any previous routes on the map
    clearRoute();
}

// Render timetable
function renderTimetable(events) {
    console.log("renderTimetable called with", events ? events.length : 0, "events");

    const timetable = document.getElementById('timetable');
    if (!timetable) {
        console.error("Timetable element not found!");
        return;
    }

    // Clear the timetable
    timetable.innerHTML = '';

    // Display a message if no events
    if (!events || events.length === 0) {
        console.log("No events to display");
        timetable.innerHTML = '<p class="text-gray-500 text-center py-4">No upcoming events found.</p>';

        // Add demo data if in development environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log("Adding demo events for development");
            events = [
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
        } else {
            return; // Exit if no events in production
        }
    }

    try {
        // Create each event element
        events.forEach(event => {
            try {
                const eventElement = document.createElement('div');
                eventElement.className = 'p-4 border rounded-lg hover:bg-gray-50 cursor-pointer mb-3';

                // Add CSS classes based on event type and urgency
                if (event.event_type === 'exam') {
                    eventElement.classList.add('event-exam');
                } else {
                    eventElement.classList.add('event-class');
                }

                if (event.is_urgent) {
                    eventElement.classList.add('event-urgent');
                }

                // Format date and time with fallbacks for invalid dates
                let startTime, endTime;
                try {
                    startTime = new Date(event.start_time);
                    endTime = new Date(event.end_time);
                    if (isNaN(startTime.getTime())) {
                        console.warn("Invalid start_time:", event.start_time);
                        startTime = new Date();
                    }
                    if (isNaN(endTime.getTime())) {
                        console.warn("Invalid end_time:", event.end_time);
                        endTime = new Date(Date.now() + 3600000);
                    }
                } catch (e) {
                    console.error("Date parsing error:", e);
                    startTime = new Date();
                    endTime = new Date(Date.now() + 3600000);
                }

                const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
                const timeOptions = { hour: '2-digit', minute: '2-digit' };

                // Course code and room number handling with fallbacks
                const courseCode = event.course && event.course.code ? event.course.code : 'N/A';
                const roomInfo = event.room ?
                    `${event.room.building || ''} ${event.room.number || ''}`.trim() :
                    'TBA';

                const eventTypeLabel = event.event_type === 'exam' ? 'EXAM' : 'CLASS';
                const eventTypeClass = event.event_type === 'exam' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';

                eventElement.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-bold text-lg">${event.title || 'Untitled Event'}</h3>
                                <span class="px-2 py-0.5 text-xs font-semibold rounded ${eventTypeClass}">${eventTypeLabel}</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-1">${courseCode} - ${roomInfo}</p>
                            <p class="text-sm text-gray-500">
                                ${startTime.toLocaleDateString(undefined, dateOptions)} •
                                ${startTime.toLocaleTimeString(undefined, timeOptions)} - ${endTime.toLocaleTimeString(undefined, timeOptions)}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-700">${event.lecturer || 'No lecturer'}</p>
                            ${event.is_urgent ? '<span class="text-xs bg-red-500 text-white px-2 py-0.5 rounded">Urgent</span>' : ''}
                        </div>
                    </div>
                `;

                eventElement.addEventListener('click', () => showEventDetails(event));
                timetable.appendChild(eventElement);
            } catch (eventError) {
                console.error("Error rendering event:", eventError, event);
            }
        });

        // Add a print button and action buttons container
        const actionContainer = document.createElement('div');
        actionContainer.className = 'mt-4 flex gap-2 print-hide';

        const printButton = document.createElement('button');
        printButton.className = 'bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded flex-1';
        printButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> Print';
        printButton.addEventListener('click', () => {
            window.print();
        });

        const refreshButton = document.createElement('button');
        refreshButton.className = 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex-1';
        refreshButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Refresh';
        refreshButton.addEventListener('click', async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('access_token');
                if (!token) {
                    alert('Please log in again');
                    return;
                }

                // Fetch updated events
                const response = await fetch('/api/events/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const events = await response.json();
                    renderTimetable(events);
                } else {
                    console.error('Failed to refresh timetable');
                }
            } catch (error) {
                console.error('Error refreshing timetable:', error);
            }
        });

        actionContainer.appendChild(refreshButton);
        actionContainer.appendChild(printButton);
        timetable.appendChild(actionContainer);
    } catch (error) {
        console.error("Error in renderTimetable:", error);
        timetable.innerHTML = '<p class="text-red-500 text-center py-4">Error displaying timetable. Please try refreshing.</p>';
    }
}

// Show event details and route
function showEventDetails(event) {
    // Show the event details in a modal or highlight
    alert(`${event.title}\nLocation: ${event.room ? `${event.room.building} ${event.room.number}` : 'TBA'}\nTime: ${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleTimeString()}\nLecturer: ${event.lecturer || 'N/A'}`);

    // Get route to the room
    if (event.room) {
        // Call the route API to get directions
        const params = new URLSearchParams({
            from: 'kiosk-1', // Assuming the starting position is kiosk-1
            to: event.room.number
        });

        fetch(`/api/route/?${params}`)
            .then(response => response.json())
            .then(routeData => {
                visualizeRoute(routeData);
            })
            .catch(error => {
                console.error('Error fetching route:', error);
            });
    }
}

// Visualize route on the 3D map
function visualizeRoute(routeData) {
    // Clear any existing route
    clearRoute();

    // Check if we have valid route data
    if (!routeData || !routeData.features || routeData.features.length === 0) {
        console.error('No valid route data');
        return;
    }

    try {
        // Get the coordinates from the GeoJSON
        const coordinates = routeData.features[0].geometry.coordinates;

        // Create a line geometry
        const points = [];
        for (let i = 0; i < coordinates.length; i++) {
            const [x, y, z] = coordinates[i];
            points.push(new THREE.Vector3(x, z || 0, y)); // Note the switching of y and z for THREE.js
        }

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0066ff, linewidth: 4 });
        const routeLine = new THREE.Line(lineGeometry, lineMaterial);

        // Add the route to the scene
        mapScene.add(routeLine);

        // Move camera to view the route
        fitCameraToRoute(points);

        // Set this as the current route
        currentRoute = routeLine;
    } catch (error) {
        console.error('Error visualizing route:', error);
    }
}

// Clear current route from map
function clearRoute() {
    if (window.currentRoute) {
        mapScene.remove(window.currentRoute);
        window.currentRoute = null;
    }
}

// Adjust camera to see the entire route
function fitCameraToRoute(points) {
    if (!points || points.length === 0) return;

    // Calculate the center of the route
    const center = new THREE.Vector3();
    points.forEach(point => {
        center.add(point);
    });
    center.divideScalar(points.length);

    // Position camera to look at the center from an angle
    mapCamera.position.set(center.x + 5, center.y + 5, center.z + 5);
    mapCamera.lookAt(center);
}

// Handle form login
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('/api/login/', {
            username,
            password
        });

        handleUserLogin(response.data);
    } catch (error) {
        alert('Invalid credentials');
    }
});

// Handle logout
document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
});

// Idle timer
let idleTimer = null;

function startIdleTimer() {
    if (idleTimer) {
        clearTimeout(idleTimer);
    }

    idleTimer = setTimeout(() => {
        document.getElementById('logout-btn').click();
    }, 180000); // 3 minutes
}

// Reset idle timer on user activity
document.addEventListener('mousemove', startIdleTimer);
document.addEventListener('keypress', startIdleTimer);

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded - initializing app");
    initWebSocket();
    initMap();

    // Development mode detection
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Check if we have a stored token and try to auto-load the dashboard
    const token = localStorage.getItem('access_token');
    if (token) {
        console.log("Found stored token, trying to auto-login");

        // Show dashboard
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');

        // Try to load events from API
        fetch('/api/events/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch events');
                }
            })
            .then(events => {
                renderTimetable(events);
            })
            .catch(error => {
                console.error('Auto-login failed:', error);
                // Fallback to loading sample data
                renderTimetable([]);
            });
    } else if (isDevelopment) {
        // If running in development mode, show demo data
        console.log("Dev mode - showing sample data");
        // Force-show dashboard in dev mode with sample data
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('user-name').textContent = "Demo User";

        // Generate and display some demo data
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
        renderTimetable(demoEvents);
    }
}); 