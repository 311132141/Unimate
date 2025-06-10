import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EventCardProps {
  category: string;
  title: string;
  time: string;
  organizer: string;
  thumbnail: string;
  onClick?: () => void;
  className?: string;
}

export function EventCard({
  category,
  title,
  time,
  organizer,
  thumbnail,
  onClick,
  className
}: EventCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 bg-card border-0 hover:bg-secondary/50 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">{category}</p>
          <h3 className="text-sm font-medium leading-none">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {time} By {organizer}
          </p>
        </div>
        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </Card>
  );
}