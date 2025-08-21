// React hooks for data fetching
// Custom hooks for WordPress API integration with loading states

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Article } from '@/types/article';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';
import { ApiResponse, LoadingState } from '@/types/api';
import { WordPressApiService } from '@/services/wordpress';

// Article hook with pagination
export function useArticles(initialPage: number = 1, perPage: number = 10) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: false, error: null });
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    hasMore: true,
    total: 0
  });

  const apiService = useMemo(() => new WordPressApiService(), []);

  const fetchArticles = useCallback(async (page: number = 1, reset: boolean = false) => {
    setLoading({ loading: true, error: null });

    try {
      const response = await apiService.getLatestArticles(page, perPage);
      
      if (response.success) {
        setArticles(prev => reset ? response.data : [...prev, ...response.data]);
        setPagination({
          currentPage: page,
          hasMore: response.data.length === perPage,
          total: response.pagination?.totalItems || response.data.length
        });
      } else {
        setLoading({ loading: false, error: response.message || 'Failed to load articles' });
      }
    } catch (error) {
      setLoading({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, [apiService, perPage]);

  const loadMore = useCallback(() => {
    if (!loading.loading && pagination.hasMore) {
      fetchArticles(pagination.currentPage + 1, false);
    }
  }, [fetchArticles, loading.loading, pagination]);

  const refresh = useCallback(() => {
    fetchArticles(1, true);
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles(initialPage, true);
  }, [fetchArticles, initialPage]);

  return {
    articles,
    loading: loading.loading,
    error: loading.error,
    pagination,
    loadMore,
    refresh
  };
}

// Categories hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: false, error: null });

  const apiService = useMemo(() => new WordPressApiService(), []);

  const fetchCategories = useCallback(async () => {
    setLoading({ loading: true, error: null });

    try {
      const response = await apiService.getCategories();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        setLoading({ loading: false, error: response.message || 'Failed to load categories' });
      }
    } catch (error) {
      setLoading({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, [apiService]);

  const refresh = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading: loading.loading,
    error: loading.error,
    refresh
  };
}

// Tags hook
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: false, error: null });

  const apiService = useMemo(() => new WordPressApiService(), []);

  const fetchTags = useCallback(async () => {
    setLoading({ loading: true, error: null });

    try {
      const response = await apiService.getTags();
      
      if (response.success) {
        setTags(response.data);
      } else {
        setLoading({ loading: false, error: response.message || 'Failed to load tags' });
      }
    } catch (error) {
      setLoading({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, [apiService]);

  const refresh = useCallback(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading: loading.loading,
    error: loading.error,
    refresh
  };
}

// Articles by category hook (simplified version)
export function useArticlesByCategory(categoryId: number, page: number = 1, perPage: number = 10) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: false, error: null });
  const [pagination, setPagination] = useState({
    currentPage: page,
    hasMore: true,
    total: 0
  });

  const apiService = useMemo(() => new WordPressApiService(), []);

  const fetchArticles = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    if (!categoryId) return;

    setLoading({ loading: true, error: null });

    try {
      // Get all articles and filter client-side for now
      const allArticlesResponse = await apiService.getLatestArticles(pageNum, perPage * 2); // Get more to account for filtering
      
      if (allArticlesResponse.success) {
        const filteredArticles = allArticlesResponse.data.filter((article: Article) =>
          article.categories.some((cat: Category) => cat.id === categoryId)
        ).slice(0, perPage); // Limit to requested page size

        setArticles(prev => reset ? filteredArticles : [...prev, ...filteredArticles]);
        setPagination({
          currentPage: pageNum,
          hasMore: filteredArticles.length === perPage,
          total: filteredArticles.length
        });
      } else {
        setLoading({ loading: false, error: allArticlesResponse.message || 'Failed to load articles' });
      }
    } catch (error) {
      setLoading({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, [apiService, categoryId, perPage]);

  const loadMore = useCallback(() => {
    if (!loading.loading && pagination.hasMore) {
      fetchArticles(pagination.currentPage + 1, false);
    }
  }, [fetchArticles, loading.loading, pagination]);

  const refresh = useCallback(() => {
    fetchArticles(1, true);
  }, [fetchArticles]);

  useEffect(() => {
    if (categoryId) {
      fetchArticles(page, true);
    }
  }, [fetchArticles, categoryId, page]);

  return {
    articles,
    loading: loading.loading,
    error: loading.error,
    pagination,
    loadMore,
    refresh
  };
}

// Single article hook (simplified version)
export function useArticle(id?: number, slug?: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ loading: false, error: null });

  const apiService = useMemo(() => new WordPressApiService(), []);

  const fetchArticle = useCallback(async () => {
    if (!id && !slug) return;

    setLoading({ loading: true, error: null });

    try {
      // Get all articles and find by ID or slug
      const allArticlesResponse = await apiService.getLatestArticles(1, 100);
      
      if (allArticlesResponse.success) {
        let foundArticle: Article | undefined;
        
        if (id) {
          foundArticle = allArticlesResponse.data.find((a: Article) => a.id === id);
        } else if (slug) {
          foundArticle = allArticlesResponse.data.find((a: Article) => a.slug === slug);
        }

        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setLoading({ loading: false, error: 'Article not found' });
        }
      } else {
        setLoading({ loading: false, error: allArticlesResponse.message || 'Failed to load article' });
      }
    } catch (error) {
      setLoading({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, [apiService, id, slug]);

  const refresh = useCallback(() => {
    fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    if (id || slug) {
      fetchArticle();
    }
  }, [fetchArticle, id, slug]);

  return {
    article,
    loading: loading.loading,
    error: loading.error,
    refresh
  };
}

// Search hook
export function useSearch() {
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: false, error: null });
  const [query, setQuery] = useState<string>('');

  const apiService = useMemo(() => new WordPressApiService(), []);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setQuery('');
      return;
    }

    setLoading({ loading: true, error: null });
    setQuery(searchQuery);

    try {
      // Get more articles to ensure we have enough matches, but limit final results
      const allArticlesResponse = await apiService.getLatestArticles(1, 100);
      
      if (allArticlesResponse.success) {
        const filteredArticles = allArticlesResponse.data.filter((article: Article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Limit search results to 20 articles
        setResults(filteredArticles.slice(0, 20));
      } else {
        setLoading({ loading: false, error: allArticlesResponse.message || 'Search failed' });
      }
    } catch (error) {
      setLoading({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Search error occurred' 
      });
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, [apiService]);

  const clearSearch = useCallback(() => {
    setResults([]);
    setQuery('');
    setLoading({ loading: false, error: null });
  }, []);

  return {
    results,
    loading: loading.loading,
    error: loading.error,
    query,
    search,
    clearSearch
  };
}

// Filtered articles hook - makes API calls with filter parameters
export function useFilteredArticles(
  filters: {
    categories?: number[];
    tags?: number[];
    search?: string;
  },
  initialPage: number = 1, 
  perPage: number = 10
) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: false, error: null });
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    hasMore: true,
    total: 0
  });

  const apiService = useMemo(() => new WordPressApiService(), []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (filters.categories && filters.categories.length > 0) ||
           (filters.tags && filters.tags.length > 0) ||
           (filters.search && filters.search.trim().length > 0);
  }, [filters]);

  const fetchFilteredArticles = useCallback(async (page: number = 1, reset: boolean = false) => {
    // If no filters are active, use the regular getLatestArticles method
    if (!hasActiveFilters) {
      setLoading({ loading: true, error: null });

      try {
        const response = await apiService.getLatestArticles(page, perPage);
        
        if (response.success) {
          setArticles(prev => reset ? response.data : [...prev, ...response.data]);
          setPagination({
            currentPage: page,
            hasMore: response.data.length === perPage,
            total: response.pagination?.totalItems || response.data.length
          });
        } else {
          setLoading({ loading: false, error: response.message || 'Failed to load articles' });
        }
      } catch (error) {
        setLoading({ 
          loading: false, 
          error: error instanceof Error ? error.message : 'An error occurred' 
        });
      } finally {
        setLoading(prev => ({ ...prev, loading: false }));
      }
      return;
    }

    // Use filtered API call when filters are active
    setLoading({ loading: true, error: null });

    try {
      const response = await apiService.getFilteredArticles(filters, page, perPage);
      
      if (response.success) {
        setArticles(prev => reset ? response.data : [...prev, ...response.data]);
        setPagination({
          currentPage: page,
          hasMore: response.data.length === perPage,
          total: response.pagination?.totalItems || response.data.length
        });
      } else {
        setLoading({ loading: false, error: response.message || 'Failed to load filtered articles' });
      }
    } catch (error) {
      setLoading({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, [apiService, perPage, filters, hasActiveFilters]);

  const loadMore = useCallback(() => {
    if (!loading.loading && pagination.hasMore) {
      fetchFilteredArticles(pagination.currentPage + 1, false);
    }
  }, [fetchFilteredArticles, loading.loading, pagination]);

  const refresh = useCallback(() => {
    fetchFilteredArticles(1, true);
  }, [fetchFilteredArticles]);

  // Fetch articles when filters change with a small delay to prevent rapid re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFilteredArticles(1, true);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [fetchFilteredArticles]);

  return {
    articles,
    loading: loading.loading,
    error: loading.error,
    pagination,
    loadMore,
    refresh,
    hasActiveFilters
  };
}
