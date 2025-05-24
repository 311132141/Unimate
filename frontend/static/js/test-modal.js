// Simple test script to verify modal integration
// This script can be run in the browser console on any page with the modal implementation

function testModalIntegration() {
    console.log('🧪 Testing Modal Integration...');

    // Test data
    const testEvent = {
        "id": 999,
        "title": "Test Event for Modal",
        "event_type": "class",
        "course": { "code": "TEST101", "name": "Modal Testing" },
        "room": { "building": "TEST", "number": "001" },
        "start_time": new Date().toISOString(),
        "end_time": new Date(Date.now() + 3600000).toISOString(),
        "lecturer": "Test Professor",
        "description": "This is a test event to verify modal functionality",
        "is_urgent": false
    };

    // Test 1: Check if modal functions exist
    console.log('1️⃣ Checking modal functions...');
    const functionsExist = {
        showEventDetails: typeof showEventDetails === 'function',
        openEventDetailsModal: typeof openEventDetailsModal === 'function',
        closeEventDetailsModal: typeof closeEventDetailsModal === 'function',
        createEventDetailsModal: typeof createEventDetailsModal === 'function',
        populateEventModal: typeof populateEventModal === 'function'
    };

    console.log('Modal functions:', functionsExist);

    // Test 2: Try to open modal with test event
    console.log('2️⃣ Testing modal with sample event...');
    try {
        showEventDetails(testEvent);
        console.log('✅ Modal opened successfully');

        // Wait a moment then close it
        setTimeout(() => {
            closeEventDetailsModal();
            console.log('✅ Modal closed successfully');
        }, 3000);

    } catch (error) {
        console.error('❌ Error opening modal:', error);
    }

    // Test 3: Check if timetable has event data
    console.log('3️⃣ Checking timetable event data...');
    const timetableItems = document.querySelectorAll('.timetable-item');
    let itemsWithData = 0;
    let totalItems = timetableItems.length;

    timetableItems.forEach((item, index) => {
        if (item.dataset.eventData) {
            itemsWithData++;
            try {
                const eventData = JSON.parse(item.dataset.eventData);
                console.log(`   Item ${index + 1}: ${eventData.title} (${eventData.course?.code})`);
            } catch (e) {
                console.warn(`   Item ${index + 1}: Has data but parsing failed`);
            }
        } else {
            console.warn(`   Item ${index + 1}: No event data found`);
        }
    });

    console.log(`📊 Timetable analysis: ${itemsWithData}/${totalItems} items have event data`);

    // Test 4: Check if CSS is loaded
    console.log('4️⃣ Checking modal CSS...');
    const modalCSS = document.querySelector('style, link[href*="site.css"]');
    console.log('Modal CSS loaded:', !!modalCSS);

    // Summary
    console.log('🏁 Test Summary:');
    console.log(`   Functions: ${Object.values(functionsExist).filter(Boolean).length}/5 available`);
    console.log(`   Timetable data: ${itemsWithData}/${totalItems} items with event data`);
    console.log(`   CSS: ${modalCSS ? 'Loaded' : 'Missing'}`);

    return {
        functions: functionsExist,
        timetableData: { itemsWithData, totalItems },
        cssLoaded: !!modalCSS
    };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Modal Integration Test Script Loaded');
    console.log('Run testModalIntegration() to test the modal system');
}
