// Optimized image component with fallback handling
// Handles WordPress images and external images gracefully

import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
  priority = false,
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else {
      setImageError(true);
    }
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (imageError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt || 'Image placeholder'}
      >
        <ImageIcon className="w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gray-200 rounded',
            className
          )}
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        priority={priority}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </>
  );
}

// WordPress featured image component
export function WordPressImage({
  image,
  className,
  priority = false,
  size = 'large'
}: {
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
    sizes?: {
      thumbnail?: string;
      medium?: string;
      large?: string;
      full: string;
    };
  };
  className?: string;
  priority?: boolean;
  size?: 'thumbnail' | 'medium' | 'large' | 'full';
}) {
  // Choose the appropriate image size
  const getSrc = () => {
    if (image.sizes && size !== 'full') {
      return image.sizes[size] || image.sizes.large || image.sizes.medium || image.url;
    }
    return image.url;
  };

  const getFallbackSrc = () => {
    if (image.sizes) {
      // Try progressively smaller sizes as fallback
      if (size === 'large') return image.sizes.medium || image.sizes.thumbnail;
      if (size === 'medium') return image.sizes.thumbnail;
    }
    return undefined;
  };

  return (
    <OptimizedImage
      src={getSrc()}
      alt={image.alt}
      width={image.width}
      height={image.height}
      className={className}
      fallbackSrc={getFallbackSrc()}
      priority={priority}
    />
  );
}

// Avatar image component for authors
export function AvatarImage({
  src,
  alt,
  size = 'md',
  className
}: {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const pixelSizes = {
    sm: 32,
    md: 48,
    lg: 64
  };

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-200 rounded-full text-gray-500',
          sizeClasses[size],
          className
        )}
      >
        <span className="text-xs font-medium">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-full', sizeClasses[size], className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={pixelSizes[size]}
        height={pixelSizes[size]}
        className="rounded-full"
      />
    </div>
  );
}
