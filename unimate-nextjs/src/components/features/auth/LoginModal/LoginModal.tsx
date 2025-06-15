import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { LoginForm } from '../LoginForm';

export interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: (data: { username: string; password: string }) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({
    open,
    onOpenChange,
    onLogin,
}) => {
    const handleLogin = async (data: { username: string; password: string }) => {
        await onLogin(data);
        onOpenChange(false);
    };    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-md border-2 border-white"
                style={{
                    background: '#282828',
                    backdropFilter: 'blur(15.41px)',
                    borderRadius: '26px',
                    boxShadow: '0px 1.541px 0px 0px rgba(0,0,0,0.05), 0px 6.164px 6.164px 0px rgba(0,0,0,0.05), 0px 15.41px 15.41px 0px rgba(0,0,0,0.1)'
                }}
            >
                <DialogHeader>
                    <DialogTitle 
                        style={{
                            fontFamily: '"Geist", sans-serif',
                            fontWeight: 500,
                            fontSize: '24px',
                            lineHeight: 1,
                            color: '#ffffff'
                        }}
                    >
                        Login
                    </DialogTitle>
                    <DialogDescription
                        style={{
                            fontFamily: '"Geist", sans-serif',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: 1.2,
                            color: '#afafaf'
                        }}
                    >
                        Enter your credentials to access your dashboard
                    </DialogDescription>
                </DialogHeader>

                <LoginForm onSubmit={handleLogin} />

                <div className="mt-4 text-center" 
                     style={{
                        fontFamily: '"Geist", sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: 1.2,
                        color: '#afafaf'
                     }}
                >
                    <p>Or scan your RFID card for quick access</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { LoginModal };
