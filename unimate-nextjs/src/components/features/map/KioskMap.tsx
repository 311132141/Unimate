'use client';

import { useState } from 'react';

interface MapMarker {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  type: 'building' | 'poi' | 'event';
  name: string;
  color?: string;
}

interface KioskMapProps {
  className?: string;
}

// Mock data positioned as percentages for campus layout
const mockMarkers: MapMarker[] = [
  { id: '1', x: 25, y: 30, type: 'building', name: 'WZ Building', color: '#FF6B9D' },
  { id: '2', x: 45, y: 25, type: 'building', name: 'WS Building', color: '#FF6B9D' },
  { id: '3', x: 65, y: 35, type: 'building', name: 'WA Building', color: '#C44569' },
  { id: '4', x: 35, y: 50, type: 'poi', name: 'Student Hub', color: '#FF6B9D' },
  { id: '5', x: 55, y: 45, type: 'event', name: 'Tech Event Location', color: '#9B59B6' },
  { id: '6', x: 20, y: 60, type: 'building', name: 'Library', color: '#FF6B9D' },
  { id: '7', x: 75, y: 55, type: 'poi', name: 'Cafeteria', color: '#E74C3C' },
  { id: '8', x: 40, y: 70, type: 'building', name: 'Engineering', color: '#C44569' },
];

export function KioskMap({ className }: KioskMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <div 
      className={`${className} relative overflow-hidden cursor-grab active:cursor-grabbing`}
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '816px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)',
      }}
    >
      {/* Map Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Road Network - Dark theme as per Figma */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1082 816"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Main roads */}
        <path d="M 0 200 L 1082 250" stroke="#38414e" strokeWidth="12" opacity="0.8" />
        <path d="M 0 400 L 1082 420" stroke="#38414e" strokeWidth="8" opacity="0.7" />
        <path d="M 0 600 L 1082 580" stroke="#38414e" strokeWidth="10" opacity="0.8" />
        <path d="M 200 0 L 220 816" stroke="#38414e" strokeWidth="8" opacity="0.7" />
        <path d="M 500 0 L 480 816" stroke="#38414e" strokeWidth="12" opacity="0.8" />
        <path d="M 800 0 L 820 816" stroke="#38414e" strokeWidth="8" opacity="0.7" />
        
        {/* Secondary roads */}
        <path d="M 100 100 L 300 150" stroke="#2a3441" strokeWidth="6" opacity="0.6" />
        <path d="M 600 300 L 900 280" stroke="#2a3441" strokeWidth="6" opacity="0.6" />
        <path d="M 150 500 L 400 520" stroke="#2a3441" strokeWidth="5" opacity="0.6" />
        
        {/* Green walking paths - exactly as shown in Figma */}
        <path d="M 200 300 Q 350 250 500 320 T 800 350" stroke="#4ECDC4" strokeWidth="4" fill="none" opacity="0.9" />
        <path d="M 150 500 Q 300 450 450 500 T 750 520" stroke="#4ECDC4" strokeWidth="4" fill="none" opacity="0.9" />
        <path d="M 300 150 Q 400 200 500 180 T 700 200" stroke="#4ECDC4" strokeWidth="3" fill="none" opacity="0.8" />
        
        {/* Curved paths for more realistic campus feel */}
        <path d="M 100 700 Q 300 650 500 680 Q 700 710 900 690" stroke="#4ECDC4" strokeWidth="3" fill="none" opacity="0.8" />
      </svg>

      {/* Building Areas - Dark gray blocks as seen in Figma */}
      <div className="absolute top-[15%] left-[20%] w-20 h-16 bg-[#2a2a2a] opacity-70 rounded shadow-lg"></div>
      <div className="absolute top-[20%] left-[40%] w-24 h-20 bg-[#2a2a2a] opacity-70 rounded shadow-lg"></div>
      <div className="absolute top-[30%] left-[60%] w-28 h-18 bg-[#2a2a2a] opacity-70 rounded shadow-lg"></div>
      <div className="absolute top-[45%] left-[30%] w-32 h-24 bg-[#2a2a2a] opacity-70 rounded shadow-lg"></div>
      <div className="absolute top-[55%] left-[15%] w-26 h-22 bg-[#2a2a2a] opacity-70 rounded shadow-lg"></div>
      <div className="absolute top-[50%] left-[70%] w-20 h-16 bg-[#2a2a2a] opacity-70 rounded shadow-lg"></div>
      <div className="absolute top-[65%] left-[35%] w-30 h-20 bg-[#2a2a2a] opacity-70 rounded shadow-lg"></div>

      {/* Green spaces/parks */}
      <div className="absolute top-[25%] right-[10%] w-16 h-12 bg-[#263c3f] opacity-60 rounded-full"></div>
      <div className="absolute bottom-[30%] left-[10%] w-20 h-16 bg-[263c3f] opacity-60 rounded-full"></div>

      {/* Map Markers - Pink/purple dots as per Figma */}
      {mockMarkers.map(marker => (
        <div
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            zIndex: selectedMarker === marker.id ? 20 : 10,
          }}
          title={marker.name}
          onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
          onMouseEnter={() => setHoveredMarker(marker.id)}
          onMouseLeave={() => setHoveredMarker(null)}
        >
          <div 
            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
              selectedMarker === marker.id ? 'animate-pulse scale-125' : 
              hoveredMarker === marker.id ? 'animate-pulse' : ''
            }`}
            style={{ backgroundColor: marker.color }}
          />
          {/* Marker label on hover */}
          {hoveredMarker === marker.id && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {marker.name}
            </div>
          )}
        </div>
      ))}

      {/* Campus Area Labels */}
      <div className="absolute top-[10%] left-[10%] text-white/60 text-sm font-medium">
        City Campus North
      </div>
      <div className="absolute bottom-[20%] right-[15%] text-white/60 text-sm font-medium">
        City Campus South
      </div>
      <div className="absolute top-[40%] left-[5%] text-white/50 text-xs">
        Wellesley St
      </div>
      <div className="absolute bottom-[40%] right-[5%] text-white/50 text-xs">
        Mayoral Dr
      </div>
      
      {/* Interactive Legend - matching Figma design */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="text-white text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF6B9D] border border-white/50"></div>
            <span>Buildings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#9B59B6] border border-white/50"></div>
            <span>Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#4ECDC4] rounded"></div>
            <span>Walking Paths</span>
          </div>
        </div>
      </div>

      {/* Current Location Indicator */}
      <div className="absolute bottom-4 left-4 bg-blue-500/20 backdrop-blur-sm rounded-lg p-2 border border-blue-500/50">
        <div className="text-blue-300 text-xs flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>You are here</span>
        </div>
      </div>
    </div>
  );
}