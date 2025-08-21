// Swipeable component wrapper for React elements
// Provides swipe gesture detection to any component

'use client';

import React from 'react';
import { useSwipe, UseSwipeOptions } from '@/hooks/useSwipe';

interface SwipeableProps extends UseSwipeOptions {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Swipeable({ 
  children, 
  className, 
  style, 
  ...swipeOptions 
}: SwipeableProps) {
  const { ref } = useSwipe<HTMLDivElement>(swipeOptions);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
