// Minimal service worker utilities
// Only includes functions actually used by the app

"use client";

import { useEffect, useState } from "react";

// Simple service worker registration
export function registerServiceWorker() {
  if (typeof window !== "undefined" && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  }
}

// Online status hook
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
