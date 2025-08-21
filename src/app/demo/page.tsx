'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { SearchBar, Filters, AdvancedSearch } from '@/components/search';
import { useArticles, useCategories } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { PerformanceMonitor } from '@/components/debug/PerformanceMonitor';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { Swipeable } from '@/components/mobile/Swipeable';
import { useHaptics } from '@/utils/haptics';

export default function HomePage() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as number[],
    tags: [] as number[]
  });

  const router = useRouter();
  const { articles, loading, error, loadMore, pagination } = useArticles(1, 6);
  const { categories, loading: categoriesLoading } = useCategories();
  const { triggerHaptic } = useHaptics();

  // Mobile UX: Refresh functionality
  const handleRefresh = async () => {
    triggerHaptic('impact-medium');
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  // Mobile UX: Swipe navigation
  const handleSwipeLeft = () => {
    triggerHaptic('selection');
    console.log('Swiped left - next page');
  };

  const handleSwipeRight = () => {
    triggerHaptic('selection');
    console.log('Swiped right - previous page');
  };

  // Filter articles based on selected filters
  const filteredArticles = articles.filter(article => {
    // Category filter
    if (filters.categories.length > 0) {
      const hasMatchingCategory = article.categories.some(cat =>
        filters.categories.includes(cat.id)
      );
      if (!hasMatchingCategory) return false;
    }

    // Tag filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = article.tags.some(tag =>
        filters.tags.includes(tag.id)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  const hasActiveFilters = filters.categories.length > 0 || filters.tags.length > 0;

  const handleAdvancedSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (showAdvancedSearch) {
    return (
      <AdvancedSearch
        onClose={() => setShowAdvancedSearch(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showSearchButton
        onSearch={() => setShowAdvancedSearch(true)}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        <Swipeable
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          threshold={100}
        >
          <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Hypeya
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
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
            className="mb-4"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filters.categories.length + filters.tags.length}
              </Badge>
            )}
          </Button>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <section className="mb-8">
            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              compact
            />
          </section>
        )}

        {/* Categories Section */}
        {!categoriesLoading && categories.length > 0 && !hasActiveFilters && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200 transition-colors"
                  style={{ backgroundColor: category.color + '20', color: category.color }}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    categories: prev.categories.includes(category.id)
                      ? prev.categories.filter(id => id !== category.id)
                      : [...prev.categories, category.id]
                  }))}
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {hasActiveFilters ? 'Filtered Articles' : 'Latest Articles'}
            </h2>
            {hasActiveFilters && (
              <p className="text-gray-600">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => window.location.reload()}
            />
          )}

          {loading && articles.length === 0 && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {(hasActiveFilters ? filteredArticles : articles).length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {(hasActiveFilters ? filteredArticles : articles).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {pagination.hasMore && !hasActiveFilters && (
                <div className="text-center">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    size="lg"
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

          {!loading && !error && (hasActiveFilters ? filteredArticles : articles).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">
                {hasActiveFilters ? 'No articles match your filters' : 'No articles found. Check back later!'}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={() => setFilters({ categories: [], tags: [] })}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Performance Monitor for development */}
      <PerformanceMonitor />
      </Swipeable>
      </PullToRefresh>
    </div>
  );
}
