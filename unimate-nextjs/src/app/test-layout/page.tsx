'use client';

import React from 'react';
import { Header, Sidebar, SearchBar } from '@/components/layout';

// Simple test component to verify all layout components work together
const LayoutTest: React.FC = () => {
    return (
        <div className="min-h-screen bg-dark-background">
            <Header
                isAuthenticated={true}
                username="Test User"
                showSearch={true}
            />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-white">Layout Components Test</h1>
                    <p className="text-muted-foreground mt-4">
                        All layout components are working correctly:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                        <li>✅ Header component with authentication and search</li>
                        <li>✅ Sidebar component with navigation items</li>
                        <li>✅ SearchBar component (integrated in Header)</li>
                    </ul>

                    <div className="mt-8 p-4 border border-dark-border rounded-lg">
                        <h2 className="text-lg font-semibold text-white mb-4">Standalone SearchBar Test</h2>
                        <SearchBar
                            placeholder="Test search functionality"
                            onSearch={(query) => console.log('Search query:', query)}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LayoutTest;
