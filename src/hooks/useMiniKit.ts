"use client";

import { useEffect, useState } from "react";

// Type declarations for MiniKit detection
declare global {
  interface Window {
    coinbaseWallet?: unknown;
    minikit?: unknown;
    // Extended window types for MiniKit
    sdk?: {
      actions?: {
        ready?: () => void;
      };
    };
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
      if (typeof window !== "undefined") {
        // Check for MiniKit specific properties
        const hasWalletProvider = !!window.coinbaseWallet;
        const hasMiniKitContext = !!window.minikit;
        const userAgent = navigator.userAgent;
        const isCoinbaseWallet = userAgent.includes("CoinbaseWallet");

        // Additional checks for MiniKit environment
        const hasParentOrigin = window.parent !== window;
        const hasPostMessageAPI =
          typeof window.parent?.postMessage === "function";

        return (
          hasWalletProvider ||
          hasMiniKitContext ||
          isCoinbaseWallet ||
          (hasParentOrigin && hasPostMessageAPI)
        );
      }
      return false;
    };

    setIsMiniKit(checkMiniKit());
  }, []);

  return isMiniKit;
}

/**
 * Hook to initialize MiniKit and call ready when appropriate
 */
export function useMiniKitReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simple approach: call ready using window.postMessage for MiniKit
    const initializeMiniKit = () => {
      try {
        // Method 1: Use postMessage to communicate with parent (Coinbase Wallet)
        if (typeof window !== "undefined" && window.parent !== window) {
          window.parent.postMessage({ type: 'minikit_ready' }, '*');
          console.log("MiniKit ready message sent via postMessage");
        }

        // Method 2: Try window-based ready functions
        const readyFunctions = [
          window.sdk?.actions?.ready,
          (window as any).minikit?.ready, // eslint-disable-line @typescript-eslint/no-explicit-any
          (window as any).coinbaseWallet?.ready // eslint-disable-line @typescript-eslint/no-explicit-any
        ];

        for (const readyFn of readyFunctions) {
          if (typeof readyFn === 'function') {
            try {
              readyFn();
              console.log("Window-based ready() called successfully");
              setIsReady(true);
              return;
            } catch (err) {
              console.warn("Failed to call window-based ready():", err);
            }
          }
        }

        // Method 3: Try to use document events
        const readyEvent = new CustomEvent('minikit-ready');
        document.dispatchEvent(readyEvent);
        console.log("MiniKit ready event dispatched");
        
        setIsReady(true);
      } catch (error) {
        console.warn("Failed to initialize MiniKit ready():", error);
      }
    };

    // Call immediately and with delays to ensure it's picked up
    initializeMiniKit();
    setTimeout(initializeMiniKit, 100);
    setTimeout(initializeMiniKit, 500);
    setTimeout(initializeMiniKit, 1000);
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
    minikit: typeof window !== "undefined" ? window.minikit : null,
    coinbaseWallet:
      typeof window !== "undefined" ? window.coinbaseWallet : null,
  };
}
