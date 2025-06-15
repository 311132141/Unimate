import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { StatusMessage } from '@/components/ui/StatusMessage/StatusMessage';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, className }) => {
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const handleFormSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            await onSubmit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className={cn('space-y-4', className)}
        >
            {error && (
                <StatusMessage
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}

            <div className="space-y-2">                <label htmlFor="username" style={{
                    fontFamily: '"Geist", sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: 1,
                    color: '#ffffff',
                    marginBottom: '8px',
                    display: 'block'
                }}>
                    Username
                </label><Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="backdrop-blur-[14.82px] bg-gradient-to-t from-[#ffffff1a] to-[#ffffff0d] h-[58px] rounded-xl border border-white"
                    style={{
                        fontFamily: '"Geist", sans-serif',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: 1,
                        color: '#ffffff',
                        boxShadow: '0px 1.48px 0px 0px rgba(0,0,0,0.05), 0px 5.93px 5.93px 0px rgba(0,0,0,0.05), 0px 14.82px 14.82px 0px rgba(0,0,0,0.1)'
                    }}
                    {...register('username')}
                    disabled={isLoading}
                />
                {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-2">                <label htmlFor="password" style={{
                    fontFamily: '"Geist", sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: 1,
                    color: '#ffffff',
                    marginBottom: '8px',
                    display: 'block'
                }}>
                    Password
                </label><Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="backdrop-blur-[14.82px] bg-gradient-to-t from-[#ffffff1a] to-[#ffffff0d] h-[58px] rounded-xl border border-white"
                    style={{
                        fontFamily: '"Geist", sans-serif',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: 1,
                        color: '#ffffff',
                        boxShadow: '0px 1.48px 0px 0px rgba(0,0,0,0.05), 0px 5.93px 5.93px 0px rgba(0,0,0,0.05), 0px 14.82px 14.82px 0px rgba(0,0,0,0.1)'
                    }}
                    {...register('password')}
                    disabled={isLoading}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>            <Button
                type="submit"
                className="w-full backdrop-blur-[15.41px] bg-[#5872c6] h-[58px] rounded-xl border border-white"
                style={{
                    fontFamily: '"Geist", sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: 1,
                    color: '#f8fafc',
                    boxShadow: '0px 1.541px 0px 0px rgba(0,0,0,0.05), 0px 6.164px 6.164px 0px rgba(0,0,0,0.05), 0px 15.41px 15.41px 0px rgba(0,0,0,0.1)'
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
        </form>
    );
};

export { LoginForm };
