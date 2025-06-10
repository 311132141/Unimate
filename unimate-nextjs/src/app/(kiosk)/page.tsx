'use client';

import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { EventCard } from '@/components/features/common/EventCard';
import { LoginModal } from '@/components/features/auth/LoginModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

// Mock data for demonstration
const techEvents = [
    {
        id: '1',
        title: 'AI Workshop',
        category: 'Tech Events',
        time: '2 hours ago',
        organizer: 'Computer Science',
        thumbnail: 'https://picsum.photos/60/60?random=1',
    },
    {
        id: '2',
        title: 'Robotics Competition',
        category: 'Tech Events',
        time: '3 hours ago',
        organizer: 'Engineering',
        thumbnail: 'https://picsum.photos/60/60?random=2',
    },
];

const techNews = [
    {
        id: '3',
        title: 'New Research Lab Opening',
        category: 'Tech News',
        time: '1 day ago',
        organizer: 'University',
        thumbnail: 'https://picsum.photos/60/60?random=3',
    },
    {
        id: '4',
        title: 'Student Innovation Award',
        category: 'Tech News',
        time: '2 days ago',
        organizer: 'Innovation Hub',
        thumbnail: 'https://picsum.photos/60/60?random=4',
    },
];

export default function KioskPage() {
    const [loginModalOpen, setLoginModalOpen] = React.useState(false);

    const handleLogin = async (data: { username: string; password: string }) => {
        // Login logic handled by LoginModal
        console.log('Login data:', data);
    };

    return (
        <div className="flex h-screen flex-col">
            <Header
                isAuthenticated={false}
                showSearch={true}
            />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-[300px] overflow-y-auto border-r border-dark-border bg-dark-background">
                    <div className="space-y-6">
                        <Card className="border-0 rounded-none">
                            <CardHeader className="border-b border-dark-border">
                                <CardTitle className="text-lg">Tech Events</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {techEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        {...event}
                                        onClick={() => console.log('Event clicked:', event.id)}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-0 rounded-none">
                            <CardHeader className="border-b border-dark-border">
                                <CardTitle className="text-lg">Tech News</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {techNews.map((news) => (
                                    <EventCard
                                        key={news.id}
                                        {...news}
                                        onClick={() => console.log('News clicked:', news.id)}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </aside>

                {/* Map Container */}
                <main className="flex-1 bg-dark-secondary p-8">
                    <div className="flex h-full items-center justify-center rounded-lg bg-dark-tertiary">
                        <p className="text-xl text-muted-foreground">
                            3D Campus Map - Coming in Phase 3
                        </p>
                    </div>
                </main>
            </div>

            <LoginModal
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
                onLogin={handleLogin}
            />
        </div>
    );
}
