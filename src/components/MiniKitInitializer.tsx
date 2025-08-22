'use client';

import { useEffect } from 'react';
import { useMiniKitReady } from '@/hooks/useMiniKit';

/**
 * Component to initialize MiniKit and call ready() 
 * Should be included at the root level of the app
 */
export function MiniKitInitializer() {
  const isReady = useMiniKitReady();

  useEffect(() => {
    console.log('MiniKit initializer loaded, ready status:', isReady);
  }, [isReady]);

  // This component doesn't render anything, it just handles initialization
  return null;
}

export default MiniKitInitializer;
