'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TimetableItem } from '@/components/features/timetable/TimetableItem';
import { EventDetailsModal } from '@/components/features/timetable/EventDetailsModal';
import type { Event } from '@/types/models';

// TODO: Replace with actual API call
const mockEvents: Event[] = [
    {
        id: '1',
        title: 'ENGGEN205 Lecture',
        event_type: 'class',
        course: { id: '1', code: 'ENGGEN205', name: 'Engineering Mechanics' },
        room: { id: '1', building: 'ENG', number: '340' },
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        lecturer: 'Dr. Smith',
        is_urgent: false,
    },
    {
        id: '2',
        title: 'STATS100 Mid-term Exam',
        event_type: 'exam',
        course: { id: '2', code: 'STATS100', name: 'Statistics' },
        room: { id: '2', building: 'ENG', number: '401' },
        start_time: new Date(Date.now() + 86400000).toISOString(),
        end_time: new Date(Date.now() + 86400000 + 7200000).toISOString(),
        lecturer: 'N/A',
        is_urgent: true,
    },
];

export default function DashboardPage() {
    const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Timetable</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockEvents.map((event) => (
                            <TimetableItem
                                key={event.id}
                                event={event}
                                onClick={() => handleEventClick(event)}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Campus Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[400px] items-center justify-center rounded-lg bg-dark-tertiary">
                        <p className="text-muted-foreground">
                            3D Map will be implemented in Phase 3
                        </p>
                    </div>
                </CardContent>
            </Card>      <EventDetailsModal
                event={selectedEvent}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
