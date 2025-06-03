/**
 * Timetable Module
 * Handles timetable rendering and event management
 */

class TimetableManager {
    constructor() {
        this.events = [];
        this.init();
    }

    /**
     * Initialize timetable management
     */
    init() {
        // Listen for login success to render timetable
        window.addEventListener('auth-login-success', (event) => {
            this.renderTimetable(event.detail.events || []);
        });

        // Listen for logout to clear timetable
        window.addEventListener('auth-logout', () => {
            this.clearTimetable();
        });
    }

    /**
     * Render timetable with events
     * @param {Array} events - Array of event objects
     */
    renderTimetable(events) {
        console.log("renderTimetable called with", events ? events.length : 0, "events");

        const timetable = document.getElementById('timetable');
        if (!timetable) {
            console.error("Timetable element not found!");
            return;
        }

        // Store events
        this.events = events || [];

        // Clear the timetable
        timetable.innerHTML = '';

        // Display a message if no events
        if (!events || events.length === 0) {
            console.log("No events to display");
            timetable.innerHTML = '<p class="text-gray-500 text-center py-4">No upcoming events found.</p>';

            // Add demo data if in development environment
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log("Adding demo events for development");
                this.events = [
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
                events = this.events;
            } else {
                return; // Exit if no events in production
            }
        }

        try {
            // Create each event element
            events.forEach(event => {
                try {
                    const eventElement = this.createEventElement(event);
                    timetable.appendChild(eventElement);
                } catch (eventError) {
                    console.error("Error rendering event:", eventError, event);
                }
            });

            // Add action buttons
            this.addActionButtons(timetable);
        } catch (error) {
            console.error("Error in renderTimetable:", error);
            timetable.innerHTML = '<p class="text-red-500 text-center py-4">Error displaying timetable. Please try refreshing.</p>';
        }
    }

    /**
     * Create an event element
     * @param {Object} event - Event object
     * @returns {HTMLElement} Event element
     */
    createEventElement(event) {
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

        eventElement.addEventListener('click', () => this.showEventDetails(event));
        return eventElement;
    }

    /**
     * Add action buttons to timetable
     * @param {HTMLElement} container - Timetable container
     */
    addActionButtons(container) {
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
        refreshButton.addEventListener('click', () => this.refreshTimetable());

        actionContainer.appendChild(refreshButton);
        actionContainer.appendChild(printButton);
        container.appendChild(actionContainer);
    }

    /**
     * Show event details and route
     * @param {Object} event - Event object
     */
    showEventDetails(event) {
        // Show the event details in a modal or highlight
        alert(`${event.title}\nLocation: ${event.room ? `${event.room.building} ${event.room.number}` : 'TBA'}\nTime: ${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleTimeString()}\nLecturer: ${event.lecturer || 'N/A'}`);

        // Get route to the room
        if (event.room) {
            this.getRouteToRoom(event.room.number);
        }
    }

    /**
     * Get route to a specific room
     * @param {string} roomNumber - Room number
     */
    getRouteToRoom(roomNumber) {
        // Call the route API to get directions
        const params = new URLSearchParams({
            from: 'kiosk-1', // Assuming the starting position is kiosk-1
            to: roomNumber
        });

        fetch(`/api/route/?${params}`)
            .then(response => response.json())
            .then(routeData => {
                // Notify map module to visualize route
                window.dispatchEvent(new CustomEvent('visualize-route', { detail: routeData }));
            })
            .catch(error => {
                console.error('Error fetching route:', error);
            });
    }

    /**
     * Refresh timetable data
     */
    async refreshTimetable() {
        try {
            // Get token from localStorage
            const authManager = window.authManagerInstance;
            const token = authManager ? authManager.getToken() : localStorage.getItem('access_token');
            
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
                this.renderTimetable(events);
            } else {
                console.error('Failed to refresh timetable');
            }
        } catch (error) {
            console.error('Error refreshing timetable:', error);
        }
    }

    /**
     * Clear timetable
     */
    clearTimetable() {
        const timetable = document.getElementById('timetable');
        if (timetable) {
            timetable.innerHTML = '';
        }
        this.events = [];
    }

    /**
     * Get current events
     * @returns {Array} Current events
     */
    getEvents() {
        return this.events;
    }
}

// Export the Timetable manager instance
window.TimetableManager = TimetableManager;