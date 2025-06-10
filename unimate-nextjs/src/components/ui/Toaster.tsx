'use client';

import { useState } from 'react';

interface Toast {
    id: string;
    message: string;
    type?: 'default' | 'success' | 'error' | 'warning';
}

export function Toaster() {
    const [toasts] = useState<Toast[]>([]);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-2 rounded-md shadow-lg ${toast.type === 'error'
                            ? 'bg-red-500 text-white'
                            : toast.type === 'success'
                                ? 'bg-green-500 text-white'
                                : toast.type === 'warning'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-800 text-white'
                        }`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}

export default Toaster;
