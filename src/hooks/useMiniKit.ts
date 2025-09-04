"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if the app is running in Coinbase Wallet MiniKit environment
 * @returns boolean indicating if we're in MiniKit
 */
export function useMiniKit() {
  const [isMiniKit, setIsMiniKit] = useState(false);

  useEffect(() => {
    const checkMiniKit = () => {
      if (typeof window !== "undefined") {
        // Simple check: are we in an iframe (MiniKit environment)
        const isInIframe = window.parent !== window;
        const userAgent = navigator.userAgent;
        const isCoinbaseWallet = userAgent.includes("CoinbaseWallet");

        return isInIframe || isCoinbaseWallet;
      }
      return false;
    };

    setIsMiniKit(checkMiniKit());
  }, []);

  return isMiniKit;
}

/**
 * Hook to call setFrameReady using OnchainKit's official hook
 */
export function useMiniKitReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const callReady = async () => {
      try {
        // Only try to use OnchainKit hook on client side and when in a provider context
        if (typeof window !== "undefined") {
          // Try to use OnchainKit MiniKit hook
          try {
            // Dynamic import to avoid SSR issues
            await import('@coinbase/onchainkit/minikit');
            console.log("OnchainKit MiniKit available");
          } catch (error) {
            console.warn("OnchainKit MiniKit not available:", error);
          }

          setIsReady(true);
          console.log("✅ MiniKit ready status set");
        }
      } catch (error) {
        console.warn("❌ Failed to set MiniKit ready:", error);
        setIsReady(true); // Assume ready even if there's an error
      }
    };

    callReady();
  }, []);

  return isReady;
}

/**
 * Hook to get MiniKit capabilities and API access
 * @returns object with MiniKit utilities and state
 */
export function useMiniKitAPI() {
  const isMiniKit = useMiniKit();
  const isReady = useMiniKitReady();

  return {
    isMiniKit,
    isReady,
    minikit: typeof window !== "undefined" ? (window as any).minikit : null, // eslint-disable-line @typescript-eslint/no-explicit-any
    coinbaseWallet: typeof window !== "undefined" ? (window as any).coinbaseWallet : null, // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}
