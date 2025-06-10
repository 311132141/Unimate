'use client';

import React from 'react';
import Link from 'next/link';

export default function TestStep8Page() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        📄 Step 8: Page Layouts Test
                    </h1>
                    <p className="text-gray-600">
                        Testing all newly created page layouts from Step 8 implementation
                    </p>
                </div>

                {/* Implementation Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h2 className="text-xl font-semibold text-green-800">
                            ✅ Step 8 Implementation Complete
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-green-700">
                        <div>
                            <h3 className="font-semibold mb-2">8.1 Login Page</h3>
                            <ul className="text-sm space-y-1">
                                <li>• Route group: (auth)/login</li>
                                <li>• RFID indicator integration</li>
                                <li>• LoginForm with validation</li>
                                <li>• Error handling with StatusMessage</li>
                                <li>• NextAuth signIn integration</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">8.2 Dashboard Layout</h3>
                            <ul className="text-sm space-y-1">
                                <li>• Authentication protection</li>
                                <li>• Session-based redirect</li>
                                <li>• Header and Sidebar integration</li>
                                <li>• Loading states</li>
                                <li>• Protected route structure</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">8.3 Dashboard Page</h3>
                            <ul className="text-sm space-y-1">
                                <li>• Timetable display</li>
                                <li>• Event cards with modal</li>
                                <li>• Mock data integration</li>
                                <li>• Campus map placeholder</li>
                                <li>• Grid layout design</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">8.4 Kiosk Page</h3>
                            <ul className="text-sm space-y-1">
                                <li>• Route group: (kiosk)</li>
                                <li>• Event and news sections</li>
                                <li>• Sidebar with cards</li>
                                <li>• Map container</li>
                                <li>• Public access layout</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Page Links */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            🔗 Test Page Layouts
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Click the links below to test each implemented page layout
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-4">

                            {/* Login Page */}
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">🔐 Login Page</h3>
                                        <p className="text-gray-600 text-sm">Authentication page with RFID support</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Route: /login (auth route group)
                                        </div>
                                    </div>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Test Login →
                                    </Link>
                                </div>
                            </div>

                            {/* Dashboard Pages */}
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">📊 Dashboard</h3>
                                        <p className="text-gray-600 text-sm">Protected dashboard with layout and content</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Route: /dashboard (protected route)
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                    >
                                        Test Dashboard →
                                    </Link>
                                </div>
                            </div>

                            {/* Kiosk Page */}
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">🖥️ Kiosk Mode</h3>
                                        <p className="text-gray-600 text-sm">Public kiosk interface with events and map</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Route: / (kiosk route group)
                                        </div>
                                    </div>
                                    <Link
                                        href="/"
                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                    >
                                        Test Kiosk →
                                    </Link>
                                </div>
                            </div>

                            {/* Test Summary */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">📋 Test Summary</h3>
                                        <p className="text-gray-600 text-sm">Complete implementation overview and status</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Route: /test-summary (development page)
                                        </div>
                                    </div>
                                    <Link
                                        href="/test-summary"
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        View Summary →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Details */}
                <div className="bg-white rounded-lg shadow-sm border mt-8">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            🔧 Technical Implementation
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-blue-600">
                                    Route Structure
                                </h3>
                                <div className="font-mono text-sm bg-gray-50 p-3 rounded">
                                    <div>src/app/</div>
                                    <div className="ml-2">├── (auth)/</div>
                                    <div className="ml-4">│   └── login/page.tsx</div>
                                    <div className="ml-2">├── (kiosk)/</div>
                                    <div className="ml-4">│   └── page.tsx</div>
                                    <div className="ml-2">└── dashboard/</div>
                                    <div className="ml-4">    ├── layout.tsx</div>
                                    <div className="ml-4">    └── page.tsx</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-green-600">
                                    Key Features
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Route groups for organization</li>
                                    <li>• Protected dashboard routes</li>
                                    <li>• Session-based authentication</li>
                                    <li>• Component integration</li>
                                    <li>• Layout composition</li>
                                    <li>• TypeScript type safety</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="text-center mt-8">
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            href="/test-summary"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            📋 View Complete Summary
                        </Link>
                        <Link
                            href="/test-providers"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            🔌 Test Providers
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
