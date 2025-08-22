'use client';

import { useMiniKitReady } from '@/hooks/useMiniKit';

/**
 * Component to initialize MiniKit using OnchainKit's official setFrameReady
 * Should be included at the root level of the app
 */
export function MiniKitInitializer() {
  // This will automatically call setFrameReady() when the component mounts
  const isReady = useMiniKitReady();

  // Log ready status for debugging
  if (typeof window !== 'undefined') {
    console.log('🚀 MiniKit Initializer - Frame ready status:', isReady);
  }

  return null;
}

export default MiniKitInitializer;
