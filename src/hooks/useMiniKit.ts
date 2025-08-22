"use client";

import { useEffect, useState } from "react";
import { useMiniKit as useOnchainKitMiniKit } from "@coinbase/onchainkit/minikit";

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
  const { setFrameReady, isFrameReady } = useOnchainKitMiniKit();

  useEffect(() => {
    const callReady = async () => {
      try {
        if (!isFrameReady) {
          await setFrameReady();
          console.log("✅ OnchainKit setFrameReady() called successfully");
        }
      } catch (error) {
        console.warn("❌ Failed to call OnchainKit setFrameReady():", error);
      }
    };

    callReady();
  }, [setFrameReady, isFrameReady]);

  return isFrameReady;
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
  };
}
