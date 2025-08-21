// Service Worker Initializer Component
// Handles service worker registration and offline status

'use client';

import { useEffect } from 'react';
import { registerServiceWorker, useOnlineStatus } from '@/utils/serviceWorker';

export function ServiceWorkerInitializer() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();
  }, []);

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black p-2 text-center text-sm font-medium">
        You&apos;re offline. Some features may be limited.
      </div>
    );
  }

  return null;
}
