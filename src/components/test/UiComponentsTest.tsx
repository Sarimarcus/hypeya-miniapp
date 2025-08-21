// Test component to showcase Phase 3 UI components
'use client';

import { useState } from 'react';
import { LoadingSpinner, InlineSpinner, SkeletonLoader } from '@/components/common/LoadingSpinner';
import { ErrorMessage, InlineError, NetworkError, NotFoundError } from '@/components/common/ErrorMessage';
import { HomeHeader, ArticleHeader, SimpleHeader } from '@/components/layout/Header';
import { ArticleCard, ArticleCardSkeleton, CompactArticleCard, FeaturedArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '../ui/button';
import { Article } from '@/types/article';

export function UiComponentsTest() {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [headerVariant, setHeaderVariant] = useState<'home' | 'article' | 'simple'>('home');

  // Mock article data
  const mockArticle: Article = {
    id: 1,
    slug: 'test-article',
    title: 'Building a Mobile-First NextJS App with WordPress API',
    content: '<p>This is a comprehensive guide to building modern mobile applications...</p>',
    excerpt: 'Learn how to create a mobile-first NextJS application that integrates seamlessly with WordPress REST API for content management.',
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    author: {
      id: 1,
      name: 'John Doe',
      slug: 'john-doe',
      description: 'Frontend Developer & Technical Writer',
      avatarUrl: 'https://via.placeholder.com/96x96'
    },
    featuredImage: {
      id: 1,
      url: 'https://via.placeholder.com/600x400?text=Featured+Image',
      alt: 'Featured image for the article',
      width: 600,
      height: 400,
      sizes: {
        thumbnail: 'https://via.placeholder.com/150x150',
        medium: 'https://via.placeholder.com/300x200',
        large: 'https://via.placeholder.com/600x400',
        full: 'https://via.placeholder.com/1200x800'
      }
    },
    categories: [{
      id: 1,
      name: 'Technology',
      slug: 'technology',
      description: 'Tech articles and tutorials',
      count: 25,
      color: '#3B82F6'
    }],
    tags: [
      { id: 1, name: 'NextJS', slug: 'nextjs', description: '', count: 12 },
      { id: 2, name: 'WordPress', slug: 'wordpress', description: '', count: 8 },
      { id: 3, name: 'Mobile', slug: 'mobile', description: '', count: 15 }
    ]
  };

  const testLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">UI Components Test</h2>

      {/* Header Components */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Headers</h3>
        <div className="space-y-2">
          <Button 
            onClick={() => setHeaderVariant('home')}
            variant={headerVariant === 'home' ? 'default' : 'outline'}
            size="sm"
          >
            Home Header
          </Button>
          <Button 
            onClick={() => setHeaderVariant('article')}
            variant={headerVariant === 'article' ? 'default' : 'outline'}
            size="sm"
          >
            Article Header
          </Button>
          <Button 
            onClick={() => setHeaderVariant('simple')}
            variant={headerVariant === 'simple' ? 'default' : 'outline'}
            size="sm"
          >
            Simple Header
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {headerVariant === 'home' && (
            <HomeHeader 
              onSearch={() => alert('Search clicked')}
              onMenu={() => alert('Menu clicked')}
            />
          )}
          {headerVariant === 'article' && (
            <ArticleHeader 
              articleTitle={mockArticle.title}
              onBack={() => alert('Back clicked')}
            />
          )}
          {headerVariant === 'simple' && (
            <SimpleHeader title="Simple Page" />
          )}
        </div>
      </section>

      {/* Loading Components */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Loading States</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Loading Spinner</h4>
            <LoadingSpinner size="md" text="Loading articles..." />
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Inline Spinner</h4>
            <div className="flex items-center gap-2">
              <InlineSpinner size="sm" />
              <span className="text-sm">Processing...</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Skeleton Loader</h4>
            <SkeletonLoader lines={3} />
          </div>
        </div>

        <Button onClick={testLoading} disabled={loading}>
          {loading ? <InlineSpinner className="mr-2" /> : null}
          Test Loading (2s)
        </Button>
      </section>

      {/* Error Components */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Error States</h3>
        
        <div className="space-y-4">
          <Button onClick={() => setShowError(!showError)}>
            Toggle Error Message
          </Button>
          
          {showError && (
            <div className="space-y-4">
              <ErrorMessage
                title="Failed to load articles"
                message="We couldn't fetch the latest articles. Please check your connection and try again."
                onRetry={() => alert('Retry clicked')}
                onDismiss={() => setShowError(false)}
              />
              
              <InlineError
                message="Failed to save preferences"
                onRetry={() => alert('Inline retry clicked')}
              />
              
              <NetworkError onRetry={() => alert('Network retry clicked')} />
              
              <NotFoundError 
                type="article"
                onGoBack={() => alert('Go back clicked')}
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Card Components */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Article Cards</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Featured Article Card */}
          <div>
            <h4 className="font-medium mb-2">Featured Article Card</h4>
            <FeaturedArticleCard 
              article={mockArticle}
              onClick={() => alert('Featured article clicked')}
            />
          </div>
          
          {/* Default Article Card */}
          <div>
            <h4 className="font-medium mb-2">Default Article Card</h4>
            <ArticleCard 
              article={mockArticle}
              onClick={() => alert('Default article clicked')}
            />
          </div>
          
          {/* Compact Article Card */}
          <div>
            <h4 className="font-medium mb-2">Compact Article Card</h4>
            <CompactArticleCard 
              article={mockArticle}
              onClick={() => alert('Compact article clicked')}
            />
          </div>
          
          {/* Loading States */}
          <div>
            <h4 className="font-medium mb-2">Loading States</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ArticleCardSkeleton variant="default" />
              <ArticleCardSkeleton variant="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Optimization Note */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Mobile Optimization</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All components are touch-friendly (44px+ touch targets)</li>
          <li>• Headers are sticky and mobile-optimized</li>
          <li>• Article cards scale properly on mobile viewports</li>
          <li>• Loading states provide clear feedback</li>
          <li>• Error messages are concise and actionable</li>
        </ul>
      </section>
    </div>
  );
}
