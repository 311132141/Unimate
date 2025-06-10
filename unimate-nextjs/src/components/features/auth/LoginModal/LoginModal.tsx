import * as React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
} from '@/components/ui/Modal';
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
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent className="sm:max-w-md">
                <ModalHeader>
                    <ModalTitle>Login</ModalTitle>
                    <ModalDescription>
                        Enter your credentials to access your dashboard
                    </ModalDescription>
                </ModalHeader>

                <LoginForm onSubmit={handleLogin} />

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Or scan your RFID card for quick access</p>
                </div>
            </ModalContent>
        </Modal>
    );
};

export { LoginModal };
