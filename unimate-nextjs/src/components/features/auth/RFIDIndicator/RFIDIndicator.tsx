import * as React from 'react';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface RFIDIndicatorProps {
    isScanning?: boolean;
    className?: string;
}

const RFIDIndicator: React.FC<RFIDIndicatorProps> = ({
    isScanning = false,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex items-center gap-2 rounded-lg bg-dark-secondary p-4',
                isScanning && 'pulse-border',
                className
            )}
        >
            <CreditCard
                className={cn(
                    'h-8 w-8',
                    isScanning ? 'text-primary' : 'text-muted-foreground'
                )}
            />
            <div>
                <p className="text-sm font-medium">
                    {isScanning ? 'Scanning...' : 'Ready to scan'}
                </p>
                <p className="text-xs text-muted-foreground">
                    Place your card on the reader
                </p>
            </div>
        </div>
    );
};

export { RFIDIndicator };
