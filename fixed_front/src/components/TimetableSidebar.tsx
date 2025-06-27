'use client';

import React, { useState } from 'react';
import { Container } from './Container';

interface Course {
  id: string;
  title: string;
  startTime: string; // "07:30"
  endTime: string;   // "08:50"
  instructor: string;
  location: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
}

interface TimetableSidebarProps {
  className?: string;
}

const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'DES200',
    startTime: '07:30',
    endTime: '08:50',
    instructor: 'Prof. Smith',
    location: 'Room 101',
    day: 'Monday'
  },
  {
    id: '2',
    title: 'COMP220',
    startTime: '10:00',
    endTime: '11:50',
    instructor: 'Dr. Johnson',
    location: 'Lab 205',
    day: 'Monday'
  },
  {
    id: '3',
    title: 'DES201',
    startTime: '16:00',
    endTime: '17:50',
    instructor: 'Prof. Wilson',
    location: 'Studio A',
    day: 'Monday'
  },
  {
    id: '4',
    title: 'MATH180',
    startTime: '09:00',
    endTime: '10:30',
    instructor: 'Dr. Brown',
    location: 'Room 301',
    day: 'Tuesday'
  },
  {
    id: '5',
    title: 'ENG150',
    startTime: '14:00',
    endTime: '15:30',
    instructor: 'Prof. Davis',
    location: 'Room 204',
    day: 'Wednesday'
  },
];

// Convert time string to minutes from start of day
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert time to grid row position (7 AM = row 1)
const timeToGridRow = (time: string): number => {
  const minutes = timeToMinutes(time);
  const startMinutes = 7 * 60; // 7 AM
  const relativeMinutes = minutes - startMinutes;
  return Math.floor(relativeMinutes / 60) + 1;
};

// Calculate grid row span for course duration
const getCourseRowSpan = (startTime: string, endTime: string): number => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  return Math.ceil(durationMinutes / 60);
};

// Format time for display
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const isAM = hours < 12;
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours === 12 ? 12 : hours;
  const period = isAM ? 'AM' : 'PM';
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const TimetableSidebar: React.FC<TimetableSidebarProps> = ({ className }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Filter courses for selected day
  const daysCourses = defaultCourses.filter(course => course.day === selectedDay);

  // Generate hours from 7 AM to 7 PM
  const hours = [];
  for (let i = 7; i <= 19; i++) {
    const isAM = i < 12;
    const displayHour = i === 12 ? 12 : i > 12 ? i - 12 : i;
    const period = isAM ? 'AM' : 'PM';
    hours.push(`${displayHour} ${period}`);
  }

  return (
    <div className="relative h-full">
      <Container size="xl" variant="default" className="w-[34rem] h-full overflow-hidden p-0">
        <div className="h-full flex flex-col p-2">
          {/* Header with Day Selection */}
          <div className="px-4 py-6 border-b border-secondary-800/30 flex-shrink-0">
            <h1 className="text-white text-3xl font-medium mb-6">Weekly Schedule</h1>

            {/* Day Selection Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${selectedDay === day
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-secondary-800/40 text-secondary-300 border border-secondary-700/30 hover:bg-secondary-700/50 hover:text-white'
                    }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <div className="relative min-h-full">
                {/* Grid Container - Two Column Layout */}
                <div className="grid grid-cols-[64px_1fr] min-h-full">
                  {/* Left Column: Time Labels */}
                  <div className="grid grid-rows-[repeat(13,_4rem)]">
                    {hours.map((hour, index) => (
                      <div
                        key={`time-${index}`}
                        className="flex items-start justify-start pl-3 pt-2 text-secondary-300 text-sm font-light border-b border-secondary-800/30 last:border-b-0"
                      >
                        {hour}
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Schedule Area */}
                  <div className="relative grid grid-rows-[repeat(13,_4rem)]">
                    {/* Grid Lines */}
                    {hours.map((_, index) => (
                      <div
                        key={`grid-${index}`}
                        className="relative h-16"
                      >
                        {/* Gradient line at bottom of each hour slot */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-secondary-700 via-secondary-400 to-secondary-700" />
                      </div>
                    ))}

                    {/* Courses - Positioned absolutely over the grid */}
                    {daysCourses.map((course) => {
                      const startRow = timeToGridRow(course.startTime);
                      const rowSpan = getCourseRowSpan(course.startTime, course.endTime);

                      return (
                        <div
                          key={course.id}
                          className="absolute left-2 right-2 bg-primary hover:bg-primary rounded-lg p-3 text-white text-sm font-medium z-10 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
                          style={{
                            top: `${(startRow - 1) * 64}px`,
                            height: `${rowSpan * 64 - 4}px`,
                          }}
                        >
                          <div className="flex flex-col h-full">
                            {/* Course Title */}
                            <div className="font-semibold text-base mb-1">{course.title}</div>

                            {/* Time */}
                            <div className="text-xs text-white/80 mb-1">
                              {formatTime(course.startTime)} - {formatTime(course.endTime)}
                            </div>

                            {/* Instructor */}
                            <div className="text-xs text-white/70 mb-1">
                              {course.instructor}
                            </div>

                            {/* Location */}
                            <div className="text-xs text-white/70 mt-auto">
                              📍 {course.location}
                            </div>
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Empty State */}
                {daysCourses.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-secondary-400">
                      <div className="text-4xl mb-4">📅</div>
                      <div className="text-lg font-medium mb-2">No classes scheduled</div>
                      <div className="text-sm">for {selectedDay}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TimetableSidebar; 