import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchBar } from '../SearchBar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface HeaderProps {
    isAuthenticated?: boolean;
    username?: string;
    showSearch?: boolean;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    isAuthenticated = false,
    username,
    showSearch = true,
    className,
}) => {
    const router = useRouter();

    const handleLogout = () => {
        // TODO: Implement logout logic
        router.push('/');
    };

    return (
        <header
            className={cn(
                'flex items-center justify-between border-b border-dark-border bg-dark-background px-4 py-2',
                className
            )}
        >
            <Link href="/" className="text-2xl font-bold">
                <h1>Unimate</h1>
            </Link>

            {showSearch && (
                <div className="mx-4 max-w-2xl flex-1">
                    <SearchBar />
                </div>
            )}

            <div className="flex items-center gap-4">
                {isAuthenticated && username && (
                    <span className="text-sm text-muted-foreground">
                        {username}
                    </span>
                )}
                {isAuthenticated ? (
                    <Button onClick={handleLogout} variant="default" size="sm">
                        Log out
                    </Button>
                ) : (
                    <Link href="/login">
                        <Button variant="default" size="sm">
                            Log in
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
};

export { Header };
