// Performance monitor component
// Real-time performance metrics display for development

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  usePerformanceMetrics, 
  useMemoryMonitor, 
  useFPSMonitor, 
  useNetworkSpeed,
  checkPerformanceBudget,
  performanceCache
} from '@/utils/performance';
import { cn } from '@/lib/utils';

type TabType = 'vitals' | 'memory' | 'network' | 'cache';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData?: boolean;
}

interface PerformanceBudgetResult {
  metric: string;
  value?: number;
  passing: boolean | null;
}

interface PerformanceMonitorProps {
  className?: string;
  compact?: boolean;
  autoHide?: boolean;
}

export function PerformanceMonitor({ 
  className, 
  compact = false, 
  autoHide = true 
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(!autoHide || process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'vitals' | 'memory' | 'network' | 'cache'>('vitals');
  
  const performanceMetrics = usePerformanceMetrics();
  const memoryInfo = useMemoryMonitor();
  const fps = useFPSMonitor();
  const networkInfo = useNetworkSpeed();

  // Hide in production unless explicitly shown
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && autoHide) {
      setIsVisible(false);
    }
  }, [autoHide]);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
      >
        📊
      </Button>
    );
  }

  const budgetResults = checkPerformanceBudget(performanceMetrics);

  return (
    <Card className={cn(
      'fixed bottom-4 right-4 z-50 p-4 max-w-sm',
      compact ? 'max-h-32' : 'max-h-96',
      'overflow-auto shadow-lg',
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Performance Monitor</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="p-1 h-auto"
        >
          ✕
        </Button>
      </div>

      {/* Tabs */}
      {!compact && (
        <div className="flex gap-1 mb-3">
          {[
            { key: 'vitals', label: 'Vitals' },
            { key: 'memory', label: 'Memory' },
            { key: 'network', label: 'Network' },
            { key: 'cache', label: 'Cache' }
          ].map(tab => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as 'vitals' | 'memory' | 'network' | 'cache')}
              className="text-xs px-2 py-1"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-2 text-xs">
        {(compact || activeTab === 'vitals') && (
          <VitalsPanel 
            budgetResults={budgetResults}
            fps={fps}
            compact={compact}
          />
        )}

        {!compact && activeTab === 'memory' && (
          <MemoryPanel memoryInfo={memoryInfo} />
        )}

        {!compact && activeTab === 'network' && (
          <NetworkPanel networkInfo={networkInfo} />
        )}

        {!compact && activeTab === 'cache' && (
          <CachePanel />
        )}
      </div>
    </Card>
  );
}

function VitalsPanel({ 
  budgetResults, 
  fps, 
  compact 
}: { 
  budgetResults: PerformanceBudgetResult[]; 
  fps: number; 
  compact: boolean;
}) {
  const getScoreColor = (passing: boolean | null) => {
    if (passing === null) return 'secondary';
    return passing ? 'default' : 'destructive';
  };

  const formatValue = (value: number | undefined, unit: string) => {
    if (value === undefined) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">Core Web Vitals</span>
        <Badge variant={fps > 55 ? 'default' : fps > 45 ? 'secondary' : 'destructive'}>
          {fps} FPS
        </Badge>
      </div>

      {budgetResults.slice(0, compact ? 3 : 5).map(result => (
        <div key={result.metric} className="flex items-center justify-between">
          <span className="capitalize">
            {result.metric.toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono">
              {formatValue(
                result.value, 
                result.metric === 'cls' ? '' : 
                result.metric === 'fid' ? 'ms' : 'ms'
              )}
            </span>
            <Badge 
              variant={getScoreColor(result.passing)}
              className="text-xs px-1"
            >
              {result.passing === null ? '?' : result.passing ? '✓' : '✗'}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function MemoryPanel({ memoryInfo }: { memoryInfo: MemoryInfo | null }) {
  if (!memoryInfo) {
    return <div className="text-gray-500">Memory info not available</div>;
  }

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">Memory Usage</div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Used Heap:</span>
          <span className="font-mono">{formatBytes(memoryInfo.usedJSHeapSize)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Total Heap:</span>
          <span className="font-mono">{formatBytes(memoryInfo.totalJSHeapSize)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Heap Limit:</span>
          <span className="font-mono">{formatBytes(memoryInfo.jsHeapSizeLimit)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Usage:</span>
          <Badge 
            variant={memoryInfo.usagePercentage > 80 ? 'destructive' : 
                    memoryInfo.usagePercentage > 60 ? 'secondary' : 'default'}
          >
            {memoryInfo.usagePercentage.toFixed(1)}%
          </Badge>
        </div>
      </div>
    </div>
  );
}

function NetworkPanel({ networkInfo }: { networkInfo: NetworkInfo | null }) {
  if (!networkInfo) {
    return <div className="text-gray-500">Network info not available</div>;
  }

  const getConnectionColor = (type: string) => {
    switch (type) {
      case '4g': return 'default';
      case '3g': return 'secondary';
      case '2g': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">Network Status</div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>Connection:</span>
          <Badge variant={getConnectionColor(networkInfo.effectiveType)}>
            {networkInfo.effectiveType.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Downlink:</span>
          <span className="font-mono">{networkInfo.downlink} Mbps</span>
        </div>
        
        <div className="flex justify-between">
          <span>RTT:</span>
          <span className="font-mono">{networkInfo.rtt}ms</span>
        </div>
        
        {networkInfo.saveData && (
          <div className="flex justify-between items-center">
            <span>Data Saver:</span>
            <Badge variant="secondary">ON</Badge>
          </div>
        )}
      </div>
    </div>
  );
}

function CachePanel() {
  const [cacheStats, setCacheStats] = useState({ size: 0 });

  useEffect(() => {
    const updateStats = () => {
      setCacheStats({
        size: performanceCache.size()
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div className="font-medium">Cache Status</div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Cache Size:</span>
          <span className="font-mono">{cacheStats.size} items</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            performanceCache.clear();
            setCacheStats({ size: 0 });
          }}
          className="w-full text-xs"
        >
          Clear Cache
        </Button>
      </div>
    </div>
  );
}
