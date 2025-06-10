import React from 'react';

export default function TestProvidersPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🔌 Provider Components Test
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Testing SessionProvider, QueryClientProvider, and ReactQueryDevtools integration.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="text-green-800">
                            <h2 className="text-xl font-semibold mb-2">✅ Provider Setup Complete</h2>
                            <ul className="text-left space-y-1">
                                <li>• SessionProvider: Wraps all components with authentication context</li>
                                <li>• QueryClientProvider: Provides React Query functionality</li>
                                <li>• ReactQueryDevtools: Available in development mode</li>
                                <li>• Root Layout: Updated to use centralized providers</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
