'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { LoginModal } from '@/components/features/auth/LoginModal';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RFIDIndicator } from '@/components/features/auth/RFIDIndicator';

export default function TestAuthPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isScanning, setIsScanning] = React.useState(false);

    const handleLogin = async (data: { username: string; password: string }) => {
        console.log('Login attempt:', data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Login successful for user: ${data.username}`);
    };

    const handleScanToggle = () => {
        setIsScanning(!isScanning);
        if (!isScanning) {
            // Simulate scan completion after 3 seconds
            setTimeout(() => {
                setIsScanning(false);
                alert('RFID card scanned successfully!');
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">Authentication Components Test</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Login Modal Test */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Login Modal</h2>
                        <div className="p-4 border rounded-lg">
                            <Button onClick={() => setIsModalOpen(true)}>
                                Open Login Modal
                            </Button>
                            <LoginModal
                                open={isModalOpen}
                                onOpenChange={setIsModalOpen}
                                onLogin={handleLogin}
                            />
                        </div>
                    </div>

                    {/* RFID Indicator Test */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">RFID Indicator</h2>
                        <div className="p-4 border rounded-lg space-y-4">
                            <Button onClick={handleScanToggle}>
                                {isScanning ? 'Stop Scanning' : 'Start RFID Scan'}
                            </Button>
                            <RFIDIndicator isScanning={isScanning} />
                        </div>
                    </div>

                    {/* Standalone Login Form Test */}
                    <div className="space-y-4 md:col-span-2">
                        <h2 className="text-xl font-semibold">Standalone Login Form</h2>
                        <div className="p-6 border rounded-lg max-w-md mx-auto">
                            <LoginForm onSubmit={handleLogin} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
