import React from 'react'

interface Event {
  id: string
  title: string
  meta: string
  category: string
  isUrgent?: boolean
  thumbnail?: string
}

interface EventListProps {
  title: string
  events: Event[]
  onEventClick?: (event: Event) => void
}

export default function EventList({ title, events, onEventClick }: EventListProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2 style={{
        fontSize: '1.2rem',
        margin: 0,
        padding: '1rem',
        borderBottom: '1px solid #333',
        color: '#eee'
      }}>
        {title}
      </h2>
      
      <div style={{ padding: 0 }}>
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick?.(event)}
            style={{
              padding: '1rem',
              borderBottom: '1px solid #222',
              cursor: onEventClick ? 'pointer' : 'default',
              color: '#ccc',
              display: 'flex',
              backgroundColor: event.isUrgent ? 'rgba(255, 50, 50, 0.1)' : 'transparent',
              borderLeft: event.isUrgent ? '3px solid #ff5555' : 'none'
            }}
            onMouseEnter={(e) => {
              if (onEventClick) {
                e.currentTarget.style.backgroundColor = event.isUrgent 
                  ? 'rgba(255, 50, 50, 0.2)' 
                  : '#252525'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = event.isUrgent 
                ? 'rgba(255, 50, 50, 0.1)' 
                : 'transparent'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#888',
                marginBottom: '0.25rem'
              }}>
                {event.category}
              </div>
              
              <div style={{
                fontWeight: '500',
                marginBottom: '0.25rem',
                color: '#fff'
              }}>
                {event.title}
              </div>
              
              <div style={{
                fontSize: '0.8rem',
                color: '#888'
              }}>
                {event.meta}
              </div>
            </div>
            
            {event.thumbnail && (
              <img
                src={event.thumbnail}
                alt="Event thumbnail"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  marginLeft: '1rem'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}