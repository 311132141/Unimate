'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KioskLayout } from '@/components/layouts/KioskLayout';
import { SidebarSection } from '@/components/design-system/SidebarSection';
import { EventCard } from '@/components/design-system/EventCard';
import { LoginModal } from '@/components/features/auth/LoginModal/LoginModal';
import { KioskMap } from '@/components/features/map/KioskMap';

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
    const router = useRouter();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // In a real implementation, this would filter markers or navigate to search results
        console.log('Searching for:', query);
    };
    
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
                onSearch={handleSearch}
                title="Map"
            >
                {/* Interactive Map with Figma styling */}
                <div
                    className="backdrop-blur-[15.4103px] w-full h-full rounded-[26px] overflow-hidden relative"
                    style={{
                        boxShadow: '0px 1.54103px 0px 0px rgba(0,0,0,0.05), 0px 6.1641px 6.1641px 0px rgba(0,0,0,0.05), 0px 15.4103px 15.4103px 0px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Border exactly as in Figma with precise 2px width */}
                    <div className="absolute border-[2px] border-solid border-white inset-0 pointer-events-none rounded-[26px] z-10" />
                    {/* Map Component */}
                    <KioskMap className="w-full h-full rounded-[26px]" searchQuery={searchQuery} />
                </div>
            </KioskLayout>            <LoginModal
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
                onLogin={async (data) => {
                    console.log('Login successful:', data);
                    // Simulate successful login
                    setLoginModalOpen(false);
                    // Navigate to dashboard page
                    router.push('/dashboard');
                }}
            />
        </>
    );
}
