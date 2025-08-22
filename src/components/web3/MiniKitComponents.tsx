'use client';

import { useMiniKitAPI } from '@/hooks/useMiniKit';
import { Card } from '@/components/ui/card';

/**
 * Component to display MiniKit status and capabilities
 * This helps developers and users understand the current environment
 */
export function MiniKitStatus() {
  const { isMiniKit, isReady, minikit, coinbaseWallet } = useMiniKitAPI();

  if (!isMiniKit) {
    return (
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-blue-700">
            Running as regular web app
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Open this app in Coinbase Wallet for enhanced features
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-green-700 font-medium">
          MiniKit Environment Detected
        </span>
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-green-600">Status:</span>
          <span className={`${isReady ? 'text-green-700' : 'text-orange-600'}`}>
            {isReady ? 'Ready' : 'Loading...'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="text-green-600">MiniKit API:</span>
          <span className={minikit ? 'text-green-700' : 'text-gray-500'}>
            {minikit ? 'Available' : 'Not detected'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="text-green-600">Wallet API:</span>
          <span className={coinbaseWallet ? 'text-green-700' : 'text-gray-500'}>
            {coinbaseWallet ? 'Available' : 'Not detected'}
          </span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Enhanced wallet connection component for MiniKit
 * Provides different UX based on environment
 */
export function MiniKitWalletConnect() {
  const { isMiniKit, isReady } = useMiniKitAPI();

  if (isMiniKit && isReady) {
    return (
      <div className="text-center p-4">
        <div className="text-green-600 mb-2">
          🎉 Connected via MiniKit
        </div>
        <p className="text-sm text-gray-600">
          Your wallet is automatically connected in MiniKit
        </p>
      </div>
    );
  }

  if (isMiniKit && !isReady) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">
          Initializing MiniKit connection...
        </p>
      </div>
    );
  }

  // Fallback to regular wallet connection
  return (
    <div className="text-center p-4">
      <p className="text-sm text-gray-600 mb-2">
        Connect your wallet to get started
      </p>
      {/* Regular wallet connect button would go here */}
    </div>
  );
}
