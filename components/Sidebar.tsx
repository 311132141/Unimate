import React from 'react';

interface Event {
  id: number;
  title: string;
  meta: string;
  isUrgent?: boolean;
}

interface SidebarProps {
  events: Event[];
  news: Event[];
}

const Sidebar: React.FC<SidebarProps> = ({ events, news }) => {
  const renderEventItem = (event: Event) => (
    <div 
      key={event.id}
      style={{ 
        marginBottom: '1rem', 
        padding: '1rem', 
        backgroundColor: event.isUrgent ? 'rgba(255, 50, 50, 0.1)' : '#252525', 
        borderLeft: event.isUrgent ? '3px solid #ff5555' : 'none',
        borderRadius: '4px' 
      }}
    >
      <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{event.title}</div>
      <div style={{ fontSize: '0.8rem', color: '#888' }}>{event.meta}</div>
    </div>
  );

  return (
    <div style={{
      width: '300px',
      backgroundColor: '#1a1a1a',
      borderRight: '1px solid #333',
      padding: '1rem',
      overflowY: 'auto',
      color: '#fff'
    }}>
      <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
        Tech Events
      </h2>
      <div style={{ padding: '1rem 0' }}>
        {events.map(renderEventItem)}
      </div>
      
      <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
        Tech News
      </h2>
      <div style={{ padding: '1rem 0' }}>
        {news.map(renderEventItem)}
      </div>
    </div>
  );
};

export default Sidebar;