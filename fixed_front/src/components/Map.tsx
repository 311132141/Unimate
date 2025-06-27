import React from 'react';
import { cn } from '@/lib/utils';

export interface MapProps {
  /** Custom className */
  className?: string;
  /** Map center coordinates */
  center?: { lat: number; lng: number };
  /** Zoom level */
  zoom?: number;
}

export const Map: React.FC<MapProps> = ({
  className,
  // center and zoom would be used in real map implementation
}) => {
  return (
    <div
      className={cn(
        'relative w-full h-full bg-gray-100 rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Map Placeholder - In real app, this would be replaced with actual map library */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-300 to-green-400">
        {/* Simulated map background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#000"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Sample location markers */}
        <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>

        <div className="absolute top-2/3 left-1/4 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>

        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>

        {/* Location labels */}
        <div className="absolute top-1/4 left-1/3 mt-8 ml-2">
          <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium">
            Tech Hub
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 mt-8 ml-2">
          <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium">
            University
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Current location indicator */}
      <div className="absolute bottom-4 right-4">
        <button className="w-10 h-10 bg-blue-500 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Map; 