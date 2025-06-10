import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils/cn';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unimate - University Wayfinding System',
  description:
    'Navigate your campus with ease using our interactive 3D map and personalized timetable system.',
  keywords: 'university, wayfinding, navigation, timetable, campus map',
  authors: [{ name: 'Team UNIMATE' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark',
          inter.className
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
