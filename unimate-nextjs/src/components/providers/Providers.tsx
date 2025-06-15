'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/api/queryClient';
import { ThemeProvider } from 'next-themes'; // Added ThemeProvider

export interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider // Added ThemeProvider wrapper
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </SessionProvider>
    );
}
