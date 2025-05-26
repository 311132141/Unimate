'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Room {
  building: string
  number: string
}

interface MapContainerProps {
  currentRoute?: {
    from: string
    to: string
    path: Array<{ x: number; y: number; z: number }>
  } | null
  targetRoom?: Room | null
  onClearRoute?: () => void
}

export function MapContainer({ 
  currentRoute, 
  targetRoom, 
  onClearRoute 
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showEmbedded, setShowEmbedded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const toggleMapView = () => {
    setShowEmbedded(!showEmbedded)
  }

  return (
    <div className="h-full w-full bg-gray-100 relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            <MapPin className="h-3 w-3 mr-1" />
            University Map
          </Badge>
          {targetRoom && (
            <Badge className="bg-blue-500 text-white">
              {targetRoom.building} {targetRoom.number}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMapView}
            className="bg-white/90 hover:bg-white"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {showEmbedded ? '3D View' : 'Map View'}
          </Button>
          
          {currentRoute && onClearRoute && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearRoute}
              className="bg-white/90 hover:bg-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Route
            </Button>
          )}
        </div>
      </div>

      {/* Map Content */}
      {!mapLoaded ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : showEmbedded ? (
        /* Embedded Google Maps View */
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5587.867820291437!2d174.76568619358058!3d-36.85292772229561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d47fb5a9ce6fb%3A0x500ef6143a29917!2sThe%20University%20of%20Auckland!5e0!3m2!1sen!2snz!4v1593482149224!5m2!1sen!2snz"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="University of Auckland Map"
        />
      ) : (
        /* 3D Campus Map Placeholder */
        <div 
          ref={containerRef}
          className="h-full w-full relative bg-gradient-to-br from-green-50 to-blue-50"
        >
          {/* Campus Buildings (Simplified Visual) */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Main Building */}
            <div className="absolute top-1/4 left-1/4 w-20 h-16 bg-gray-300 rounded shadow-lg transform -rotate-12">
              <div className="p-2 text-xs font-semibold text-center text-gray-700">
                Engineering
              </div>
            </div>
            
            {/* Library */}
            <div className="absolute top-1/3 right-1/4 w-16 h-20 bg-blue-300 rounded shadow-lg transform rotate-6">
              <div className="p-2 text-xs font-semibold text-center text-gray-700">
                Library
              </div>
            </div>
            
            {/* Student Center */}
            <div className="absolute bottom-1/3 left-1/3 w-18 h-14 bg-red-300 rounded shadow-lg">
              <div className="p-2 text-xs font-semibold text-center text-gray-700">
                Student Center
              </div>
            </div>
            
            {/* Science Building */}
            <div className="absolute top-1/2 left-1/2 w-22 h-18 bg-purple-300 rounded shadow-lg transform -rotate-3">
              <div className="p-2 text-xs font-semibold text-center text-gray-700">
                Science
              </div>
            </div>

            {/* Kiosk Location */}
            <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-green-500 rounded-full shadow-lg animate-pulse">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-green-700 whitespace-nowrap">
                You are here
              </div>
            </div>
            
            {/* Target Room Marker */}
            {targetRoom && (
              <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-red-500 rounded-full shadow-lg animate-bounce">
                <MapPin className="h-4 w-4 text-white m-1" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-red-700 whitespace-nowrap">
                  {targetRoom.building} {targetRoom.number}
                </div>
              </div>
            )}
            
            {/* Route Path */}
            {currentRoute && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#ef4444"
                    />
                  </marker>
                </defs>
                <path
                  d="M 75% 75% Q 50% 50% 25% 25%"
                  stroke="#ef4444"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Campus Grounds */}
            <div className="absolute top-1/3 right-1/2 w-32 h-24 bg-green-200 rounded-full opacity-50">
              <div className="flex items-center justify-center h-full text-xs text-green-700 font-semibold">
                Campus Green
              </div>
            </div>
            
            {/* Parking Areas */}
            <div className="absolute bottom-1/5 left-1/5 w-16 h-12 bg-gray-400 rounded opacity-75">
              <div className="flex items-center justify-center h-full text-xs text-gray-700 font-semibold">
                Parking
              </div>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={() => {
                // Simulate zoom in
                if (containerRef.current) {
                  containerRef.current.style.transform = 'scale(1.2)'
                }
              }}
            >
              +
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={() => {
                // Simulate zoom out
                if (containerRef.current) {
                  containerRef.current.style.transform = 'scale(1)'
                }
              }}
            >
              -
            </Button>
          </div>
        </div>
      )}

      {/* Route Information */}
      {currentRoute && (
        <div className="absolute bottom-4 left-4 bg-white/95 rounded-lg p-3 shadow-lg max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-sm">Route Information</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>From: <span className="font-medium">{currentRoute.from}</span></p>
            <p>To: <span className="font-medium">{currentRoute.to}</span></p>
            <p className="text-xs mt-1 text-blue-600">
              Follow the red dashed line to reach your destination
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
}

export function MapContainer({ events, selectedEvent, onEventSelect, className }: MapContainerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Sample building/room locations (in a real app, this would come from a database)
  const locations: Record<string, MapLocation> = {
    'Engineering Building': {
      building: 'Engineering Building',
      coordinates: { x: 200, y: 150 }
    },
    'Science Building': {
      building: 'Science Building',
      coordinates: { x: 400, y: 200 }
    },
    'Library': {
      building: 'Library',
      coordinates: { x: 300, y: 100 }
    },
    'Student Center': {
      building: 'Student Center',
      coordinates: { x: 150, y: 300 }
    },
    'Arts Building': {
      building: 'Arts Building',
      coordinates: { x: 450, y: 350 }
    }
  };

  // Get events with known locations
  const eventsWithLocations = events.filter(event => 
    event.room && locations[event.room.building]
  );

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getEventStatusColor = (event: Event) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    
    if (now >= start && now <= end) return 'bg-green-500'; // Ongoing
    if (now < start) return 'bg-blue-500'; // Upcoming
    return 'bg-gray-400'; // Past
  };

  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      {/* Map Controls */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Campus Map
          </h3>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {selectedEvent && selectedEvent.room && (
          <div className="mt-2 text-sm text-blue-600">
            Showing: {selectedEvent.room.building} - Room {selectedEvent.room.number}
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div 
        className="relative h-96 bg-green-50 overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 transform-gpu"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Campus Background */}
          <svg 
            width="600" 
            height="400" 
            className="absolute inset-0"
            style={{ minWidth: '600px', minHeight: '400px' }}
          >
            {/* Campus paths */}
            <path
              d="M50 200 Q300 150 550 200"
              stroke="#8B7355"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M200 50 Q250 200 200 350"
              stroke="#8B7355"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M400 80 Q350 200 400 320"
              stroke="#8B7355"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Green spaces */}
            <circle cx="100" cy="100" r="40" fill="#22C55E" opacity="0.3" />
            <circle cx="500" cy="120" r="35" fill="#22C55E" opacity="0.3" />
            <circle cx="320" cy="280" r="45" fill="#22C55E" opacity="0.3" />
          </svg>

          {/* Buildings */}
          {Object.entries(locations).map(([buildingName, location]) => {
            const hasEvents = eventsWithLocations.some(event => 
              event.room?.building === buildingName
            );
            const isSelected = selectedEvent?.room?.building === buildingName;
            
            return (
              <div
                key={buildingName}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  hasEvents ? 'cursor-pointer' : ''
                }`}
                style={{
                  left: location.coordinates.x,
                  top: location.coordinates.y
                }}
              >
                {/* Building */}
                <div
                  className={`w-16 h-12 rounded border-2 transition-all ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-700 shadow-lg' 
                      : hasEvents
                      ? 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                      : 'bg-gray-200 border-gray-400'
                  }`}
                />
                
                {/* Building Label */}
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2">
                  <div className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border'
                  }`}>
                    {buildingName}
                  </div>
                </div>

                {/* Event indicators */}
                {hasEvents && (
                  <div className="absolute -top-2 -right-2">
                    <div className="flex flex-col space-y-1">
                      {eventsWithLocations
                        .filter(event => event.room?.building === buildingName)
                        .slice(0, 3)
                        .map((event, index) => (
                          <div
                            key={event.id}
                            className={`w-3 h-3 rounded-full border-2 border-white cursor-pointer ${
                              getEventStatusColor(event)
                            }`}
                            onClick={() => onEventSelect?.(event)}
                            title={`${event.title} - Room ${event.room?.number}`}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend for event status colors */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg border shadow-sm p-3">
            <div className="text-xs font-medium text-gray-700 mb-2">Event Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Ongoing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Upcoming</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-gray-600">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Building List */}
      <div className="p-4 border-t bg-gray-50 max-h-40 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Buildings with Events</h4>
        <div className="space-y-1">
          {eventsWithLocations.length > 0 ? (
            Object.entries(
              eventsWithLocations.reduce((acc, event) => {
                const building = event.room!.building;
                if (!acc[building]) acc[building] = [];
                acc[building].push(event);
                return acc;
              }, {} as Record<string, Event[]>)
            ).map(([building, buildingEvents]) => (
              <div key={building} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{building}</span>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    {buildingEvents.length} events
                  </Badge>
                  {buildingEvents.some(e => {
                    const now = new Date();
                    const start = new Date(e.start_time);
                    const end = new Date(e.end_time);
                    return now >= start && now <= end;
                  }) && (
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No events with location data</div>
          )}
        </div>
      </div>
    </div>
  );
}
