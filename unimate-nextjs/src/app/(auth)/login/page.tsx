'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RFIDIndicator } from '@/components/features/auth/RFIDIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [isScanning] = React.useState(false);

    const handleLogin = async (data: { username: string; password: string }) => {
        const result = await signIn('credentials', {
            username: data.username,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid username or password');
        } else {
            router.push('/dashboard');
        }
    };

    // TODO: Implement WebSocket connection for RFID scanning
    React.useEffect(() => {
        // WebSocket connection for RFID scanning would go here
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Welcome to Unimate
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <RFIDIndicator isScanning={isScanning} />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-dark-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-dark-secondary px-2 text-muted-foreground">
                                Or login with credentials
                            </span>
                        </div>
                    </div>

                    {error && (
                        <StatusMessage
                            type="error"
                            message={error}
                            onClose={() => setError(null)}
                        />
                    )}

                    <LoginForm onSubmit={handleLogin} />
                </CardContent>
            </Card>
        </div>
    );
}
