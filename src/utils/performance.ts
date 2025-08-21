// Performance optimization utilities
// Image optimization, lazy loading, and performance monitoring

import { useState, useEffect } from 'react';

// Performance metrics interface
export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

// Performance monitoring hook
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Web Vitals measurement
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + (entry as any).value }));
            }
            break;
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'navigation':
            setMetrics(prev => ({ ...prev, ttfb: (entry as PerformanceNavigationTiming).responseStart }));
            break;
        }
      }
    });

    // Register observers
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      observer.observe({ entryTypes: ['first-input'] });
      observer.observe({ entryTypes: ['layout-shift'] });
      observer.observe({ entryTypes: ['paint'] });
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
}

// Lazy loading intersection observer hook
export function useLazyLoading(threshold: number = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isVisible] as const;
}

// Image preloader utility
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Critical resource preloader
export function preloadCriticalResources(resources: string[]) {
  if (typeof window === 'undefined') return;

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else {
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
}

// Bundle size analyzer (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const sizes = {
    scripts: scripts.length,
    styles: styles.length,
    total: scripts.length + styles.length
  };

  console.log('Bundle Analysis:', sizes);
  return sizes;
}

// Memory usage monitor
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      });
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// FPS monitor
export function useFPSMonitor() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(measureFPS);
    };

    animationFrame = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return fps;
}

// Network speed detection
export function useNetworkSpeed() {
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !(navigator as any).connection) return;

    const connection = (navigator as any).connection;
    
    const updateNetworkInfo = () => {
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });
    };

    updateNetworkInfo();
    connection.addEventListener('change', updateNetworkInfo);

    return () => connection.removeEventListener('change', updateNetworkInfo);
  }, []);

  return networkInfo;
}

// Performance budget checker
export function checkPerformanceBudget(metrics: Partial<PerformanceMetrics>) {
  const budgets = {
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    fcp: 1800, // 1.8s
    ttfb: 600  // 600ms
  };

  const results = Object.entries(budgets).map(([metric, budget]) => {
    const value = metrics[metric as keyof PerformanceMetrics];
    return {
      metric,
      value,
      budget,
      passing: value !== undefined ? value <= budget : null,
      percentage: value !== undefined ? (value / budget) * 100 : null
    };
  });

  return results;
}

// Image optimization recommendations
export function getImageOptimizationRecommendations(
  width: number,
  height: number,
  format: 'webp' | 'avif' | 'jpg' | 'png' = 'webp'
) {
  const aspectRatio = width / height;
  
  // Common responsive breakpoints
  const breakpoints = [640, 768, 1024, 1280, 1536];
  
  const sizes = breakpoints.map(bp => {
    const recommendedWidth = Math.min(width, bp);
    const recommendedHeight = Math.round(recommendedWidth / aspectRatio);
    
    return {
      width: recommendedWidth,
      height: recommendedHeight,
      breakpoint: bp,
      format
    };
  });

  return {
    original: { width, height, format },
    responsive: sizes,
    srcSet: sizes.map(size => 
      `${size.width}w`
    ).join(', '),
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  };
}

// Cache optimization
export class PerformanceCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: unknown, ttl = 300000) { // 5 minutes default
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Export performance cache instance
export const performanceCache = new PerformanceCache();
