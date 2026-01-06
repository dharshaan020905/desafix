'use client';

import { useEffect, useState } from 'react';

interface SessionWarningProps {
  onExtend: () => void;
}

export default function SessionWarning({ onExtend }: SessionWarningProps) {
  const [countdown, setCountdown] = useState(300); // 5 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Session Expiring Soon</h3>
            <p className="text-sm text-gray-600">Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          You've been inactive for a while. Click "Stay Logged In" to continue your session.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onExtend}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Stay Logged In
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}