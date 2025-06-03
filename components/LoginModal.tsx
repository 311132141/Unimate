import React, { useState } from 'react';

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(username, password);
      // Clear form on successful login
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{
        background: '#2a2a2a',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '24rem',
        color: '#fff'
      }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          textAlign: 'center',
          color: '#fff'
        }}>
          Login
        </h2>
        
        {error && (
          <div style={{
            color: '#ff5555',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: '#222',
              color: '#fff',
              boxSizing: 'border-box'
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: '#222',
              color: '#fff',
              boxSizing: 'border-box'
            }}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#666' : '#5473e8',
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
            borderTop: '1px solid #444',
            paddingTop: '1rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23888888"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12zM4 0h16v2H4zm0 22h16v2H4zm8-10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.99 0-1.93.21-2.78.58C8.48 11.9 8 12.62 8 13.43V14h8v-.57z"/></svg>')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              verticalAlign: 'middle',
              marginRight: '5px'
            }} />
            Tap your student ID card to log in instantly
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;