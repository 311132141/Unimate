'use client';

import { KioskLayout } from '@/components/layouts/KioskLayout';
import { TimetableView } from '@/components/design-system/TimetableView';

// Mock data - exact from Figma Time Table view
const mockEvents = [
  { id: '1', name: 'Des200', time: '7 AM' },
  { id: '2', name: 'Comp 220', time: '10 AM' },
  { id: '3', name: 'Des201', time: '4 PM' },
];

export default function DashboardPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <KioskLayout
      sidebarContent={<TimetableView events={mockEvents} />}
      isLoggedIn={true}
      onPrint={handlePrint}
      title="Time Table"
    >      {/* 3D Explorer - exact styling from Figma */}
      <div
        className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden"
        style={{
          background: '#282828',
          backdropFilter: 'blur(15.41px)',
          boxShadow: '0px 1.541px 0px 0px rgba(0,0,0,0.05), 0px 6.164px 6.164px 0px rgba(0,0,0,0.05), 0px 15.41px 15.41px 0px rgba(0,0,0,0.1)'
        }}
      >
        {/* Placeholder for 3D content */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-[24px]" 
               style={{
                 fontFamily: '"Geist", sans-serif',
                 fontWeight: 500,
                 lineHeight: 1
               }}>
            3D Explorer
          </div>
        </div>
      </div>
    </KioskLayout>
  );
}
