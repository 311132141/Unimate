"use client";

// Import our Figma-matching design system components
import { EventCard } from "@/components/design-system/EventCard";
import { SidebarSection } from "@/components/design-system/SidebarSection";
import { SearchInput } from "@/components/design-system/SearchInput";
import { TimetableView } from "@/components/design-system/TimetableView";

// Mock data - exact from Figma
const sampleEvents = [
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
    }
];

const sampleTimetableEvents = [
    { id: '1', name: 'Math 101', time: '09:00' },
    { id: '2', name: 'Physics 201', time: '10:00' },
    { id: '3', name: 'Lunch Break', time: '12:00' }
];

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-white p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 
                        className="text-[40px] text-white"
                        style={{ 
                            fontFamily: '"Geist", sans-serif', 
                            fontWeight: 500, 
                            lineHeight: 1 
                        }}
                    >
                        Unimate Design System
                    </h1>
                    <p 
                        className="text-[18px] text-[#afafaf]"
                        style={{ 
                            fontFamily: '"Geist", sans-serif', 
                            fontWeight: 400, 
                            lineHeight: 1.2 
                        }}
                    >
                        Figma-matched components for the kiosk interface
                    </p>
                </div>

                {/* Color Palette */}
                <div className="space-y-6">
                    <h2 
                        className="text-[24px] text-white"
                        style={{ 
                            fontFamily: '"Geist", sans-serif', 
                            fontWeight: 500, 
                            lineHeight: 1 
                        }}
                    >
                        Color Palette
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div className="space-y-3">
                            <div className="w-full h-20 bg-[#000000] border border-white rounded-lg"></div>
                            <p className="text-sm font-medium">Background</p>
                            <p className="text-xs text-[#afafaf]">#000000</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full h-20 bg-[#282828] border border-white rounded-lg"></div>
                            <p className="text-sm font-medium">Card BG</p>
                            <p className="text-xs text-[#afafaf]">#282828</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full h-20 bg-[#5872c6] border border-white rounded-lg"></div>
                            <p className="text-sm font-medium">Primary</p>
                            <p className="text-xs text-[#afafaf]">#5872c6</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full h-20 bg-[#ffffff] border border-white rounded-lg"></div>
                            <p className="text-sm font-medium">Text Primary</p>
                            <p className="text-xs text-[#afafaf]">#ffffff</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full h-20 bg-[#afafaf] border border-white rounded-lg"></div>
                            <p className="text-sm font-medium">Text Secondary</p>
                            <p className="text-xs text-[#afafaf]">#afafaf</p>
                        </div>
                    </div>
                </div>

                {/* Components */}
                <div className="space-y-12">
                    {/* Search Input */}
                    <div className="space-y-6">
                        <h2 
                            className="text-[24px] text-white"
                            style={{ 
                                fontFamily: '"Geist", sans-serif', 
                                fontWeight: 500, 
                                lineHeight: 1 
                            }}
                        >
                            Search Input
                        </h2>
                        <div className="flex justify-center">
                            <SearchInput placeholder="Find place" />
                        </div>
                    </div>

                    {/* Event Cards */}
                    <div className="space-y-6">
                        <h2 
                            className="text-[24px] text-white"
                            style={{ 
                                fontFamily: '"Geist", sans-serif', 
                                fontWeight: 500, 
                                lineHeight: 1 
                            }}
                        >
                            Event Cards
                        </h2>
                        <div className="max-w-[280px] mx-auto space-y-3">
                            {sampleEvents.map(event => (
                                <EventCard key={event.id} {...event} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <div className="space-y-6">
                        <h2 
                            className="text-[24px] text-white"
                            style={{ 
                                fontFamily: '"Geist", sans-serif', 
                                fontWeight: 500, 
                                lineHeight: 1 
                            }}
                        >
                            Sidebar Section
                        </h2>
                        <div className="flex justify-center">
                            <SidebarSection title="Tech Events" className="h-[300px]">
                                <div className="flex flex-col gap-3">
                                    {sampleEvents.map(event => (
                                        <EventCard key={event.id} {...event} />
                                    ))}
                                </div>
                            </SidebarSection>
                        </div>
                    </div>

                    {/* Timetable View */}
                    <div className="space-y-6">
                        <h2 
                            className="text-[24px] text-white"
                            style={{ 
                                fontFamily: '"Geist", sans-serif', 
                                fontWeight: 500, 
                                lineHeight: 1 
                            }}
                        >
                            Timetable View
                        </h2>                        <div className="flex justify-center">
                            <div className="w-[600px]">
                                <TimetableView events={sampleTimetableEvents} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <div className="space-y-6">
                    <h2 
                        className="text-[24px] text-white"
                        style={{ 
                            fontFamily: '"Geist", sans-serif', 
                            fontWeight: 500, 
                            lineHeight: 1 
                        }}
                    >
                        Typography
                    </h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 
                                className="text-[40px] text-white"
                                style={{ 
                                    fontFamily: '"Geist", sans-serif', 
                                    fontWeight: 500, 
                                    lineHeight: 1 
                                }}
                            >
                                Page Title (40px, Medium)
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <h4 
                                className="text-[18px] text-white"
                                style={{ 
                                    fontFamily: '"Geist", sans-serif', 
                                    fontWeight: 500, 
                                    lineHeight: 1 
                                }}
                            >
                                Section Title (18px, Medium)
                            </h4>
                        </div>
                        <div className="space-y-2">
                            <p 
                                className="text-[16px] text-white"
                                style={{ 
                                    fontFamily: '"Geist", sans-serif', 
                                    fontWeight: 500, 
                                    lineHeight: 1 
                                }}
                            >
                                Event Title (16px, Medium)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p 
                                className="text-[14px] text-[#afafaf]"
                                style={{ 
                                    fontFamily: '"Geist", sans-serif', 
                                    fontWeight: 500, 
                                    lineHeight: 1 
                                }}
                            >
                                Category Text (14px, Medium)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p 
                                className="text-[14px] text-[#b9b9b9]"
                                style={{ 
                                    fontFamily: '"Geist", sans-serif', 
                                    fontWeight: 400, 
                                    lineHeight: 1 
                                }}
                            >
                                Time Text (14px, Regular)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Effects Examples */}
                <div className="space-y-6">
                    <h2 
                        className="text-[24px] text-white"
                        style={{ 
                            fontFamily: '"Geist", sans-serif', 
                            fontWeight: 500, 
                            lineHeight: 1 
                        }}
                    >
                        Glass Morphism Effects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div 
                            className="h-32 rounded-[26px] border-2 border-white flex items-center justify-center"
                            style={{
                                background: '#282828',
                                backdropFilter: 'blur(15.41px)',
                                boxShadow: '0px 1.541px 0px 0px rgba(0,0,0,0.05), 0px 6.164px 6.164px 0px rgba(0,0,0,0.05), 0px 15.41px 15.41px 0px rgba(0,0,0,0.1)'
                            }}
                        >
                            <p className="text-white">Card Background</p>
                        </div>
                        <div 
                            className="h-32 rounded-xl border border-white flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(to top, #ffffff1a, #ffffff0d)',
                                backdropFilter: 'blur(14.82px)',
                                boxShadow: '0px 1.48px 0px 0px rgba(0,0,0,0.05), 0px 5.93px 5.93px 0px rgba(0,0,0,0.05), 0px 14.82px 14.82px 0px rgba(0,0,0,0.1)'
                            }}
                        >
                            <p className="text-white">Input Background</p>
                        </div>
                        <div 
                            className="h-32 rounded-xl border border-white flex items-center justify-center"
                            style={{
                                background: '#5872c6',
                                backdropFilter: 'blur(15.41px)',
                                boxShadow: '0px 1.541px 0px 0px rgba(0,0,0,0.05), 0px 6.164px 6.164px 0px rgba(0,0,0,0.05), 0px 15.41px 15.41px 0px rgba(0,0,0,0.1)'
                            }}
                        >
                            <p className="text-white">Button Background</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
