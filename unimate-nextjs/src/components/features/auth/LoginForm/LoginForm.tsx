import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { cn } from '@/lib/utils/cn';

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

            <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                    Username
                </label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register('username')}
                    disabled={isLoading}
                />
                {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                    Password
                </label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                    disabled={isLoading}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
        </form>
    );
};

export { LoginForm };
