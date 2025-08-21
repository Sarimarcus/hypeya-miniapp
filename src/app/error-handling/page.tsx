'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Bug, ExternalLink, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useErrorHandler } from '@/utils/errorHandler';
import { ErrorBoundary, APIErrorBoundary } from '@/components/error/ErrorBoundary';
import { withErrorBoundary } from '@/components/error/withErrorBoundary';

// Component that throws an error for testing
const ErrorComponent = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('This is a test error from ErrorComponent');
  }
  return <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
    <p className="text-green-800">✅ Component loaded successfully!</p>
  </div>;
};

// Component wrapped with error boundary
const SafeErrorComponent = withErrorBoundary(ErrorComponent);

// Component that simulates API error
const APIComponent = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('API request failed: 500 Internal Server Error');
  }
  return <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <p className="text-blue-800">📡 API data loaded successfully!</p>
  </div>;
};

export default function ErrorHandlingDemo() {
  const [componentError, setComponentError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [boundaryError, setBoundaryError] = useState(false);
  const { logError, getErrorHistory, clearErrorHistory } = useErrorHandler();

  const handleManualError = () => {
    try {
      throw new Error('This is a manually logged error');
    } catch (error) {
      logError(error as Error, {
        component: 'ErrorHandlingDemo',
        action: 'manual_test',
        metadata: { testType: 'manual_error_logging' }
      });
    }
  };

  const handlePromiseRejection = () => {
    // This will be caught by the global unhandled rejection handler
    Promise.reject(new Error('Unhandled promise rejection test'));
  };

  const errorHistory = getErrorHistory();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              <Home className="w-5 h-5" />
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Error Handling Demo</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Bug className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Error Handling Demo</h1>
              <p className="text-gray-600">Test error boundaries and error logging</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Demo/Testing Purpose Only
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Error Boundary Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Error Boundary Tests
              </CardTitle>
              <CardDescription>
                Test React Error Boundaries with different error scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Component Error Test */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Component Error</h3>
                  <Button
                    size="sm"
                    variant={componentError ? "destructive" : "outline"}
                    onClick={() => setComponentError(!componentError)}
                  >
                    {componentError ? 'Fix Component' : 'Break Component'}
                  </Button>
                </div>
                <ErrorBoundary>
                  <ErrorComponent shouldError={componentError} />
                </ErrorBoundary>
              </div>

              {/* API Error Test */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">API Error</h3>
                  <Button
                    size="sm"
                    variant={apiError ? "destructive" : "outline"}
                    onClick={() => setApiError(!apiError)}
                  >
                    {apiError ? 'Fix API' : 'Break API'}
                  </Button>
                </div>
                <APIErrorBoundary>
                  <APIComponent shouldError={apiError} />
                </APIErrorBoundary>
              </div>

              {/* HOC Error Boundary Test */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">HOC Error Boundary</h3>
                  <Button
                    size="sm"
                    variant={boundaryError ? "destructive" : "outline"}
                    onClick={() => setBoundaryError(!boundaryError)}
                  >
                    {boundaryError ? 'Fix Component' : 'Break Component'}
                  </Button>
                </div>
                <SafeErrorComponent shouldError={boundaryError} />
              </div>
            </CardContent>
          </Card>

          {/* Manual Error Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Error Logging</CardTitle>
              <CardDescription>
                Test manual error logging and global error handlers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualError}
                >
                  Log Manual Error
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePromiseRejection}
                >
                  Promise Rejection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This will trigger the global error handler
                    const globalWindow = window as unknown as Record<string, () => void>;
                    globalWindow.nonExistentFunction();
                  }}
                >
                  Runtime Error
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error History */}
          <Card>
            <CardHeader>
              <CardTitle>Error History</CardTitle>
              <CardDescription>
                View logged errors from this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  {errorHistory.length} error(s) logged
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearErrorHistory}
                  disabled={errorHistory.length === 0}
                >
                  Clear History
                </Button>
              </div>

              {errorHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No errors logged yet. Try the tests above!
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {errorHistory.reverse().map((error, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-red-800 text-sm">
                          {error.componentStack || 'Global Error'}
                        </span>
                        <span className="text-xs text-red-600">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-red-700 font-mono">
                        {error.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Related Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Link href="/mobile-ux">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Mobile UX Demo
                  </Button>
                </Link>
                <Link href="/performance">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Performance Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
