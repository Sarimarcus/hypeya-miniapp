/**
 * Global error handling utilities
 * Provides centralized error logging and handling
 */

export interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
}

export type ErrorLevel = "error" | "warning" | "info";

export interface ErrorContext {
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

class ErrorHandler {
  private errorQueue: ErrorDetails[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    // Only setup global handlers in browser environment
    if (typeof window !== "undefined") {
      this.setupGlobalErrorHandlers();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Only setup global handlers on the client side
    if (typeof window === "undefined") return;

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        metadata: { type: "unhandledrejection", reason: event.reason },
      });
    });

    // Handle uncaught errors
    window.addEventListener("error", (event) => {
      this.logError(event.error || new Error(event.message), {
        metadata: {
          type: "uncaughtError",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });
  }

  logError(error: Error, context?: ErrorContext, level: ErrorLevel = "error") {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      url: typeof window !== "undefined" ? window.location.href : "Unknown",
      sessionId: this.sessionId,
    };

    // Add context information
    if (context) {
      errorDetails.componentStack = context.component;
      Object.assign(errorDetails, context.metadata);
    }

    // Log to console based on level
    switch (level) {
      case "error":
        console.error("Error logged:", errorDetails);
        break;
      case "warning":
        console.warn("Warning logged:", errorDetails);
        break;
      case "info":
        console.info("Info logged:", errorDetails);
        break;
    }

    // Store in memory queue
    this.errorQueue.push(errorDetails);

    // Keep only last 50 errors in memory
    if (this.errorQueue.length > 50) {
      this.errorQueue = this.errorQueue.slice(-50);
    }

    // Store in localStorage for persistence
    this.persistToLocalStorage(errorDetails);

    // In production, you could send to external logging service
    if (process.env.NODE_ENV === "production") {
      this.sendToLoggingService(errorDetails);
    }
  }

  private persistToLocalStorage(errorDetails: ErrorDetails) {
    try {
      const existingErrors = JSON.parse(
        localStorage.getItem("app_errors") || "[]"
      );
      existingErrors.push(errorDetails);

      // Keep only last 20 errors in localStorage
      const recentErrors = existingErrors.slice(-20);
      localStorage.setItem("app_errors", JSON.stringify(recentErrors));
    } catch (e) {
      console.warn("Failed to persist error to localStorage:", e);
    }
  }

  private async sendToLoggingService(errorDetails: ErrorDetails) {
    // Placeholder for external logging service
    // You could integrate with services like Sentry, LogRocket, etc.
    try {
      // Example: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorDetails) });
      console.log("Would send to logging service:", errorDetails);
    } catch (e) {
      console.warn("Failed to send error to logging service:", e);
    }
  }

  getErrorHistory(): ErrorDetails[] {
    return [...this.errorQueue];
  }

  getStoredErrors(): ErrorDetails[] {
    try {
      return JSON.parse(localStorage.getItem("app_errors") || "[]");
    } catch (e) {
      console.warn("Failed to retrieve stored errors:", e);
      return [];
    }
  }

  clearErrorHistory() {
    this.errorQueue = [];
    localStorage.removeItem("app_errors");
  }

  // Utility methods for common error scenarios
  logAPIError(error: Error, endpoint: string, method: string = "GET") {
    this.logError(error, {
      component: "API",
      action: "api_request_failed",
      metadata: { endpoint, method },
    });
  }

  logNavigationError(error: Error, route: string) {
    this.logError(error, {
      component: "Navigation",
      action: "route_change_failed",
      metadata: { route },
    });
  }

  logComponentError(
    error: Error,
    componentName: string,
    props?: Record<string, unknown>
  ) {
    this.logError(error, {
      component: componentName,
      action: "component_render_failed",
      metadata: { props },
    });
  }

  logUserAction(action: string, metadata?: Record<string, unknown>) {
    this.logError(
      new Error(`User action: ${action}`),
      {
        component: "User",
        action: "user_interaction",
        metadata,
      },
      "info"
    );
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// React hook for component-level error handling
export function useErrorHandler() {
  const logError = (error: Error, context?: ErrorContext) => {
    errorHandler.logError(error, context);
  };

  const logAPIError = (error: Error, endpoint: string, method?: string) => {
    errorHandler.logAPIError(error, endpoint, method);
  };

  const logComponentError = (
    error: Error,
    componentName: string,
    props?: Record<string, unknown>
  ) => {
    errorHandler.logComponentError(error, componentName, props);
  };

  return {
    logError,
    logAPIError,
    logComponentError,
    getErrorHistory: () => errorHandler.getErrorHistory(),
    clearErrorHistory: () => errorHandler.clearErrorHistory(),
  };
}

// Utility function to wrap async operations with error handling
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.logError(error as Error, context);
      throw error;
    }
  };
}
