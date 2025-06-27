'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Map } from '@/components/Map';

export default function UniMatePage() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // In real app, this would trigger search functionality
    console.log('Search:', value);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background-dark via-background-dark to-surface-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, #3769ae 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <Header
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className="flex-shrink-0 p-4 relative z-10 w-1/4">
          <Sidebar />
        </div>

        {/* Map Area */}
        <div className="flex-1 p-4 pl-0 relative">
          <div className="h-full bg-gradient-to-br from-secondary-900/20 to-background-dark/40 rounded-2xl border border-secondary-800/30 overflow-hidden relative">
            <Map className="h-full" />

            {/* Overlay for empty map state */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Interactive Map</h3>
                <p className="text-secondary-400 text-sm max-w-sm">
                  Search for events and places to see them highlighted on the map
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
