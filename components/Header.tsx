import React from 'react';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  return (
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
      
      <button 
        onClick={onLoginClick}
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
    </header>
  );
};

export default Header;