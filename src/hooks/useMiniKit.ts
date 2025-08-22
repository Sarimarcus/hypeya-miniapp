'use client';

import { useEffect, useState } from 'react';

// Type declarations for MiniKit detection
declare global {
  interface Window {
    coinbaseWallet?: unknown;
    minikit?: unknown;
  }
}

/**
 * Hook to detect if the app is running in Coinbase Wallet MiniKit environment
 * @returns boolean indicating if we're in MiniKit
 */
export function useMiniKit() {
  const [isMiniKit, setIsMiniKit] = useState(false);

  useEffect(() => {
    const checkMiniKit = () => {
      if (typeof window !== 'undefined') {
        // Check for MiniKit specific properties
        const hasWalletProvider = !!window.coinbaseWallet;
        const hasMiniKitContext = !!window.minikit;
        const userAgent = navigator.userAgent;
        const isCoinbaseWallet = userAgent.includes('CoinbaseWallet');
        
        // Additional checks for MiniKit environment
        const hasParentOrigin = window.parent !== window;
        const hasPostMessageAPI = typeof window.parent?.postMessage === 'function';
        
        return hasWalletProvider || hasMiniKitContext || isCoinbaseWallet || 
               (hasParentOrigin && hasPostMessageAPI);
      }
      return false;
    };

    setIsMiniKit(checkMiniKit());
  }, []);

  return isMiniKit;
}

/**
 * Hook to get MiniKit capabilities and API access
 * @returns object with MiniKit utilities and state
 */
export function useMiniKitAPI() {
  const isMiniKit = useMiniKit();
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isMiniKit && typeof window !== 'undefined') {
      // Wait for MiniKit to be fully loaded
      const checkReady = () => {
        const ready = !!(window.minikit || window.coinbaseWallet);
        setIsReady(ready);
        
        if (!ready) {
          // Retry after a short delay
          setTimeout(checkReady, 100);
        }
      };
      
      checkReady();
    }
  }, [isMiniKit]);

  return {
    isMiniKit,
    isReady,
    minikit: typeof window !== 'undefined' ? window.minikit : null,
    coinbaseWallet: typeof window !== 'undefined' ? window.coinbaseWallet : null,
  };
}
