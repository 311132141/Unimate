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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>
                        Enter your credentials to access your dashboard
                    </DialogDescription>
                </DialogHeader>

                <LoginForm onSubmit={handleLogin} />

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Or scan your RFID card for quick access</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { LoginModal };
