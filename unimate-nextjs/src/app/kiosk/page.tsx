'use client';

import { useState } from 'react';
import { KioskLayout } from '@/components/layouts/KioskLayout';
import { SidebarSection } from '@/components/design-system/SidebarSection';
import { EventCard } from '@/components/design-system/EventCard';
import { LoginModal } from '@/components/features/auth/LoginModal/LoginModal';

// Mock data - exact from Figma
const techEvents = [
    {
        id: '1',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=1'
    },
    {
        id: '2',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=2'
    },
    {
        id: '3',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=3'
    },
    {
        id: '4',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=4'
    }
];

const techNews = [
    {
        id: '5',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=5'
    },
    {
        id: '6',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=6'
    },
    {
        id: '7',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=7'
    },
    {
        id: '8',
        category: 'Tech Events',
        title: 'Whatever event name bro',
        time: '2 hours ago',
        organizer: 'Mechatronics',
        thumbnail: 'https://picsum.photos/77/72?random=8'
    }
];

export default function KioskPage() {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    
    const sidebarContent = (
        <div className="space-y-[18px]">
            <SidebarSection title="Tech Events" className="h-[451px]">
                <div className="flex flex-col gap-3">
                    {techEvents.map(event => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            </SidebarSection>

            <SidebarSection title="Tech News" className="h-[347px]">
                <div className="flex flex-col gap-3">
                    {techNews.map(news => (
                        <EventCard key={news.id} {...news} />
                    ))}
                </div>
            </SidebarSection>
        </div>
    );

    return (
        <>
            <KioskLayout
                sidebarContent={sidebarContent}
                isLoggedIn={false}
                onLogin={() => setLoginModalOpen(true)}
                title="Map"            >
                {/* BRIGHT RED TEST MAP - This should be clearly visible */}
                <div 
                    className="w-full h-full bg-red-500 border-4 border-yellow-400 flex items-center justify-center"
                    style={{ minHeight: '816px', minWidth: '1082px' }}
                >
                    <div className="text-center">
                        <h1 className="text-white text-6xl font-bold mb-4">MAP TEST</h1>
                        <p className="text-white text-2xl">This should be clearly visible!</p>
                        <div className="text-white text-xl mt-4">
                            Size: 1082px × 816px
                        </div>
                    </div>
                </div>
            </KioskLayout>
            <LoginModal
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
                onLogin={async (data) => {
                    console.log('Login successful:', data);
                    setLoginModalOpen(false);
                    window.location.href = '/dashboard';
                }}
            />
        </>
    );
}
