// Mobile-optimized error message component
// Displays user-friendly error messages with retry functionality

'use client';

import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'default' | 'inline' | 'toast';
  className?: string;
  retryText?: string;
}

export function ErrorMessage({
  title = 'Algo salió mal',
  message,
  onRetry,
  onDismiss,
  variant = 'default',
  className,
  retryText = 'Intentar de nuevo'
}: ErrorMessageProps) {
  const baseClasses = 'flex flex-col items-center text-center';

  const variantClasses = {
    default: 'p-6 rounded-lg border border-red-200 bg-red-50',
    inline: 'p-4 rounded-md border border-red-200 bg-red-50',
    toast: 'p-4 rounded-lg bg-red-500 text-white shadow-lg'
  };

  const iconClasses = {
    default: 'w-12 h-12 text-red-500 mb-3',
    inline: 'w-8 h-8 text-red-500 mb-2',
    toast: 'w-6 h-6 text-white mb-2'
  };

  const titleClasses = {
    default: 'text-lg font-semibold text-red-800 mb-2',
    inline: 'text-base font-semibold text-red-800 mb-1',
    toast: 'text-base font-semibold text-white mb-1'
  };

  const messageClasses = {
    default: 'text-red-700 mb-4 leading-relaxed',
    inline: 'text-red-700 mb-3 text-sm',
    toast: 'text-red-100 mb-3 text-sm'
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {/* Dismiss button for toast variant */}
      {variant === 'toast' && onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-600 transition-colors"
          aria-label="Descartar error"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Error icon */}
      <AlertCircle className={iconClasses[variant]} />

      {/* Error title */}
      <h3 className={titleClasses[variant]}>
        {title}
      </h3>

      {/* Error message */}
      <p className={messageClasses[variant]}>
        {message}
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant={variant === 'toast' ? 'secondary' : 'default'}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {retryText}
          </Button>
        )}

        {onDismiss && variant !== 'toast' && (
          <Button
            onClick={onDismiss}
            variant="outline"
            size="sm"
          >
            Cerrar
          </Button>
        )}
      </div>
    </div>
  );
}

// Simplified error message for inline use
export function InlineError({
  message,
  onRetry,
  className
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-md bg-red-50 border border-red-200',
      className
    )}>
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <span className="text-sm text-red-700">{message}</span>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-100 ml-2"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

// Network error specific component
export function NetworkError({
  onRetry,
  className
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <ErrorMessage
      title="Problema de conexión"
      message="Por favor, verifica tu conexión a internet e inténtalo de nuevo."
      onRetry={onRetry}
      retryText="Reintentar"
      className={className}
    />
  );
}

// Not found error component
export function NotFoundError({
  type = "content",
  onGoBack,
  className
}: {
  type?: string;
  onGoBack?: () => void;
  className?: string;
}) {
  return (
    <ErrorMessage
      title="No encontrado"
      message={`El ${type} que buscas no existe o ha sido movido.`}
      onRetry={onGoBack}
      retryText="Volver"
      className={className}
    />
  );
}
