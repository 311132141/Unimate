import React, { useEffect, useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Testing...')
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    // Test API connectivity
    const testApi = async () => {
      try {
        const response = await fetch('/api')
        if (response.ok) {
          const data = await response.json()
          setApiData(data)
          setApiStatus('✅ API Connected')
        } else {
          setApiStatus(`❌ API Error: ${response.status}`)
        }
      } catch (error) {
        setApiStatus(`❌ API Error: ${error.message}`)
      }
    }

    testApi()
  }, [])
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
        color: '#fff' 
      }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Map</h1>
        
        <div style={{ flexGrow: 1, maxWidth: '600px', margin: '0 1rem' }}>
          <input
            type="text"
            placeholder="Find place"
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
        
        <button style={{
          backgroundColor: '#5473e8',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1.5rem',
          borderRadius: '50px',
          cursor: 'pointer',
          fontWeight: '500'
        }}>
          Log in
        </button>
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
          padding: '1rem',
          overflowY: 'auto',
          color: '#fff'
        }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
            Tech Events
          </h2>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#252525', borderRadius: '4px' }}>
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Event 1</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>2 hours ago · By Mechatronics</div>
            </div>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 50, 50, 0.1)', borderLeft: '3px solid #ff5555', borderRadius: '4px' }}>
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>URGENT: System Maintenance</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>2 hours ago · By IT Services</div>
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
            Tech News
          </h2>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#252525', borderRadius: '4px' }}>
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Event 4</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>2 hours ago · By Mechatronics</div>
            </div>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          height: '100%', 
          backgroundColor: '#222', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2>🎯 Next.js Migration Complete!</h2>
            <p>This page has been successfully converted from pure HTML/CSS/JS to Next.js</p>
            <p>✅ Same visual design and layout</p>
            <p>✅ React components and TypeScript</p>
            <p>✅ Compatible with existing Django backend</p>
            <p>✅ Ready for 3D map integration with Three.js</p>
            
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#333', borderRadius: '8px', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>API Status:</strong> {apiStatus}
              </div>
              {apiData && (
                <div>
                  <strong>Available Endpoints:</strong>
                  <ul style={{ textAlign: 'left', margin: '0.5rem 0', padding: '0 1rem' }}>
                    {Object.entries(apiData).map(([key, value]) => (
                      <li key={key}>{key}: {typeof value === 'string' ? value : JSON.stringify(value)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
              Original map container area - Three.js 3D map will render here
            </div>
          </div>
        </div>
      </div>
    </>
  )
}