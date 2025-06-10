import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Calendar,
    Map,
    Calendar as Events,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SidebarProps {
    className?: string;
}

interface NavigationItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    const pathname = usePathname();

    const navigationItems: NavigationItem[] = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            icon: Home,
            isActive: pathname === '/dashboard',
        },
        {
            href: '/timetable',
            label: 'Timetable',
            icon: Calendar,
            isActive: pathname === '/timetable',
        },
        {
            href: '/map',
            label: 'Map',
            icon: Map,
            isActive: pathname === '/map',
        },
        {
            href: '/events',
            label: 'Events',
            icon: Events,
            isActive: pathname === '/events',
        },
        {
            href: '/settings',
            label: 'Settings',
            icon: Settings,
            isActive: pathname === '/settings',
        },
    ];

    return (
        <aside
            className={cn(
                'w-72 bg-dark-background border-r border-dark-border overflow-y-auto',
                className
            )}
        >
            <div className="sidebar-section">
                <h2 className="border-b border-dark-border p-4 text-base font-medium text-muted-foreground">
                    Navigation
                </h2>
                <nav className="space-y-0">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 border-b border-dark-border px-4 py-3 text-sm transition-colors hover:bg-dark-secondary',
                                    item.isActive && 'bg-dark-secondary border-l-4 border-l-primary'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export { Sidebar };
