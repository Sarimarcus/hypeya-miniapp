'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SearchBar, Filters } from '@/components/search';
import { useFilteredArticles, useCategories } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Swipeable } from '@/components/mobile/Swipeable';
import { useHaptics } from '@/utils/haptics';

export default function HomePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as number[],
    tags: [] as number[],
    search: '' as string
  });

  const router = useRouter();

  // Memoize the filters object to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => ({
    categories: filters.categories,
    tags: filters.tags,
    search: filters.search,
  }), [filters.categories, filters.tags, filters.search]);

  const { articles, loading, error, loadMore, pagination, hasActiveFilters } = useFilteredArticles(
    memoizedFilters,
    1,
    6
  );
  const { categories, loading: categoriesLoading } = useCategories();
  const { triggerHaptic } = useHaptics();

  // Mobile UX: Refresh functionality (temporarily disabled)
  // const handleRefresh = async () => {
  //   triggerHaptic('impact-medium');
  //   // Simulate refresh delay
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   window.location.reload();
  // };

  // Mobile UX: Swipe navigation
  const handleSwipeLeft = () => {
    triggerHaptic('selection');
    console.log('Swiped left - next page');
  };

  const handleSwipeRight = () => {
    triggerHaptic('selection');
    console.log('Swiped right - previous page');
  };

  const handleFiltersChange = (newFilters: { categories: number[]; tags: number[] }) => {
    setFilters(prev => ({
      ...prev,
      categories: newFilters.categories,
      tags: newFilters.tags
    }));
  };

  const handleAdvancedSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <PullToRefresh onRefresh={handleRefresh}> */}
        <Swipeable
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          threshold={100}
        >
          <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <section className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/hypeya-logo.png"
              alt="HYPEYA Logo"
              width={200}
              height={80}
              className="h-16 md:h-20 w-auto"
              priority
            />
          </div>
          <p className="text-xl font-content text-gray-600 max-w-2xl mx-auto mb-6">
            Discover the latest articles, insights, and stories from our community
          </p>

          {/* Prominent Search Bar */}
          <div className="max-w-md mx-auto mb-4">
            <SearchBar
              onAdvancedSearch={handleAdvancedSearch}
              placeholder="Search articles..."
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 border-hypeya-600 text-hypeya-600 hover:bg-hypeya-50"
            aria-expanded={showFilters}
            aria-controls="filters-section"
            aria-label={`${showFilters ? 'Hide' : 'Show'} article filters`}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <Badge 
                variant="default" 
                className="ml-2 text-white" 
                style={{ backgroundColor: '#6a40f2' }}
                aria-label={`${filters.categories.length + filters.tags.length} active filters`}
              >
                {filters.categories.length + filters.tags.length}
              </Badge>
            )}
          </Button>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <section id="filters-section" className="mb-8" aria-label="Article filtering options">
            <Filters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              compact
            />
          </section>
        )}

        {/* Categories Section */}
        {!categoriesLoading && categories.length > 0 && !hasActiveFilters && (
          <section className="mb-12">
            <h2 className="text-2xl font-title font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Category quick filters">
              {categories.slice(0, 8).map((category) => (
                <Badge
                  key={category.id}
                  variant="default"
                  className="cursor-pointer transition-colors text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  style={{ backgroundColor: '#6a40f2' }}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    categories: prev.categories.includes(category.id)
                      ? prev.categories.filter(id => id !== category.id)
                      : [...prev.categories, category.id]
                  }))}
                  role="button"
                  tabIndex={0}
                  aria-label={`Filter by ${category.name} category (${category.count} articles)`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFilters(prev => ({
                        ...prev,
                        categories: prev.categories.includes(category.id)
                          ? prev.categories.filter(id => id !== category.id)
                          : [...prev.categories, category.id]
                      }));
                    }
                  }}
                >
                  {category.name} <span aria-hidden="true">({category.count})</span>
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-title font-bold text-gray-900">
              {hasActiveFilters ? 'Filtered Articles' : 'Latest Articles'}
            </h2>
            {hasActiveFilters && (
              <p className="text-gray-600" role="status" aria-live="polite">
                {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {error && (
            <div className="text-center text-red-500 mb-4" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {loading && articles.length === 0 && (
            <div className="flex justify-center py-12" role="status" aria-live="polite">
              <LoadingSpinner size="lg" text="Loading articles..." />
            </div>
          )}

          {articles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" role="feed" aria-label="Articles list">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {pagination.hasMore && (
                <div className="text-center">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                    aria-label={loading ? 'Loading more articles...' : 'Load more articles'}
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More Articles'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <p className="text-gray-500 mb-2">
                {hasActiveFilters ? 'No articles match your filters' : 'No articles found. Check back later!'}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={() => setFilters({ categories: [], tags: [], search: '' })}
                  aria-label="Clear all filters to show all articles"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </section>
      </main>

      </Swipeable>
      {/* </PullToRefresh> */}
    </div>
  );
}
