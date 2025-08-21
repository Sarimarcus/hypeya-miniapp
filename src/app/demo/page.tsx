'use client';

import { Header } from '@/components/layout/Header';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useArticles, useCategories } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { articles, loading, error, loadMore, pagination } = useArticles(1, 6);
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Hypeya
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest articles, insights, and stories from our community
          </p>
        </section>

        {/* Categories Section */}
        {!categoriesLoading && categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <Badge 
                  key={category.id} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200 transition-colors"
                  style={{ backgroundColor: category.color + '20', color: category.color }}
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Articles Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          
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

          {articles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found. Check back later!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
