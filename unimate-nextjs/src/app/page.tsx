'use client';

import { useState } from 'react';
import { KioskLayout } from '@/components/layouts/KioskLayout';
import { SidebarSection } from '@/components/design-system/SidebarSection';
import { EventCard } from '@/components/design-system/EventCard';
import { LoginModal } from '@/components/features/auth/LoginModal';

// Mock data
const techEvents = [
  {
    id: '1',
    category: 'Tech Events',
    title: 'Whatever event name bro',
    time: '2 hours ago',
    organizer: 'Mechatronics',
    thumbnail: 'https://picsum.photos/48/48?random=1'
  },
  {
    id: '2',
    category: 'Tech Events',
    title: 'AI Workshop',
    time: '3 hours ago',
    organizer: 'Computer Science',
    thumbnail: 'https://picsum.photos/48/48?random=2'
  },
  {
    id: '3',
    category: 'Tech Events',
    title: 'Robotics Competition',
    time: '4 hours ago',
    organizer: 'Engineering',
    thumbnail: 'https://picsum.photos/48/48?random=3'
  },
  {
    id: '4',
    category: 'Tech Events',
    title: 'Innovation Fair',
    time: '5 hours ago',
    organizer: 'Innovation Hub',
    thumbnail: 'https://picsum.photos/48/48?random=4'
  }
];

const techNews = [
  {
    id: '5',
    category: 'Tech News',
    title: 'Whatever event name bro',
    time: '2 hours ago',
    organizer: 'Mechatronics',
    thumbnail: 'https://picsum.photos/48/48?random=5'
  },
  {
    id: '6',
    category: 'Tech News',
    title: 'New Research Lab Opening',
    time: '1 day ago',
    organizer: 'University',
    thumbnail: 'https://picsum.photos/48/48?random=6'
  },
  {
    id: '7',
    category: 'Tech News',
    title: 'Student Innovation Award',
    time: '2 days ago',
    organizer: 'Innovation Hub',
    thumbnail: 'https://picsum.photos/48/48?random=7'
  }
];

export default function KioskPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const sidebarContent = (
    <>
      <SidebarSection title="Tech Events">
        {techEvents.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
      </SidebarSection>

      <SidebarSection title="Tech News">
        {techNews.map(news => (
          <EventCard key={news.id} {...news} />
        ))}
      </SidebarSection>
    </>
  );

  return (
    <>
      <KioskLayout
        sidebarContent={sidebarContent}
        isLoggedIn={false}
        onLogin={() => setLoginModalOpen(true)}
        title="Map"
      >
        {/* Placeholder for 3D Map */}
        <div className="w-full h-full flex items-center justify-center bg-secondary/20">
          <p className="text-muted-foreground">3D Campus Map will be rendered here</p>
        </div>
      </KioskLayout>

      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        onLogin={async (data) => {
          console.log('Login:', data);
          // Handle login
        }}
      />
    </>
  );
}
