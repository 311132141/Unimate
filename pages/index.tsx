import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import LoginModal from '../components/LoginModal'
import EventList from '../components/EventList'
import { useWebSocket } from '../hooks/useWebSocket'

// Dynamically import Map3D to avoid SSR issues with Three.js
const Map3D = dynamic(() => import('../components/Map3D'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff'
    }}>
      Loading 3D Map...
    </div>
  )
})

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)

  // Sample events data - in real app this would come from API
  const techEvents = [
    {
      id: '1',
      title: 'Event 1',
      meta: '2 hours ago · By Mechatronics',
      category: 'Tech Events',
      thumbnail: 'https://picsum.photos/60/60'
    },
    {
      id: '2',
      title: 'URGENT: System Maintenance',
      meta: '2 hours ago · By IT Services',
      category: 'Tech Events',
      isUrgent: true,
      thumbnail: 'https://picsum.photos/60/60'
    },
    {
      id: '3',
      title: 'Event 2',
      meta: '2 hours ago · By Mechatronics',
      category: 'Tech Events',
      thumbnail: 'https://picsum.photos/60/60'
    },
    {
      id: '4',
      title: 'Event 3',
      meta: '2 hours ago · By Mechatronics',
      category: 'Tech Events',
      thumbnail: 'https://picsum.photos/60/60'
    }
  ]

  const techNews = [
    {
      id: '5',
      title: 'Event 4',
      meta: '2 hours ago · By Mechatronics',
      category: 'Tech News',
      thumbnail: 'https://picsum.photos/60/60'
    },
    {
      id: '6',
      title: 'Event 5',
      meta: '2 hours ago · By Mechatronics',
      category: 'Tech News',
      thumbnail: 'https://picsum.photos/60/60'
    },
    {
      id: '7',
      title: 'Event 6',
      meta: '2 hours ago · By Mechatronics',
      category: 'Tech News',
      thumbnail: 'https://picsum.photos/60/60'
    }
  ]

  // WebSocket connection for card scanning
  const { isConnected, connectionError } = useWebSocket(
    `ws://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/ws/unimate/`,
    {
      onMessage: (data) => {
        if (data.type === 'user.login') {
          handleUserLogin(data.message)
        }
      },
      enabled: true
    }
  )

  // Check for existing login on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const username = localStorage.getItem('username')
    if (token && username) {
      setUser({ username, token })
    }
  }, [])

  const handleUserLogin = (userData: any) => {
    // Store authentication data
    if (userData.access) {
      localStorage.setItem('access_token', userData.access)
    }
    if (userData.refresh) {
      localStorage.setItem('refresh_token', userData.refresh)
    }
    if (userData.user && userData.user.username) {
      localStorage.setItem('username', userData.user.username)
      setUser(userData.user)
    }
    
    console.log('User logged in:', userData)
    // In a real app, you might redirect to a dashboard here
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    setUser(null)
  }

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event)
    // In a real app, this would show event details and route visualization
  }

  return (
    <>
      <Head>
        <title>Unimate - University Wayfinding</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.5rem 1rem', 
        backgroundColor: '#1a1a1a', 
        borderBottom: '1px solid #333', 
        color: '#fff',
        position: 'relative',
        zIndex: 1000
      }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Map</h1>
        
        <div style={{ flexGrow: 1, maxWidth: '600px', margin: '0 1rem' }}>
          <input
            type="text"
            placeholder="Find place"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: '#333',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, {user.username}</span>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#ff5555',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            style={{
              backgroundColor: '#5473e8',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Log in
          </button>
        )}
      </header>

      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden',
        height: 'calc(100vh - 80px)',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{
          width: '300px',
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333',
          overflowY: 'auto',
          color: '#fff'
        }}>
          <EventList 
            title="Tech Events" 
            events={techEvents} 
            onEventClick={handleEventClick}
          />
          <EventList 
            title="Tech News" 
            events={techNews} 
            onEventClick={handleEventClick}
          />
        </div>

        <div style={{ 
          flex: 1, 
          height: '100%', 
          backgroundColor: '#222', 
          position: 'relative'
        }}>
          <Map3D />
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleUserLogin}
      />

      {/* Debug info for WebSocket connection */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          zIndex: 9999
        }}>
          WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          {connectionError && <div>Error: {connectionError}</div>}
        </div>
      )}
    </>
  )
}