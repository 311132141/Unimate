import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/Button";

interface TimetableEvent {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color?: string;
}

interface TimetableViewProps {
  events: TimetableEvent[];
  selectedDay?: string;
  onDaySelect?: (day: string) => void;
}

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7;
  return hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
});

export function TimetableView({ events, selectedDay = 'Mon' }: TimetableViewProps) {
  return (
    <Card className="border-0 bg-card/50 backdrop-blur h-full">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-muted-foreground">{selectedDay}</h3>
        </div>
        
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {HOURS.map((hour, index) => {
              const hourEvents = events.filter(event => {
                const eventHour = parseInt(event.startTime.split(' ')[0]);
                const currentHour = index + 7;
                return eventHour === currentHour;
              });

              return (
                <div key={hour} className="flex items-start gap-4 min-h-[60px]">
                  <span className="text-xs text-muted-foreground w-12 text-right pt-2">
                    {hour}
                  </span>
                  <div className="flex-1">
                    {hourEvents.map(event => (
                      <Button
                        key={event.id}
                        variant="default"
                        className="w-full justify-start text-left h-auto py-3 mb-1"
                      >
                        {event.name}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}