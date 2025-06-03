import React, { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import MapContainer from '../components/MapContainer'
import LoginModal from '../components/LoginModal'

const mockEvents = [
  { id: 1, title: 'Event 1', meta: '2 hours ago · By Mechatronics' },
  { id: 2, title: 'URGENT: System Maintenance', meta: '2 hours ago · By IT Services', isUrgent: true },
  { id: 3, title: 'Event 2', meta: '2 hours ago · By Mechatronics' },
  { id: 4, title: 'Event 3', meta: '2 hours ago · By Mechatronics' }
];

const mockNews = [
  { id: 5, title: 'Event 4', meta: '2 hours ago · By Mechatronics' },
  { id: 6, title: 'Event 5', meta: '2 hours ago · By Mechatronics' },
  { id: 7, title: 'Event 6', meta: '2 hours ago · By Mechatronics' }
];

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    // Mock login - in real implementation, this would call the Django API
    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // Close modal and redirect
        setShowLoginModal(false);
        window.location.href = '/dashboard';
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  return (
    <>
      <Head>
        <title>Unimate - University Wayfinding</title>
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
        <Header onLoginClick={() => setShowLoginModal(true)} />

        <div style={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden',
          height: 'calc(100vh - 80px)'
        }}>
          <Sidebar events={mockEvents} news={mockNews} />
          <MapContainer />
        </div>

        <LoginModal
          isVisible={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </div>
    </>
  )
}