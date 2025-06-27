'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { TimetableSidebar } from '@/components/TimetableSidebar';

export default function TimetablePage() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
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
        {/* Timetable Sidebar */}
        {/* <div className="flex-shrink-0 p-4 relative z-10"> */}
        <div className="flex-shrink-0 p-4 relative z-10 w-1/4">
          <TimetableSidebar />
        </div>

        {/* Timetable Main Area */}
        <div className="flex-1 p-4 pl-0 relative">
          <div className="h-full bg-gradient-to-br from-secondary-900/20 to-background-dark/40 rounded-2xl border border-secondary-800/30 overflow-hidden relative">

            {/* Timetable Content */}
            <div className="h-full p-6">
              <div className="text-center h-full flex items-center justify-center">
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-2">Timetable View</h3>
                  <p className="text-secondary-400 text-sm max-w-sm">
                    Your weekly schedule will be displayed here. Add courses from the sidebar to build your timetable.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 