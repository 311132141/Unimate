'use client';

import { useState } from 'react';

export default function TestPage() {
  const [counter, setCounter] = useState(0);
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Unimate Test Page</h1>
      
      <div className="space-y-8 w-full max-w-md">
        <div className="border-2 border-white rounded-2xl p-6">
          <h2 className="text-xl font-medium mb-4">Basic Component Test</h2>
          <p className="mb-4">Counter: {counter}</p>
          <button 
            onClick={() => setCounter(count => count + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Increment Counter
          </button>
        </div>
      </div>
    </div>
  );
}
