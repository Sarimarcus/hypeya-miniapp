'use client';

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { errorHandler } from '@/utils/errorHandler';

// Higher-order component for wrapping components with error handling
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  const WrappedComponent = function(props: P) {
    const FallbackComponent = fallback;

    return (
      <ErrorBoundary
        fallback={
          FallbackComponent ? (
            <FallbackComponent
              error={new Error('Component error')}
              retry={() => window.location.reload()}
            />
          ) : undefined
        }
        onError={(error, errorInfo) => {
          errorHandler.logError(error, {
            component: Component.displayName || Component.name || 'Unknown',
            action: 'component_error',
            metadata: {
              props: props as Record<string, unknown>,
              componentStack: errorInfo.componentStack
            }
          });
        }}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Pre-configured error boundary components for common use cases
export const SafeComponent = withErrorBoundary;

// Error boundary specifically for async components
export function AsyncErrorBoundary({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">Loading Error</p>
            <p className="text-yellow-600 text-sm">
              Failed to load content. Please try refreshing the page.
            </p>
          </div>
        )
      }
      onError={(error, errorInfo) => {
        errorHandler.logError(error, {
          component: 'AsyncErrorBoundary',
          action: 'async_load_failed',
          metadata: { errorInfo }
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
