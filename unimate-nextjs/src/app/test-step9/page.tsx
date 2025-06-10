'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export default function TestStep9Page() {
    const [testResults, setTestResults] = useState<{
        proxy: string;
        direct: string;
        endpoints: string;
    }>({
        proxy: 'Not tested',
        direct: 'Not tested',
        endpoints: 'Not tested',
    });
    const testProxyConnection = async () => {
        try {
            // Test the proxied API call using events endpoint
            const response = await fetch('/api/events/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTestResults(prev => ({
                    ...prev,
                    proxy: `✅ Success: ${JSON.stringify(data).substring(0, 100)}...`
                }));
            } else {
                setTestResults(prev => ({
                    ...prev,
                    proxy: `❌ Error: ${response.status} ${response.statusText}`
                }));
            }
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                proxy: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
        }
    };
    const testDirectConnection = async () => {
        try {
            // Test direct connection to Django backend
            const response = await fetch('http://localhost:8000/api/events/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTestResults(prev => ({
                    ...prev,
                    direct: `✅ Success: ${JSON.stringify(data).substring(0, 100)}...`
                }));
            } else {
                setTestResults(prev => ({
                    ...prev,
                    direct: `❌ Error: ${response.status} ${response.statusText}`
                }));
            }
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                direct: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
        }
    };
    const testApiClient = async () => {
        try {
            // Test using the configured API client
            const response = await apiClient.get('/events/');
            setTestResults(prev => ({
                ...prev,
                endpoints: `✅ Success: ${JSON.stringify(response.data).substring(0, 100)}...`
            }));
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                endpoints: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Step 9: API Proxy Configuration Test
                </h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Configuration Details</h2>
                    <div className="space-y-2 text-sm">
                        <p><strong>Next.js Server:</strong> http://localhost:3004</p>
                        <p><strong>Django Backend:</strong> http://localhost:8000</p>
                        <p><strong>API Proxy Route:</strong> /api/* → http://localhost:8000/api/*</p>
                        <p><strong>API Client Base URL:</strong> /api</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Proxy Test */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Proxy Connection Test</h3>
                        <button
                            onClick={testProxyConnection}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mb-4"
                        >
                            Test Proxy Route
                        </button>
                        <div className="text-sm">
                            <p className="font-medium mb-2">Result:</p>
                            <p className="break-words">{testResults.proxy}</p>
                        </div>
                    </div>

                    {/* Direct Test */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Direct Connection Test</h3>
                        <button
                            onClick={testDirectConnection}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors mb-4"
                        >
                            Test Direct Route
                        </button>
                        <div className="text-sm">
                            <p className="font-medium mb-2">Result:</p>
                            <p className="break-words">{testResults.direct}</p>
                        </div>
                    </div>

                    {/* API Client Test */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">API Client Test</h3>
                        <button
                            onClick={testApiClient}
                            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors mb-4"
                        >
                            Test API Client
                        </button>
                        <div className="text-sm">
                            <p className="font-medium mb-2">Result:</p>
                            <p className="break-words">{testResults.endpoints}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">API Endpoints Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p><strong>LOGIN:</strong> {API_ENDPOINTS.LOGIN}</p>
                            <p><strong>LOGOUT:</strong> {API_ENDPOINTS.LOGOUT}</p>
                            <p><strong>REFRESH:</strong> {API_ENDPOINTS.REFRESH}</p>
                            <p><strong>SCAN:</strong> {API_ENDPOINTS.RFID_SCAN}</p>            </div>
                        <div>
                            <p><strong>EVENTS:</strong> {API_ENDPOINTS.EVENTS}</p>
                            <p><strong>BUILDINGS:</strong> {API_ENDPOINTS.BUILDINGS}</p>
                            <p><strong>ROUTE:</strong> {API_ENDPOINTS.ROUTE}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        ⚠️ Testing Requirements
                    </h3>
                    <div className="text-yellow-700 text-sm space-y-2">
                        <p>• Django backend must be running on http://localhost:8000</p>
                        <p>• Next.js server is running on http://localhost:3004</p>
                        <p>• API proxy routes /api/* requests to Django backend</p>
                        <p>• CORS headers are configured for cross-origin requests</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
