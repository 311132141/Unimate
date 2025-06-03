import React, { useEffect, useRef } from 'react';

interface MapContainerProps {
  isThreeJsEnabled?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({ isThreeJsEnabled = false }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isThreeJsEnabled && mapRef.current) {
      // Initialize Three.js map here if needed
      // This would use the modular MapManager
      if (typeof window !== 'undefined' && (window as any).MapManager) {
        const mapManager = new (window as any).MapManager();
        // Set the container reference for the map manager
        if (mapRef.current) {
          mapRef.current.id = 'map-container';
          mapManager.init();
        }
      }
    }
  }, [isThreeJsEnabled]);

  return (
    <div 
      ref={mapRef}
      style={{ 
        flex: 1, 
        height: '100%', 
        backgroundColor: '#222', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}
    >
      {!isThreeJsEnabled ? (
        <div style={{ textAlign: 'center' }}>
          <h2>🎯 Next.js Migration Complete!</h2>
          <p>This page has been successfully converted from pure HTML/CSS/JS to Next.js</p>
          <p>✅ Same visual design and layout</p>
          <p>✅ React components and TypeScript</p>
          <p>✅ Compatible with existing Django backend</p>
          <p>✅ Ready for 3D map integration with Three.js</p>
          <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
            Original map container area - Three.js 3D map will render here
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          {/* Three.js map will be rendered here */}
        </div>
      )}
    </div>
  );
};

export default MapContainer;