'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

/**
 * Component that properly calls OnchainKit's setFrameReady
 * This component is only rendered within MiniKitProvider context
 */
export function OnchainKitReady() {
    const { setFrameReady, isFrameReady } = useMiniKit();

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

    return null;
}

export default OnchainKitReady;
