// Service worker registration and management utilities
// Handles SW installation, updates, and communication

'use client';

import React from 'react';

interface ServiceWorkerManager {
  register: () => Promise<ServiceWorkerRegistration | null>;
  unregister: () => Promise<boolean>;
  update: () => Promise<void>;
  isSupported: () => boolean;
  getRegistration: () => Promise<ServiceWorkerRegistration | null>;
  getCacheStatus: () => Promise<{ static: number; api: number; pages: number; total: number } | null>;
  cacheArticle: (articleData: unknown) => Promise<void>;
}

class ServiceWorkerManagerImpl implements ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;

  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      console.log('Registering service worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', this.registration);

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        
        if (newWorker) {
          console.log('New service worker installing...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
              this.notifyUpdate();
            }
          });
        }
      });

      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed, reloading...');
        window.location.reload();
      });

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      const registration = await navigator.serviceWorker.getRegistration();
      this.registration = registration || null;
    }

    if (this.registration) {
      const result = await this.registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    }

    return false;
  }

  async update(): Promise<void> {
    if (!this.registration) {
      console.warn('No service worker registration found');
      return;
    }

    try {
      await this.registration.update();
      console.log('Service worker update check completed');
    } catch (error) {
      console.error('Service worker update failed:', error);
    }
  }

  async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (this.registration) {
      return this.registration;
    }

    if (this.isSupported()) {
      this.registration = (await navigator.serviceWorker.getRegistration()) || null;
      return this.registration;
    }

    return null;
  }

  async getCacheStatus(): Promise<{ static: number; api: number; pages: number; total: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve(null);
        return;
      }

      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        resolve(event.data.error ? null : event.data);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [channel.port2]
      );
    });
  }

  async cacheArticle(articleData: unknown): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      console.warn('No service worker controller available');
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_ARTICLE',
      payload: articleData
    });
  }

  private notifyUpdate(): void {
    // Dispatch custom event for update notification
    const event = new CustomEvent('sw-update-available', {
      detail: { registration: this.registration }
    });
    
    window.dispatchEvent(event);
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManagerImpl();

// Hook for using service worker in React components
export function useServiceWorker() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [isSupported] = React.useState(serviceWorkerManager.isSupported());
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [cacheStatus, setCacheStatus] = React.useState<{ static: number; api: number; pages: number; total: number } | null>(null);

  React.useEffect(() => {
    if (!isSupported) return;

    // Register service worker
    serviceWorkerManager.register().then((registration) => {
      setIsRegistered(!!registration);
    });

    // Listen for updates
    const handleUpdate = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener('sw-update-available', handleUpdate);

    // Get initial cache status
    serviceWorkerManager.getCacheStatus().then(setCacheStatus);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, [isSupported]);

  const update = React.useCallback(async () => {
    await serviceWorkerManager.update();
    setUpdateAvailable(false);
  }, []);

  const refreshCacheStatus = React.useCallback(async () => {
    const status = await serviceWorkerManager.getCacheStatus();
    setCacheStatus(status);
  }, []);

  const cacheArticle = React.useCallback(async (articleData: unknown) => {
    await serviceWorkerManager.cacheArticle(articleData);
    // Refresh cache status after caching
    setTimeout(refreshCacheStatus, 100);
  }, [refreshCacheStatus]);

  return {
    isSupported,
    isRegistered,
    updateAvailable,
    cacheStatus,
    update,
    refreshCacheStatus,
    cacheArticle
  };
}

// Utility to check if app is running offline with better detection
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Function to actually test network connectivity
  const checkOnlineStatus = React.useCallback(async () => {
    if (typeof navigator === 'undefined') return true;
    
    try {
      // First check navigator.onLine
      if (!navigator.onLine) {
        setIsOnline(false);
        return false;
      }

      // Then do an actual network test by trying to fetch a small resource
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const online = response.ok;
      setIsOnline(online);
      return online;
    } catch {
      // If fetch fails, we're likely offline
      setIsOnline(false);
      return false;
    }
  }, []);

  React.useEffect(() => {
    const handleOnline = () => {
      // Don't immediately trust the online event, verify with actual network test
      checkOnlineStatus();
    };
    
    const handleOffline = () => setIsOnline(false);

    // Initial check
    checkOnlineStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check (every 30 seconds when online)
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        checkOnlineStatus();
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [checkOnlineStatus]);

  return isOnline;
}

// Auto-register service worker (call this in your root layout)
export function registerServiceWorker() {
  if (typeof window !== 'undefined') {
    serviceWorkerManager.register();
  }
}
