// Enhanced WordPress API Service
// Handles all interactions with WordPress REST API with caching and advanced features

import { 
  WordPressArticle, 
  WordPressCategory, 
  WordPressTag,
  WordPressApiError 
} from '@/types/wordpress';
import { ApiResponse } from '@/types/api';
import { API_CONFIG, buildApiUrl, API_REQUESTS } from '@/constants/api';
import { TransformService } from './transform';
import { Article } from '@/types/article';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Request options interface
interface RequestOptions {
  useCache?: boolean;
  cacheTtl?: number;
  timeout?: number;
  retries?: number;
}

export class WordPressApiServiceEnhanced {
  private static instance: WordPressApiServiceEnhanced;
  private baseUrl: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private username?: string;
  private apiKey?: string;
  private defaultOptions: Required<RequestOptions> = {
    useCache: true,
    cacheTtl: 5 * 60 * 1000, // 5 minutes
    timeout: 10000, // 10 seconds
    retries: 3
  };

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.BASE_URL;
    
    // Get credentials from environment variables
    this.username = process.env.WP_API_USERNAME;
    this.apiKey = process.env.WP_API_KEY;
  }

  /**
   * Get singleton instance
   */
  static getInstance(baseUrl?: string): WordPressApiServiceEnhanced {
    if (!WordPressApiServiceEnhanced.instance) {
      WordPressApiServiceEnhanced.instance = new WordPressApiServiceEnhanced(baseUrl);
    }
    return WordPressApiServiceEnhanced.instance;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get data from cache if valid
   */
  private getFromCache<T>(key: string): T | null {
    this.cleanupCache();
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      return entry.data;
    }
    return null;
  }

  /**
   * Store data in cache
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Create cache key from URL and params
   */
  private createCacheKey(url: string, params?: Record<string, any>): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${url}${paramStr}`;
  }

  /**
   * Enhanced fetch with timeout, retries, and error handling
   */
  private async fetchWithRetry<T>(
    url: string, 
    options: RequestOptions = {},
    fetchOptions: RequestInit = {}
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    const cacheKey = this.createCacheKey(url, fetchOptions.body ? JSON.parse(fetchOptions.body as string) : undefined);

    // Check cache first
    if (config.useCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...fetchOptions.headers as Record<string, string>
        };

        // Add authentication headers if credentials are available
        if (this.username && this.apiKey) {
          const credentials = btoa(`${this.username}:${this.apiKey}`);
          headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || 
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Cache successful response
        if (config.useCache) {
          this.setCache(cacheKey, data, config.cacheTtl);
        }

        return data;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${config.timeout}ms`);
          }
          if (error.message.includes('400') || error.message.includes('401') || error.message.includes('403')) {
            throw error; // Don't retry client errors
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt < config.retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * Get latest articles with enhanced options
   */
  async getLatestArticles(
    page: number = 1, 
    perPage: number = 10,
    options: RequestOptions = {}
  ): Promise<ApiResponse<Article[]>> {
    try {
      const url = buildApiUrl('/posts', {
        ...API_REQUESTS.LATEST_ARTICLES.params,
        page,
        per_page: perPage
      });

      const wpArticles = await this.fetchWithRetry<WordPressArticle[]>(url, options);
      const articles = TransformService.transformArticles(wpArticles);

      return {
        success: true,
        data: articles,
        metadata: {
          page,
          perPage,
          total: articles.length,
          hasMore: articles.length === perPage
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles',
        data: []
      };
    }
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(
    categoryId: number,
    page: number = 1,
    perPage: number = 10,
    options: RequestOptions = {}
  ): Promise<ApiResponse<Article[]>> {
    try {
      const url = buildApiUrl('/posts', {
        categories: categoryId,
        _embed: true,
        per_page: perPage,
        page,
        status: 'publish'
      });

      const wpArticles = await this.fetchWithRetry<WordPressArticle[]>(url, options);
      const articles = TransformService.transformArticles(wpArticles);

      return {
        success: true,
        data: articles,
        metadata: {
          page,
          perPage,
          total: articles.length,
          hasMore: articles.length === perPage,
          categoryId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles by category',
        data: []
      };
    }
  }

  /**
   * Get articles by tag
   */
  async getArticlesByTag(
    tagId: number,
    page: number = 1,
    perPage: number = 10,
    options: RequestOptions = {}
  ): Promise<ApiResponse<Article[]>> {
    try {
      const url = buildApiUrl('/posts', {
        tags: tagId,
        _embed: true,
        per_page: perPage,
        page,
        status: 'publish'
      });

      const wpArticles = await this.fetchWithRetry<WordPressArticle[]>(url, options);
      const articles = TransformService.transformArticles(wpArticles);

      return {
        success: true,
        data: articles,
        metadata: {
          page,
          perPage,
          total: articles.length,
          hasMore: articles.length === perPage,
          tagId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles by tag',
        data: []
      };
    }
  }

  /**
   * Search articles
   */
  async searchArticles(
    query: string,
    page: number = 1,
    perPage: number = 10,
    options: RequestOptions = {}
  ): Promise<ApiResponse<Article[]>> {
    try {
      if (!query.trim()) {
        return {
          success: true,
          data: [],
          metadata: { page, perPage, total: 0, hasMore: false, query }
        };
      }

      const url = buildApiUrl('/posts', {
        search: query.trim(),
        _embed: true,
        per_page: perPage,
        page,
        status: 'publish'
      });

      const wpArticles = await this.fetchWithRetry<WordPressArticle[]>(url, options);
      const articles = TransformService.transformArticles(wpArticles);

      return {
        success: true,
        data: articles,
        metadata: {
          page,
          perPage,
          total: articles.length,
          hasMore: articles.length === perPage,
          query
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search articles',
        data: []
      };
    }
  }

  /**
   * Get single article by ID
   */
  async getArticleById(id: number, options: RequestOptions = {}): Promise<ApiResponse<Article | null>> {
    try {
      const url = buildApiUrl(`/posts/${id}`, {
        _embed: true
      });

      const wpArticle = await this.fetchWithRetry<WordPressArticle>(url, options);
      const article = TransformService.transformArticle(wpArticle);

      return {
        success: true,
        data: article
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch article',
        data: null
      };
    }
  }

  /**
   * Get single article by slug
   */
  async getArticleBySlug(slug: string, options: RequestOptions = {}): Promise<ApiResponse<Article | null>> {
    try {
      const url = buildApiUrl('/posts', {
        slug,
        _embed: true
      });

      const wpArticles = await this.fetchWithRetry<WordPressArticle[]>(url, options);
      
      if (wpArticles.length === 0) {
        return {
          success: false,
          error: 'Article not found',
          data: null
        };
      }

      const article = TransformService.transformArticle(wpArticles[0]);

      return {
        success: true,
        data: article
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch article',
        data: null
      };
    }
  }

  /**
   * Get all categories with enhanced caching
   */
  async getCategories(options: RequestOptions = {}): Promise<ApiResponse<Category[]>> {
    try {
      const url = buildApiUrl('/categories', {
        ...API_REQUESTS.CATEGORIES.params,
        per_page: 100 // Get all categories
      });

      const wpCategories = await this.fetchWithRetry<WordPressCategory[]>(url, {
        ...options,
        cacheTtl: 10 * 60 * 1000 // Cache categories for 10 minutes
      });
      
      const categories = TransformService.transformCategoriesList(wpCategories);

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        data: []
      };
    }
  }

  /**
   * Get all tags with enhanced caching
   */
  async getTags(options: RequestOptions = {}): Promise<ApiResponse<Tag[]>> {
    try {
      const url = buildApiUrl('/tags', {
        per_page: 100,
        orderby: 'count',
        order: 'desc'
      });

      const wpTags = await this.fetchWithRetry<WordPressTag[]>(url, {
        ...options,
        cacheTtl: 10 * 60 * 1000 // Cache tags for 10 minutes
      });
      
      const tags = TransformService.transformTagsList(wpTags);

      return {
        success: true,
        data: tags
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tags',
        data: []
      };
    }
  }

  /**
   * Get popular categories (by post count)
   */
  async getPopularCategories(limit: number = 10, options: RequestOptions = {}): Promise<ApiResponse<Category[]>> {
    try {
      const response = await this.getCategories(options);
      if (!response.success) {
        return response;
      }

      const popularCategories = response.data
        .filter(category => category.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return {
        success: true,
        data: popularCategories
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch popular categories',
        data: []
      };
    }
  }

  /**
   * Get popular tags (by post count)
   */
  async getPopularTags(limit: number = 20, options: RequestOptions = {}): Promise<ApiResponse<Tag[]>> {
    try {
      const response = await this.getTags(options);
      if (!response.success) {
        return response;
      }

      const popularTags = response.data
        .filter(tag => tag.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return {
        success: true,
        data: popularTags
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch popular tags',
        data: []
      };
    }
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const url = buildApiUrl('/', {});
      const response = await this.fetchWithRetry<any>(url, { 
        useCache: false,
        timeout: 5000,
        retries: 1
      });

      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API health check failed',
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}
