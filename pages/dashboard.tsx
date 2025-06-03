import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import EventList from '../components/EventList'
import MapContainer from '../components/MapContainer'

interface TimetableEvent {
  id: number;
  title: string;
  event_type: 'class' | 'exam';
  course?: { code: string; name: string };
  room?: { building: string; number: string };
  start_time: string;
  end_time: string;
  lecturer?: string;
  is_urgent?: boolean;
}

const mockTimetableEvents: TimetableEvent[] = [
  {
    id: 1,
    title: "ENGGEN205 Lecture",
    event_type: "class",
    course: { code: "ENGGEN205", name: "Engineering Mechanics" },
    room: { building: "ENG", number: "340" },
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    lecturer: "Dr. Smith",
    is_urgent: false
  },
  {
    id: 2,
    title: "STATS100 Mid-term Exam",
    event_type: "exam",
    course: { code: "STATS100", name: "Statistics" },
    room: { building: "ENG", number: "401" },
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 86400000 + 7200000).toISOString(),
    lecturer: "N/A",
    is_urgent: true
  }
];

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<string>('Demo User');
  const [events, setEvents] = useState<TimetableEvent[]>(mockTimetableEvents);
  const [currentView, setCurrentView] = useState<'dashboard' | 'timetable' | 'map'>('dashboard');

  useEffect(() => {
    // Check authentication and load user data
    const token = localStorage?.getItem('access_token');
    const username = localStorage?.getItem('username');
    
    if (username) {
      setUser(username);
    }

    if (token) {
      // Load real timetable data from API
      // This is where you'd make the API call to fetch user's timetable
      console.log('Loading timetable for authenticated user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const formatEventForDisplay = (event: TimetableEvent) => {
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    const courseCode = event.course?.code || 'N/A';
    const roomInfo = event.room ? `${event.room.building} ${event.room.number}` : 'TBA';
    
    return {
      id: event.id,
      title: event.title,
      meta: `${courseCode} - ${roomInfo} | ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
      isUrgent: event.is_urgent
    };
  };

  const handleLogin = async () => {
    // For dashboard, this would typically redirect to login
    window.location.href = '/';
  };

  return (
    <>
      <Head>
        <title>Unimate - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Header with user info */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0.5rem 1rem', 
          backgroundColor: '#1a1a1a', 
          borderBottom: '1px solid #333', 
          color: '#fff' 
        }}>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Dashboard</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#ccc' }}>Welcome, {user}</span>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Navigation tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#222',
          borderBottom: '1px solid #333'
        }}>
          {['dashboard', 'timetable', 'map'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view as any)}
              style={{
                padding: '1rem 2rem',
                backgroundColor: currentView === view ? '#333' : 'transparent',
                color: currentView === view ? '#fff' : '#888',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden'
        }}>
          {currentView === 'dashboard' && (
            <>
              <div style={{
                width: '400px',
                backgroundColor: '#1a1a1a',
                borderRight: '1px solid #333',
                padding: '1rem',
                overflowY: 'auto'
              }}>
                <EventList 
                  title="Your Timetable" 
                  events={events.map(formatEventForDisplay)} 
                />
              </div>
              <MapContainer isThreeJsEnabled={true} />
            </>
          )}

          {currentView === 'timetable' && (
            <div style={{
              flex: 1,
              padding: '2rem',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginBottom: '2rem' }}>Full Timetable View</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {events.map((event) => {
                  const startTime = new Date(event.start_time);
                  const endTime = new Date(event.end_time);
                  const courseCode = event.course?.code || 'N/A';
                  const roomInfo = event.room ? `${event.room.building} ${event.room.number}` : 'TBA';
                  
                  return (
                    <div
                      key={event.id}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#222',
                        borderRadius: '8px',
                        border: event.is_urgent ? '2px solid #ff5555' : '1px solid #333'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>
                            {event.title}
                            {event.is_urgent && (
                              <span style={{
                                marginLeft: '0.5rem',
                                backgroundColor: '#ff5555',
                                color: '#fff',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                              }}>
                                URGENT
                              </span>
                            )}
                          </h3>
                          <p style={{ margin: '0 0 0.5rem 0', color: '#ccc' }}>
                            {courseCode} - {roomInfo}
                          </p>
                          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                            {startTime.toLocaleDateString()} • {startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: '#ccc' }}>
                            {event.lecturer || 'No lecturer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'map' && (
            <MapContainer isThreeJsEnabled={true} />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;