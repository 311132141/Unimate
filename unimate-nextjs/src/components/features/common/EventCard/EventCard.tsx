import * as React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface EventCardProps {
    title: string;
    category: string;
    time: string;
    organizer: string;
    thumbnail?: string;
    onClick?: () => void;
    className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
    title,
    category,
    time,
    organizer,
    thumbnail,
    onClick,
    className,
}) => {
    return (
        <Card
            className={cn(
                'cursor-pointer border-b border-dark-border p-4 transition-colors hover:bg-dark-secondary',
                className
            )}
            onClick={onClick}
        >
            <div className="flex gap-4">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-xs text-muted-foreground">
                        {time} · By {organizer}
                    </p>
                </div>
                {thumbnail && (
                    <div className="relative h-[60px] w-[60px] overflow-hidden rounded">
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export { EventCard };
