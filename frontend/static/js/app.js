// WebSocket connection for real-time updates
let socket = null;

// Initialize WebSocket
function initWebSocket() {
    if (!socket) {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/unimate/`;

        socket = new WebSocket(wsUrl);

        socket.onopen = function (e) {
            console.log('WebSocket connected');
        };

        socket.onmessage = function (event) {
            console.log('WebSocket message received:', event.data);
            const data = JSON.parse(event.data);

            // Handle different message types
            if (data.type === 'user_login' && data.message) {
                handleUserLogin(data.message);
            }
        };

        socket.onclose = function (e) {
            console.log('WebSocket connection closed');
            socket = null;

            // Attempt to reconnect after 3 seconds
            setTimeout(initWebSocket, 3000);
        };

        socket.onerror = function (error) {
            console.error('WebSocket error:', error);
        };
    }
}

// 3D Map variables
let mapScene, mapCamera, mapRenderer, mapControls;

// Initialize 3D map
function initMap() {
    // Scene
    mapScene = new THREE.Scene();
    mapScene.background = new THREE.Color(0x1a1a1a);

    // Camera
    mapCamera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    mapCamera.position.set(0, 10, 20);

    // Renderer
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    mapRenderer = new THREE.WebGLRenderer({ antialias: true });
    mapRenderer.setSize(400, 300);
    mapContainer.appendChild(mapRenderer.domElement);

    // Controls
    mapControls = new THREE.OrbitControls(mapCamera, mapRenderer.domElement);
    mapControls.enableDamping = true;
    mapControls.dampingFactor = 0.05;

    // Add some basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    mapScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    mapScene.add(directionalLight);

    // Simple floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    mapScene.add(floor);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        mapControls.update();
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
        return;
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
    openEventDetailsModal(event);

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

// Fit camera to view the route
function fitCameraToRoute(points) {
    if (!points || points.length === 0) return;

    // Calculate bounding box
    const box = new THREE.Box3();
    points.forEach(point => box.expandByPoint(point));

    // Get the size of the bounding box
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Set camera position to view the route
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = mapCamera.fov * (Math.PI / 180);
    const cameraDistance = maxDim / 2 / Math.tan(fov / 2);

    mapCamera.position.copy(center);
    mapCamera.position.y += cameraDistance * 0.5;
    mapCamera.position.z += cameraDistance;

    mapCamera.lookAt(center);
    mapControls.target.copy(center);
    mapControls.update();
}

// Idle timer functionality
let idleTimer;
const IDLE_TIME = 30000; // 30 seconds

function startIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        // Return to login screen
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');

        // Clear stored tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Clear timetable
        document.getElementById('timetable').innerHTML = '';
        clearRoute();
    }, IDLE_TIME);
}

// Event Details Modal
function createEventDetailsModal() {
    // Check if modal already exists
    if (document.getElementById('event-details-modal')) {
        return;
    }

    const modalHTML = `
        <div id="event-details-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
                    <button id="modal-close-btn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    
                    <div class="mb-4">
                        <h2 id="modal-event-title" class="text-xl font-bold text-gray-900 mb-2"></h2>
                        <div id="modal-event-badges" class="flex gap-2 mb-3"></div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">Time</h3>
                                <p id="modal-event-time" class="text-sm text-gray-900"></p>
                            </div>
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">Date</h3>
                                <p id="modal-event-date" class="text-sm text-gray-900"></p>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Duration</h3>
                            <p id="modal-event-duration" class="text-sm text-gray-900"></p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">Building</h3>
                                <p id="modal-event-building" class="text-sm text-gray-900"></p>
                            </div>
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">Room</h3>
                                <p id="modal-event-room" class="text-sm text-gray-900"></p>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Course</h3>
                            <p id="modal-event-course" class="text-sm text-gray-900"></p>
                        </div>
                        
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Lecturer</h3>
                            <p id="modal-event-lecturer" class="text-sm text-gray-900"></p>
                        </div>
                        
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Description</h3>
                            <p id="modal-event-description" class="text-sm text-gray-900"></p>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex gap-3">
                        <button id="modal-navigate-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                            Navigate to Room
                        </button>
                        <button id="modal-close-btn-2" class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-medium">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners
    document.getElementById('modal-close-btn').addEventListener('click', closeEventDetailsModal);
    document.getElementById('modal-close-btn-2').addEventListener('click', closeEventDetailsModal);
    document.getElementById('modal-navigate-btn').addEventListener('click', navigateToEventLocation);

    // Close on background click
    document.getElementById('event-details-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeEventDetailsModal();
        }
    });
}

