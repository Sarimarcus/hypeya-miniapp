// Service Worker Initializer Component
// Handles service worker registration and offline status

'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker, useOnlineStatus } from '@/utils/serviceWorker';

export function ServiceWorkerInitializer() {
  const isOnline = useOnlineStatus();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();
  }, []);

  // Only show offline message after being offline for a few seconds
  // This prevents false positives from brief network hiccups
  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(true);
      }, 2000); // Wait 2 seconds before showing offline message

      return () => clearTimeout(timer);
    } else {
      setShowOfflineMessage(false);
    }
  }, [isOnline]);

  // Show offline indicator only when we're confident the user is offline
  if (showOfflineMessage && !isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black p-2 text-center text-sm font-medium">
        Estás sin conexión. Algunas funciones pueden estar limitadas.
      </div>
    );
  }

  return null;
}
