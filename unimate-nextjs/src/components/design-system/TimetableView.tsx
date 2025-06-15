import { ScrollArea } from "@/components/ui/scroll-area";

interface TimetableEvent {
  id: string;
  name: string;
  time: string;
}

interface TimetableViewProps {
  events: TimetableEvent[];
  selectedDay?: string;
}

const HOURS = [
  '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'
];

export function TimetableView({ events, selectedDay = 'Mon' }: TimetableViewProps) {
  return (
    <div 
      className="w-[312px]"
      style={{
        background: '#282828',
        backdropFilter: 'blur(15.41px)',
        borderRadius: '26px',
        border: '2px solid #ffffff',
        boxShadow: '0px 1.541px 0px 0px rgba(0,0,0,0.05), 0px 6.164px 6.164px 0px rgba(0,0,0,0.05), 0px 15.41px 15.41px 0px rgba(0,0,0,0.1)'
      }}
    >
      <div 
        className="pl-6 pt-[30px] pb-[16px] border-b border-white/10"
        style={{
          fontFamily: '"Geist", sans-serif',
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: 1,
          color: '#ffffff'
        }}
      >
        {selectedDay}
      </div>

      <ScrollArea className="h-[calc(100vh-230px)]">
        <div className="p-[18px]">
          {HOURS.map((hour) => {
            const hourEvents = events.filter(e => e.time === hour);

            return (
              <div key={hour} className="flex gap-3 mb-3">
                <span 
                  className="w-[50px] text-right pt-[6px] text-[14px] text-[#afafaf]"
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontWeight: 400,
                    lineHeight: 1
                  }}
                >
                  {hour}
                </span>
                <div className="flex-1 min-h-[40px]">
                  {hourEvents.map(event => (
                    <div 
                      key={event.id} 
                      className="py-[6px] px-[12px] mb-2 rounded-[8px] bg-[#5872c6] text-white"
                      style={{
                        fontFamily: '"Geist", sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: 1
                      }}
                    >
                      {event.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}