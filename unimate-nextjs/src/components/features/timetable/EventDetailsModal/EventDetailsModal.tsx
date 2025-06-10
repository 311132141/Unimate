import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalFooter,
} from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Navigation } from 'lucide-react';
import type { Event } from '@/types/models';

export interface EventDetailsModalProps {
    event: Event | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
    event,
    open,
    onOpenChange,
}) => {
    const router = useRouter();

    if (!event) return null;

    const handleNavigate = () => {
        if (event.room?.building) {
            router.push(`/dashboard/map?building=${event.room.building}`);
            onOpenChange(false);
        }
    };

    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);

    const formatDateTime = (date: Date) => {
        return date.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent className="sm:max-w-lg">
                <ModalHeader>
                    <ModalTitle className="flex items-center gap-2">
                        {event.title}
                        {event.is_urgent && <Badge variant="urgent">URGENT</Badge>}
                    </ModalTitle>
                    <Badge
                        variant={event.event_type === 'exam' ? 'exam' : 'class'}
                        className="mt-2 w-fit"
                    >
                        {event.event_type.toUpperCase()}
                    </Badge>
                </ModalHeader>

                <div className="space-y-4">
                    <div>
                        <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                            Course
                        </h4>
                        <p>
                            {event.course
                                ? `${event.course.code} - ${event.course.name}`
                                : 'N/A'}
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                            Location
                        </h4>
                        <p>
                            {event.room
                                ? `${event.room.building} ${event.room.number}`
                                : 'TBA'}
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                            Time
                        </h4>
                        <p>{formatDateTime(startTime)}</p>
                        <p className="text-sm text-muted-foreground">
                            to {formatDateTime(endTime)}
                        </p>
                    </div>

                    {event.lecturer && (
                        <div>
                            <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                                Lecturer
                            </h4>
                            <p>{event.lecturer}</p>
                        </div>
                    )}

                    {event.description && (
                        <div>
                            <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                                Description
                            </h4>
                            <p className="text-sm">{event.description}</p>
                        </div>
                    )}
                </div>

                <ModalFooter>
                    {event.room && (
                        <Button onClick={handleNavigate}>
                            <Navigation className="mr-2 h-4 w-4" />
                            Navigate
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export { EventDetailsModal };
