'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

/**
 * Component to call OnchainKit's setFrameReady() using the proper useMiniKit hook
 * This MUST be used within a MiniKitProvider context
 */
export function MiniKitReady() {
    const { setFrameReady, isFrameReady } = useMiniKit();

    useEffect(() => {
        const callSetFrameReady = async () => {
            try {
                if (!isFrameReady && setFrameReady) {
                    await setFrameReady();
                    console.log('✅ OnchainKit useMiniKit setFrameReady() called successfully');
                }
            } catch (error) {
                console.warn('❌ Failed to call OnchainKit setFrameReady():', error);
            }
        };

        // Call immediately and with delays
        callSetFrameReady();
        const timeout1 = setTimeout(callSetFrameReady, 100);
        const timeout2 = setTimeout(callSetFrameReady, 500);
        const timeout3 = setTimeout(callSetFrameReady, 1000);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    }, [setFrameReady, isFrameReady]);

    return null;
}

export default MiniKitReady;