function openEventDetailsModal(event) {
    createEventDetailsModal();
    populateEventModal(event);
    const modal = document.getElementById('event-details-modal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function closeEventDetailsModal() {
    const modal = document.getElementById('event-details-modal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

function populateEventModal(event) {
    // Set title
    document.getElementById('modal-event-title').textContent = event.title || 'Event Details';

    // Set badges
    const badgesContainer = document.getElementById('modal-event-badges');
    badgesContainer.innerHTML = '';

    // Event type badge
    const typeBadge = document.createElement('span');
    typeBadge.className = event.event_type === 'exam' ?
        'bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded' :
        'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded';
    typeBadge.textContent = event.event_type === 'exam' ? 'EXAM' : 'CLASS';
    badgesContainer.appendChild(typeBadge);

    // Urgent badge
    if (event.is_urgent) {
        const urgentBadge = document.createElement('span');
        urgentBadge.className = 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded';
        urgentBadge.textContent = 'URGENT';
        badgesContainer.appendChild(urgentBadge);
    }

    // Set schedule information
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    document.getElementById('modal-event-time').textContent =
        `${startTime.toLocaleTimeString(undefined, timeOptions)} - ${endTime.toLocaleTimeString(undefined, timeOptions)}`;
    document.getElementById('modal-event-date').textContent =
        startTime.toLocaleDateString(undefined, dateOptions);

    // Calculate duration
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationText = durationHours > 0 ?
        `${durationHours}h ${durationMinutes}m` :
        `${durationMinutes}m`;
    document.getElementById('modal-event-duration').textContent = durationText;

    // Set location information
    const building = event.room?.building || 'TBA';
    const roomNumber = event.room?.number || 'TBA';
    document.getElementById('modal-event-building').textContent = building;
    document.getElementById('modal-event-room').textContent = roomNumber;

    // Set course information
    const courseCode = event.course?.code || 'N/A';
    const courseName = event.course?.name || '';
    const courseText = courseName ? `${courseCode} - ${courseName}` : courseCode;
    document.getElementById('modal-event-course').textContent = courseText;
    document.getElementById('modal-event-lecturer').textContent = event.lecturer || 'Not specified';

    // Set description/additional info
    const description = event.description || event.course?.description || 'No additional information available.';
    document.getElementById('modal-event-description').textContent = description;

    // Handle navigate button
    const navigateBtn = document.getElementById('modal-navigate-btn');
    if (event.room && event.room.building && event.room.number) {
        navigateBtn.style.display = 'block';
        navigateBtn.dataset.building = event.room.building;
        navigateBtn.dataset.room = event.room.number;
    } else {
        navigateBtn.style.display = 'none';
    }
}

function navigateToEventLocation() {
    const navigateBtn = document.getElementById('modal-navigate-btn');
    const building = navigateBtn.dataset.building;
    const room = navigateBtn.dataset.room;

    if (building && room) {
        closeEventDetailsModal();
        // Map building codes to building IDs for navigation
        let buildingId = '';
        switch (building.toUpperCase()) {
            case 'ENG': buildingId = 'engineering'; break;
            case 'SCI': buildingId = 'science'; break;
            case 'LIB': buildingId = 'library'; break;
            case 'BUS': buildingId = 'bizschool'; break;
            case 'ARTS': buildingId = 'arts'; break;
            case 'HSB': buildingId = 'health'; break;
            default: buildingId = 'main';
        }
        console.log('Navigation to:', building, room, 'mapped to building:', buildingId);
    }
}

// Keyboard event handler for modal
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('event-details-modal');
        if (modal && modal.classList.contains('show')) {
            closeEventDetailsModal();
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded - initializing app");

    // Initialize app components
    initWebSocket();
    initMap();

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
                // Show login screen if auto-login fails
                document.getElementById('dashboard').classList.add('hidden');
                document.getElementById('login-screen').classList.remove('hidden');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            });
    }
}); 