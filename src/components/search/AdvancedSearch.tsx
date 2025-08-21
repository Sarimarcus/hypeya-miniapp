// Advanced search component with filters
// Mobile-optimized search with category/tag filtering and sorting

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useSearch, useCategories, useTags } from '@/hooks';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { cn } from '@/lib/utils';

interface SearchFilters {
  categories: number[];
  tags: number[];
  sortBy: 'date' | 'title' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onClose?: () => void;
  initialQuery?: string;
}

export function AdvancedSearch({ onClose, initialQuery = '' }: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    tags: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const { results, loading, error, search, clearSearch } = useSearch();
  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading } = useTags();

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        search(searchQuery);
      } else {
        clearSearch();
      }
    }, 300);

    setSearchTimeout(timeout);
  }, [search, clearSearch, searchTimeout]);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    handleSearch(value);
  };

  const toggleCategory = (categoryId: number) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const toggleTag = (tagId: number) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.tags.length > 0;

  // Filter and sort results
  const filteredResults = results
    .filter(article => {
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
    })
    .sort((a, b) => {
      const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'date':
          return (a.publishedAt.getTime() - b.publishedAt.getTime()) * multiplier;
        case 'title':
          return a.title.localeCompare(b.title) * multiplier;
        case 'relevance':
        default:
          // For relevance, assume the API returns them in relevance order
          return 0;
      }
    });

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold flex-1">Search Articles</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "transition-colors",
              showFilters && "bg-gray-100"
            )}
          >
            <Filter className="h-5 w-5" />
            {hasActiveFilters && (
              <span className="ml-1 text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5">
                {filters.categories.length + filters.tags.length}
              </span>
            )}
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                clearSearch();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="m-4 p-4 border-0 shadow-sm bg-gray-50">
          <div className="space-y-4">
            {/* Sort Options */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Sort by</h3>
              <div className="flex gap-2 flex-wrap">
                {(['relevance', 'date', 'title'] as const).map((sortOption) => (
                  <Button
                    key={sortOption}
                    variant={filters.sortBy === sortOption ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: sortOption }))}
                    className="capitalize"
                  >
                    {sortOption}
                    {filters.sortBy === sortOption && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilters(prev => ({ 
                            ...prev, 
                            sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                          }));
                        }}
                        className="ml-1 p-0 h-auto"
                      >
                        {filters.sortOrder === 'asc' ? (
                          <SortAsc className="h-3 w-3" />
                        ) : (
                          <SortDesc className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Categories */}
            {!categoriesLoading && categories.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={filters.categories.includes(category.id) ? "default" : "secondary"}
                      className="cursor-pointer transition-colors"
                      style={filters.categories.includes(category.id) ? {
                        backgroundColor: category.color,
                        color: 'white'
                      } : {
                        backgroundColor: category.color + '20',
                        color: category.color
                      }}
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {!tagsLoading && tags.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {tags.slice(0, 20).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={filters.tags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="w-full"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && (
          <div className="p-4">
            <ErrorMessage message={error} onRetry={() => search(query)} />
          </div>
        )}

        {!loading && !error && query && (
          <div className="p-4">
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} 
                {query && ` for "${query}"`}
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>

            {filteredResults.length > 0 ? (
              <div className="space-y-4">
                {filteredResults.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    variant="compact"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No articles found</p>
                <p className="text-sm text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        )}

        {!query && !loading && (
          <div className="p-4 text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Start typing to search</p>
            <p className="text-sm text-gray-400">
              Search through all articles, filter by categories and tags
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
