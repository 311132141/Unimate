import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface LoadingSpinnerProps
    extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    className,
    size = 'md',
    ...props
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div
            className={cn('flex items-center justify-center', className)}
            {...props}
        >
            <div
                className={cn(
                    'animate-spin rounded-full border-solid border-primary-foreground/20 border-t-primary',
                    sizeClasses[size]
                )}
            />
        </div>
    );
};

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
