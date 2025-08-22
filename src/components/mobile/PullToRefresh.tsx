// Pull-to-refresh functionality for mobile devices
// Provides native-like refresh experience

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  threshold = 80,
  maxPullDistance = 120,
  disabled = false
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Check if we can start pulling (at top of page)
  const checkCanPull = useCallback(() => {
    if (!containerRef.current) return false;

    const scrollTop = containerRef.current.scrollTop || window.scrollY;
    return scrollTop <= 0;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;

    const canStartPull = checkCanPull();
    setCanPull(canStartPull);

    if (canStartPull) {
      startYRef.current = e.touches[0].clientY;
      currentYRef.current = startYRef.current;
      lastTimeRef.current = Date.now();
      setIsPulling(true);
    }
  }, [disabled, isRefreshing, checkCanPull]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing || !isPulling || !canPull) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    // Only pull down when at the top
    if (deltaY > 0 && checkCanPull()) {
      e.preventDefault();

      // Calculate velocity for smoother experience
      const now = Date.now();
      const timeDelta = now - lastTimeRef.current;
      const positionDelta = currentY - currentYRef.current;

      if (timeDelta > 0) {
        velocityRef.current = positionDelta / timeDelta;
      }

      // Apply easing to pull distance
      const easedDistance = Math.min(
        deltaY * 0.5, // Damping factor
        maxPullDistance
      );

      setPullDistance(easedDistance);
      currentYRef.current = currentY;
      lastTimeRef.current = now;
    }
  }, [disabled, isRefreshing, isPulling, canPull, checkCanPull, maxPullDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !isPulling) return;

    setIsPulling(false);
    setCanPull(false);

    // Trigger refresh if pulled beyond threshold
    if (pullDistance >= threshold) {
      setIsRefreshing(true);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    // Reset pull distance with animation
    setPullDistance(0);
  }, [disabled, isRefreshing, isPulling, pullDistance, threshold, onRefresh]);

  // Add touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Calculate refresh indicator properties
  const progress = Math.min(pullDistance / threshold, 1);
  const opacity = Math.min(pullDistance / 50, 1);
  const scale = 0.5 + (progress * 0.5);
  const rotation = progress * 180;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-auto',
        'touch-pan-y', // Allow vertical scrolling
        className
      )}
      style={{
        transform: isPulling ? `translateY(${Math.min(pullDistance * 0.3, 40)}px)` : 'none',
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className={cn(
          'absolute top-0 left-1/2 transform -translate-x-1/2 z-50',
          'flex items-center justify-center',
          'w-12 h-12 rounded-full bg-white shadow-lg border',
          'transition-all duration-200 ease-out'
        )}
        style={{
          transform: `translateY(${-24 + (pullDistance * 0.5)}px) scale(${scale})`,
          opacity,
          pointerEvents: 'none'
        }}
      >
        <RefreshCw
          className={cn(
            'w-5 h-5 text-blue-600',
            (isRefreshing || pullDistance >= threshold) && 'animate-spin'
          )}
          style={{
            transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
            transition: isRefreshing ? 'none' : 'transform 0.1s ease-out'
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          paddingTop: isPulling ? `${Math.min(pullDistance * 0.2, 20)}px` : '0px',
          transition: isPulling ? 'none' : 'padding-top 0.3s ease-out'
        }}
      >
        {children}
      </div>

      {/* Loading overlay during refresh */}
      {isRefreshing && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Refreshing...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for pull-to-refresh state management
export function usePullToRefresh(refreshFn: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      await refreshFn();
      setLastRefresh(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFn, isRefreshing]);

  return {
    isRefreshing,
    lastRefresh,
    refresh
  };
}
