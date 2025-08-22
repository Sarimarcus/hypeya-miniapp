// Mobile-optimized article card component
// Displays article preview with mobile-friendly layout

import { Calendar, Clock, Tag, User } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { WordPressImage } from '@/components/common/OptimizedImage';
import { cn } from '@/lib/utils';
import { Article } from '@/types/article';
import { TipCreator } from '@/components/web3';
import { getValidatedAuthorWallet } from '@/utils/authorWallet';

interface ArticleCardProps {
  article?: Article;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  showTipCreator?: boolean;
  loading?: boolean;
}

export function ArticleCard({
  article,
  onClick,
  className,
  variant = 'default',
  showAuthor = true,
  showCategory = true,
  showTags = false,
  showTipCreator = false,
  loading = false
}: ArticleCardProps) {
  if (loading || !article) {
    return <ArticleCardSkeleton variant={variant} className={className} />;
  }

  // Handle opening article in new tab
  const handleArticleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: open article in new tab using WordPress link or fallback
      const baseUrl = article.link || `https://hypeya.xyz/${article.slug}/`;
      // Append UTM parameters for Google Analytics attribution
      const trackedUrl = (() => {
        try {
          const url = new URL(baseUrl);
          // Standard UTM parameters
          url.searchParams.set('utm_source', 'base-miniapp');
          url.searchParams.set('utm_medium', 'referral');
          url.searchParams.set('utm_campaign', 'miniapp');
          url.searchParams.set('utm_content', article.slug);
          return url.toString();
        } catch {
          return baseUrl; // Fallback if URL parsing fails
        }
      })();
      window.open(trackedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const cardClasses = {
    default: 'p-4',
    compact: 'p-3',
    featured: 'p-5'
  };

  const imageClasses = {
    default: 'aspect-video',
    compact: 'aspect-[4/3]',
    featured: 'aspect-[16/10]'
  };

  const titleClasses = {
    default: 'text-lg font-semibold line-clamp-2',
    compact: 'text-base font-semibold line-clamp-2',
    featured: 'text-xl font-bold line-clamp-2'
  };

  const excerptClasses = {
    default: 'text-sm text-gray-600 line-clamp-3',
    compact: 'text-xs text-gray-600 line-clamp-2',
    featured: 'text-base text-gray-600 line-clamp-4'
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
        'border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-hypeya-500 focus:ring-offset-2'
      )}
      onClick={handleArticleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleArticleClick();
        }
      }}
      tabIndex={0}
      role="article"
      aria-label={`Leer artículo: ${article.title}`}
    >
      <CardContent className={cardClasses[variant]}>
        {/* Featured Image */}
        {article.featuredImage && (
          <div className={cn('mb-3 overflow-hidden rounded-lg relative', imageClasses[variant])}>
            <WordPressImage
              image={article.featuredImage}
              className="transition-transform duration-300 hover:scale-105"
              size="large"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Category Badge */}
        {showCategory && article.categories.length > 0 && (
          <div className="mb-2">
            <Badge
              variant="default"
              className="text-xs text-white"
              style={{ backgroundColor: '#6a40f2' }}
              aria-label={`Categoría: ${article.categories[0].name}`}
            >
              <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
              {article.categories[0].name}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h3 className={cn(titleClasses[variant], 'mb-2 text-gray-900 font-title')} id={`article-title-${article.id}`}>
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className={cn(excerptClasses[variant], 'mb-3 font-content')} aria-describedby={`article-title-${article.id}`}>
            {stripHtml(article.excerpt)}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500" role="group" aria-label="Metadatos del artículo">
          {/* Published Date */}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <time dateTime={article.publishedAt.toISOString()} aria-label={`Publicado el ${formatDate(article.publishedAt)}`}>
              {formatDate(article.publishedAt)}
            </time>
          </div>

          {/* Reading Time (estimated) */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span aria-label={`Tiempo de lectura estimado: ${Math.max(1, Math.ceil(stripHtml(article.content).length / 1000))} minutos`}>
              {Math.max(1, Math.ceil(stripHtml(article.content).length / 1000))} min
            </span>
          </div>

          {/* Author */}
          {showAuthor && article.author && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" aria-hidden="true" />
              <span aria-label={`Autor: ${article.author.name || 'Equipo Hypeya'}`}>
                {article.author.name || 'Equipo Hypeya'}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {showTags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Tip Creator */}
        {showTipCreator && article.author && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <TipCreator
              authorName={article.author.name || 'Hypeya Team'}
              authorAddress={getValidatedAuthorWallet(article.author)}
              className="justify-center"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton loader for article cards
export function ArticleCardSkeleton({
  variant = 'default',
  className
}: {
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}) {
  const cardClasses = {
    default: 'p-4',
    compact: 'p-3',
    featured: 'p-5'
  };

  const imageClasses = {
    default: 'aspect-video',
    compact: 'aspect-[4/3]',
    featured: 'aspect-[16/10]'
  };

  return (
    <Card className={cn('border border-gray-200 bg-white', className)}>
      <CardContent className={cardClasses[variant]}>
        {/* Image skeleton */}
        <div className={cn(
          'mb-3 bg-gray-200 rounded-lg animate-pulse',
          imageClasses[variant]
        )} />

        {/* Category skeleton */}
        <div className="mb-2">
          <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-3">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Metadata skeleton */}
        <div className="flex gap-3">
          <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Compact article card for lists
export function CompactArticleCard({
  article,
  onClick,
  className
}: {
  article: Article;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <ArticleCard
      article={article}
      onClick={onClick}
      variant="compact"
      showAuthor={false}
      showTags={false}
      className={className}
    />
  );
}

// Featured article card for hero sections
export function FeaturedArticleCard({
  article,
  onClick,
  className
}: {
  article: Article;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <ArticleCard
      article={article}
      onClick={onClick}
      variant="featured"
      showAuthor={true}
      showTags={true}
      showTipCreator={true}
      className={className}
    />
  );
}
