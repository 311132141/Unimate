'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, ArrowRight, Clock, Users, Map } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleStartKiosk = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-900">
            Welcome to {siteConfig.name}
          </CardTitle>
          
          <p className="text-lg text-gray-600">
            Interactive University Information System
          </p>
          
          <div className="text-sm text-gray-500">
            Location: {siteConfig.kiosk.location} • ID: {siteConfig.kiosk.id}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Real-time Schedule</h3>
              <p className="text-sm text-gray-600">View your classes and events</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Student Portal</h3>
              <p className="text-sm text-gray-600">Access your academic info</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Map className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Campus Map</h3>
              <p className="text-sm text-gray-600">Find rooms and locations</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">How to use:</h3>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Scan your student card or tap "Start Using Kiosk"</li>
              <li>2. Login with your university credentials</li>
              <li>3. View your schedule, find rooms, and access information</li>
            </ol>
          </div>

          {/* Action Button */}
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleStartKiosk}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Start Using Kiosk
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Automatically redirecting in a few seconds...
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t">
            <p>For assistance, contact IT Support</p>
            <p className="mt-1">System Status: Online • Version {siteConfig.version}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
