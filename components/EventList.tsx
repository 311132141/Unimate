import React from 'react';

interface Event {
  id: number;
  title: string;
  meta: string;
  isUrgent?: boolean;
}

interface EventListProps {
  title: string;
  events: Event[];
  className?: string;
}

const EventList: React.FC<EventListProps> = ({ title, events, className = '' }) => {
  return (
    <div className={`sidebar-section ${className}`}>
      <h2 style={{ 
        fontSize: '1.2rem', 
        borderBottom: '1px solid #333', 
        paddingBottom: '0.5rem',
        margin: '0 0 1rem 0',
        color: '#eee'
      }}>
        {title}
      </h2>
      <div style={{ padding: '0' }}>
        {events.map((event) => (
          <div 
            key={event.id}
            style={{ 
              padding: '1rem',
              borderBottom: '1px solid #222',
              cursor: 'pointer',
              color: '#ccc',
              display: 'flex',
              backgroundColor: event.isUrgent ? 'rgba(255, 50, 50, 0.1)' : 'transparent',
              borderLeft: event.isUrgent ? '3px solid #ff5555' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!event.isUrgent) {
                e.currentTarget.style.backgroundColor = '#252525';
              }
            }}
            onMouseLeave={(e) => {
              if (!event.isUrgent) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '500',
                marginBottom: '0.25rem',
                color: '#fff'
              }}>
                {event.title}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#888',
                marginBottom: '0.25rem'
              }}>
                {event.meta}
              </div>
            </div>
            <img 
              src="https://picsum.photos/60/60" 
              alt="Event thumbnail"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginLeft: '10px',
                border: '1px solid #333'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;