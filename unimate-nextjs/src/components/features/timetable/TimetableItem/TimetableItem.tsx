import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Navigation } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Event } from '@/types/models';

export interface TimetableItemProps {
    event: Event;
    onClick?: () => void;
    className?: string;
}

const TimetableItem: React.FC<TimetableItemProps> = ({
    event,
    onClick,
    className,
}) => {
    const router = useRouter();

    const handleNavigate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (event.room?.building) {
            // Navigate to map with building selected
            router.push(`/dashboard/map?building=${event.room.building}`);
        }
    };

    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card
            className={cn(
                'cursor-pointer border-l-4 p-4 transition-colors hover:bg-dark-secondary',
                event.event_type === 'exam'
                    ? 'border-l-event-exam'
                    : 'border-l-event-class',
                event.is_urgent && 'border border-event-urgent',
                className
            )}
            onClick={onClick}
        >
            <div className="space-y-2">
                <div className="flex items-start justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    {event.is_urgent && (
                        <Badge variant="urgent" className="ml-2">
                            URGENT
                        </Badge>
                    )}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                        {event.course?.code || 'N/A'} -{' '}
                        {event.room
                            ? `${event.room.building} ${event.room.number}`
                            : 'TBA'}
                    </p>
                    <p>
                        {formatTime(startTime)} - {formatTime(endTime)}
                    </p>
                </div>

                {event.room && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleNavigate}
                        className="mt-2"
                    >
                        <Navigation className="mr-2 h-3 w-3" />
                        Navigate
                    </Button>
                )}
            </div>
        </Card>
    );
};

export { TimetableItem };
