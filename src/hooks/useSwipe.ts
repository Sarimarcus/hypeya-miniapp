// Swipe gesture detection and handling
// Provides smooth swipe interactions for mobile

'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

export interface SwipeDirection {
  horizontal: 'left' | 'right' | null;
  vertical: 'up' | 'down' | null;
}

export interface SwipeEvent {
  direction: SwipeDirection;
  distance: { x: number; y: number };
  velocity: { x: number; y: number };
  duration: number;
}

export interface UseSwipeOptions {
  onSwipe?: (event: SwipeEvent) => void;
  onSwipeLeft?: (event: SwipeEvent) => void;
  onSwipeRight?: (event: SwipeEvent) => void;
  onSwipeUp?: (event: SwipeEvent) => void;
  onSwipeDown?: (event: SwipeEvent) => void;
  threshold?: number;
  velocityThreshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
}

export function useSwipe<T extends HTMLElement>(
  options: UseSwipeOptions = {}
) {
  const {
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefaultTouchmoveEvent = false,
    trackMouse = false
  } = options;

  const elementRef = useRef<T>(null);
  const startPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startPos.current = {
      x: clientX,
      y: clientY,
      time: Date.now()
    };
    setIsTracking(true);
  }, []);

  const handleEnd = useCallback((clientX: number, clientY: number) => {
    if (!startPos.current) return;

    const endTime = Date.now();
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    const duration = endTime - startPos.current.time;
    const distance = { x: Math.abs(deltaX), y: Math.abs(deltaY) };
    const velocity = {
      x: distance.x / duration,
      y: distance.y / duration
    };

    const direction: SwipeDirection = {
      horizontal: null,
      vertical: null
    };

    // Determine primary direction
    if (distance.x > distance.y && distance.x > threshold) {
      direction.horizontal = deltaX > 0 ? 'right' : 'left';
    } else if (distance.y > threshold) {
      direction.vertical = deltaY > 0 ? 'down' : 'up';
    }

    // Check if swipe meets velocity requirement
    const meetsVelocityThreshold = 
      (direction.horizontal && velocity.x > velocityThreshold) ||
      (direction.vertical && velocity.y > velocityThreshold);

    if (meetsVelocityThreshold || distance.x > threshold || distance.y > threshold) {
      const swipeEvent: SwipeEvent = {
        direction,
        distance,
        velocity,
        duration
      };

      // Call appropriate handlers
      if (onSwipe) onSwipe(swipeEvent);
      
      if (direction.horizontal === 'left' && onSwipeLeft) {
        onSwipeLeft(swipeEvent);
      } else if (direction.horizontal === 'right' && onSwipeRight) {
        onSwipeRight(swipeEvent);
      } else if (direction.vertical === 'up' && onSwipeUp) {
        onSwipeUp(swipeEvent);
      } else if (direction.vertical === 'down' && onSwipeDown) {
        onSwipeDown(swipeEvent);
      }
    }

    startPos.current = null;
    setIsTracking(false);
  }, [onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocityThreshold]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent && startPos.current) {
      e.preventDefault();
    }
  }, [preventDefaultTouchmoveEvent]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX, touch.clientY);
  }, [handleEnd]);

  // Mouse event handlers (if trackMouse is enabled)
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!trackMouse) return;
    handleStart(e.clientX, e.clientY);
  }, [trackMouse, handleStart]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!trackMouse) return;
    handleEnd(e.clientX, e.clientY);
  }, [trackMouse, handleEnd]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmoveEvent });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Add mouse event listeners if trackMouse is enabled
    if (trackMouse) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (trackMouse) {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
    trackMouse,
    preventDefaultTouchmoveEvent
  ]);

  return { ref: elementRef, isTracking };
}

// Hook for swipe-to-navigate functionality
export function useSwipeNavigation(
  onPrevious?: () => void,
  onNext?: () => void,
  options: Partial<UseSwipeOptions> = {}
) {
  return useSwipe({
    onSwipeLeft: onNext ? () => onNext() : undefined,
    onSwipeRight: onPrevious ? () => onPrevious() : undefined,
    threshold: 100,
    velocityThreshold: 0.5,
    ...options
  });
}
