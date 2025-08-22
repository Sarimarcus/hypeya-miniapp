// Enhanced optimized image component with lazy loading
// Performance-focused image component with WebP support and responsive loading

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLazyLoading } from '@/utils/performance';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  lazy?: boolean;
  threshold?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  fallbackSrc,
  lazy = true,
  threshold = 0.1,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref: lazyRef, isInView: isVisible } = useLazyLoading(threshold);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Determine if image should load
  const shouldLoad = !lazy || priority || isVisible;

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (fill
    ? '100vw'
    : width
      ? `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${width}px`
      : '100vw'
  );

  // Create optimized blur placeholder
  const createBlurPlaceholder = (w: number = 40, h: number = 40) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `)}`;
  };

  const imageSrc = imageError && fallbackSrc ? fallbackSrc : src;
  const shouldUseBlur = placeholder === 'blur' && (blurDataURL || (width && height));
  const actualBlurDataURL = blurDataURL || (width && height ? createBlurPlaceholder(width, height) : undefined);

  return (
    <div
      ref={lazyRef}
      className={cn(
        'relative overflow-hidden',
        fill && 'w-full h-full',
        className
      )}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {shouldLoad ? (
        <Image
          src={imageSrc}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          sizes={responsiveSizes}
          placeholder={shouldUseBlur ? 'blur' : 'empty'}
          blurDataURL={actualBlurDataURL}
          className={cn(
            'transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0',
            fill && 'object-cover'
          )}
          style={fill ? {
            objectFit,
            objectPosition
          } : undefined}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      ) : (
        // Lazy loading placeholder
        <div
          className={cn(
            'w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse',
            'flex items-center justify-center'
          )}
          style={!fill && width && height ? { width, height } : undefined}
        >
          <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
        </div>
      )}

      {/* Loading overlay */}
      {shouldLoad && !imageLoaded && !imageError && (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200',
          'flex items-center justify-center animate-pulse'
        )}>
          <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {imageError && !fallbackSrc && (
        <div className={cn(
          'absolute inset-0 bg-gray-100 border-2 border-dashed border-gray-300',
          'flex flex-col items-center justify-center text-gray-400'
        )}>
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">Image unavailable</span>
        </div>
      )}
    </div>
  );
}

// Specialized image variants
export function AvatarImage({
  src,
  alt,
  size = 40,
  className,
  fallbackSrc = '/images/default-avatar.png',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full', className)}
      fallbackSrc={fallbackSrc}
      quality={85}
      {...props}
    />
  );
}

export function HeroImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      className={cn('object-cover', className)}
      sizes="100vw"
      {...props}
    />
  );
}

export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={300}
      height={200}
      className={cn('rounded-lg', className)}
      quality={70}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
      {...props}
    />
  );
}

// Performance-aware image gallery
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
  itemClassName?: string;
  loading?: 'lazy' | 'eager';
  onImageClick?: (index: number) => void;
}

export function ImageGallery({
  images,
  className,
  itemClassName,
  loading = 'lazy',
  onImageClick
}: ImageGalleryProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn('aspect-square cursor-pointer', itemClassName)}
          onClick={() => onImageClick?.(index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            lazy={loading === 'lazy'}
            className="rounded-lg hover:opacity-90 transition-opacity"
            quality={70}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
