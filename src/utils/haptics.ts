// Haptic feedback utilities for mobile devices
// Provides tactile feedback for user interactions

'use client';

export type HapticFeedbackType = 
  | 'impact-light'
  | 'impact-medium' 
  | 'impact-heavy'
  | 'notification-success'
  | 'notification-warning'
  | 'notification-error'
  | 'selection';

class HapticFeedbackManager {
  private isSupported: boolean;
  private vibrationSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();
    this.vibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  private checkSupport(): boolean {
    // Check for iOS Haptic Feedback API
    if (typeof window !== 'undefined') {
      // @ts-expect-error - Haptic API is not in TypeScript definitions
      return 'DeviceMotionEvent' in window && window.DeviceMotionEvent?.requestPermission !== undefined;
    }
    return false;
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      // @ts-expect-error - Haptic API is not in TypeScript definitions
      const permission = await DeviceMotionEvent.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.warn('Haptic permission request failed:', error);
      return false;
    }
  }

  private getVibrationPattern(type: HapticFeedbackType): number[] {
    switch (type) {
      case 'impact-light':
        return [10];
      case 'impact-medium':
        return [20];
      case 'impact-heavy':
        return [40];
      case 'notification-success':
        return [10, 50, 10];
      case 'notification-warning':
        return [20, 50, 20];
      case 'notification-error':
        return [50, 50, 50];
      case 'selection':
        return [5];
      default:
        return [10];
    }
  }

  triggerHaptic(type: HapticFeedbackType = 'impact-light'): void {
    // Try iOS Haptic Feedback first
    if (this.isSupported) {
      try {
        // @ts-expect-error - Haptic API is not in TypeScript definitions
        if (window.Haptics) {
          switch (type) {
            case 'impact-light':
              // @ts-expect-error - Haptic API is not in TypeScript definitions
              window.Haptics.impact({ style: 'light' });
              break;
            case 'impact-medium':
              // @ts-expect-error - Haptic API is not in TypeScript definitions
              window.Haptics.impact({ style: 'medium' });
              break;
            case 'impact-heavy':
              // @ts-expect-error - Haptic API is not in TypeScript definitions
              window.Haptics.impact({ style: 'heavy' });
              break;
            case 'notification-success':
              // @ts-expect-error - Haptic API is not in TypeScript definitions
              window.Haptics.notification({ type: 'success' });
              break;
            case 'notification-warning':
              // @ts-expect-error - Haptic API is not in TypeScript definitions
              window.Haptics.notification({ type: 'warning' });
              break;
            case 'notification-error':
              // @ts-expect-error - Haptic API is not in TypeScript definitions
              window.Haptics.notification({ type: 'error' });
              break;
            case 'selection':
              // @ts-expect-error - Haptic API is not in TypeScript definitions
              window.Haptics.selection();
              break;
          }
          return;
        }
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    }

    // Fallback to vibration API
    if (this.vibrationSupported && typeof navigator !== 'undefined') {
      const pattern = this.getVibrationPattern(type);
      navigator.vibrate(pattern);
    }
  }

  // Predefined haptic patterns for common interactions
  impact = {
    light: () => this.triggerHaptic('impact-light'),
    medium: () => this.triggerHaptic('impact-medium'),
    heavy: () => this.triggerHaptic('impact-heavy')
  };

  notification = {
    success: () => this.triggerHaptic('notification-success'),
    warning: () => this.triggerHaptic('notification-warning'),
    error: () => this.triggerHaptic('notification-error')
  };

  selection = () => this.triggerHaptic('selection');
}

// Singleton instance - lazy initialization to avoid SSR issues
let hapticsInstance: HapticFeedbackManager | null = null;

function getHapticsInstance(): HapticFeedbackManager {
  if (!hapticsInstance) {
    hapticsInstance = new HapticFeedbackManager();
  }
  return hapticsInstance;
}

// React hook for haptic feedback
export function useHaptics() {
  const triggerHaptic = (type: HapticFeedbackType = 'impact-light') => {
    if (typeof window !== 'undefined') {
      getHapticsInstance().triggerHaptic(type);
    }
  };

  const requestPermission = async () => {
    if (typeof window !== 'undefined') {
      return await getHapticsInstance().requestPermission();
    }
    return false;
  };

  const haptics = typeof window !== 'undefined' ? getHapticsInstance() : null;

  return {
    triggerHaptic,
    requestPermission,
    impact: {
      light: () => triggerHaptic('impact-light'),
      medium: () => triggerHaptic('impact-medium'),
      heavy: () => triggerHaptic('impact-heavy')
    },
    notification: {
      success: () => triggerHaptic('notification-success'),
      warning: () => triggerHaptic('notification-warning'),
      error: () => triggerHaptic('notification-error')
    },
    selection: () => triggerHaptic('selection'),
    isSupported: haptics?.['isSupported'] ?? false,
    vibrationSupported: haptics?.['vibrationSupported'] ?? false
  };
}

// Utility function for manual haptic triggers
export function triggerHapticFeedback(type: HapticFeedbackType = 'impact-light') {
  if (typeof window !== 'undefined') {
    getHapticsInstance().triggerHaptic(type);
  }
}
