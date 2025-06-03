import React, { useState } from 'react'
import axios from 'axios'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (userData: any) => void
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/login/', {
        username,
        password
      })
      
      // Handle successful login
      onLogin(response.data)
      setUsername('')
      setPassword('')
      onClose()
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.response?.data?.error || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '20vh',
        zIndex: 2000
      }}
      onClick={handleOverlayClick}
    >
      <div style={{
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #333',
        width: '320px',
        color: '#fff'
      }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Login</h2>
        
        {error && (
          <div style={{
            color: '#ff5555',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: '#222',
              color: '#fff'
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: '#222',
              color: '#fff'
            }}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#435ecc' : '#5473e8',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              marginBottom: '1rem'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <div style={{
            textAlign: 'center',
            color: '#888',
            fontSize: '0.9rem',
            marginTop: '1rem',
            borderTop: '1px solid #444',
            paddingTop: '1rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              marginRight: '5px',
              verticalAlign: 'middle'
            }}>🎫</span>
            <span>Tap your student ID card to log in instantly</span>
          </div>
        </form>
      </div>
    </div>
  )
}