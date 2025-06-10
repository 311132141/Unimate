import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export interface StatusMessageProps {
    type?: 'success' | 'error' | 'info' | 'warning';
    message: string;
    className?: string;
    onClose?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
    type = 'info',
    message,
    className,
    onClose,
}) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        if (onClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="h-5 w-5" />,
        error: <XCircle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />,
    };

    const styles = {
        success: 'bg-green-900/50 text-green-100 border-green-700',
        error: 'bg-red-900/50 text-red-100 border-red-700',
        info: 'bg-blue-900/50 text-blue-100 border-blue-700',
        warning: 'bg-yellow-900/50 text-yellow-100 border-yellow-700',
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-md border px-4 py-3 text-sm transition-all duration-300',
                styles[type],
                isVisible ? 'opacity-100' : 'opacity-0',
                className
            )}
        >
            {icons[type]}
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-auto hover:opacity-75"
                >
                    <XCircle className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export { StatusMessage };
