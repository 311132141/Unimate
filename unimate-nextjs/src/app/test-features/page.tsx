'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/features/common/EventCard';
import { TimetableItem } from '@/components/features/timetable/TimetableItem';
import { EventDetailsModal } from '@/components/features/timetable/EventDetailsModal';
import type { Event } from '@/types/models';

// Mock data for testing
const mockEvent: Event = {
    id: '1',
    title: 'Advanced Software Engineering',
    event_type: 'class',
    start_time: '2025-06-10T09:00:00Z',
    end_time: '2025-06-10T11:00:00Z',
    course: {
        id: '1',
        code: 'CS401',
        name: 'Advanced Software Engineering',
        description: 'Advanced concepts in software engineering',
        credits: 3,
    },
    room: {
        id: '1',
        number: '101',
        building: 'Engineering Building',
        capacity: 50,
    },
    lecturer: 'Dr. Smith',
    description: 'Introduction to advanced software engineering concepts',
    is_urgent: false,
};

const mockUrgentEvent: Event = {
    ...mockEvent,
    id: '2',
    title: 'Database Systems Exam',
    event_type: 'exam',
    start_time: '2025-06-11T14:00:00Z',
    end_time: '2025-06-11T16:00:00Z',
    course: {
        id: '2',
        code: 'CS301',
        name: 'Database Systems',
        description: 'Database design and implementation',
        credits: 3,
    },
    room: {
        id: '2',
        number: '205',
        building: 'Computer Science Building',
        capacity: 100,
    },
    lecturer: 'Prof. Johnson',
    description: 'Final exam covering all course material',
    is_urgent: true,
};

export default function TestFeatureComponentsPage() {
    const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleEventCardClick = () => {
        console.log('EventCard clicked!');
        alert('EventCard clicked! This would typically navigate to event details.');
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">Feature Components Test</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* EventCard Component */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">EventCard Component</h2>
                        <div className="space-y-4">
                            <EventCard
                                title="Student Workshop: React Best Practices"
                                category="Workshop"
                                time="Today 2:00 PM"
                                organizer="Computer Science Club"
                                thumbnail="/images/workshop-thumbnail.jpg"
                                onClick={handleEventCardClick}
                            />

                            <EventCard
                                title="Career Fair 2025"
                                category="Career Event"
                                time="Tomorrow 10:00 AM"
                                organizer="Career Services"
                                onClick={handleEventCardClick}
                            />

                            <EventCard
                                title="Research Symposium"
                                category="Academic"
                                time="June 15, 9:00 AM"
                                organizer="Research Department"
                                thumbnail="/images/research-thumbnail.jpg"
                                onClick={handleEventCardClick}
                            />
                        </div>
                    </div>

                    {/* TimetableItem Component */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">TimetableItem Component</h2>
                        <div className="space-y-4">
                            <TimetableItem
                                event={mockEvent}
                                onClick={() => handleEventClick(mockEvent)}
                            />

                            <TimetableItem
                                event={mockUrgentEvent}
                                onClick={() => handleEventClick(mockUrgentEvent)}
                            />
                            <TimetableItem
                                event={{
                                    ...mockEvent,
                                    id: '3',
                                    title: 'Mathematics Lecture',
                                    course: {
                                        id: '3',
                                        code: 'MATH201',
                                        name: 'Calculus II',
                                        description: 'Advanced calculus concepts',
                                        credits: 4,
                                    },
                                    room: undefined, // No room assigned
                                    lecturer: 'Dr. Williams',
                                }}
                                onClick={() => handleEventClick(mockEvent)}
                            />
                        </div>
                    </div>
                </div>

                {/* EventDetailsModal Component */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">EventDetailsModal Component</h2>
                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-4">
                            Click on any TimetableItem above to see the EventDetailsModal in action.
                        </p>
                        <div className="space-x-4">
                            <Button onClick={() => handleEventClick(mockEvent)}>
                                Show Regular Event Details
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleEventClick(mockUrgentEvent)}
                            >
                                Show Urgent Event Details
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Component Features Summary */}
                <div className="mt-8 p-6 bg-muted rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Component Features Implemented</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium mb-2">EventCard</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Event title and category</li>
                                <li>• Time and organizer info</li>
                                <li>• Optional thumbnail image</li>
                                <li>• Click handler support</li>
                                <li>• Responsive design</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">TimetableItem</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Event type styling</li>
                                <li>• Urgent badge support</li>
                                <li>• Navigation integration</li>
                                <li>• Course and room info</li>
                                <li>• Time formatting</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">EventDetailsModal</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Full event details</li>
                                <li>• Modal integration</li>
                                <li>• Navigation button</li>
                                <li>• Conditional rendering</li>
                                <li>• Accessibility support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* EventDetailsModal */}
            <EventDetailsModal
                event={selectedEvent}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
