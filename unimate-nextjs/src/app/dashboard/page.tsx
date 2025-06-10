'use client';

import { KioskLayout } from '@/components/layouts/KioskLayout';
import { TimetableView } from '@/components/design-system/TimetableView';

const mockEvents = [
  { id: '1', name: 'Des200', startTime: '7 AM', endTime: '8 AM' },
  { id: '2', name: 'Comp 220', startTime: '10 AM', endTime: '12 PM' },
  { id: '3', name: 'Des201', startTime: '4 PM', endTime: '6 PM' },
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
    >
      {/* Hub 3D Explorer */}
      <div className="w-full h-full flex items-center justify-center bg-secondary/20">
        <p className="text-muted-foreground">Hub 3D Explorer will be rendered here</p>
      </div>
    </KioskLayout>
  );
}
