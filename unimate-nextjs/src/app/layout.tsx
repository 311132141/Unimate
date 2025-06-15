import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

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
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
