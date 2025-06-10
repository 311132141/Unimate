import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Unimate
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Your university wayfinding and timetable companion
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              Kiosk Mode
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
