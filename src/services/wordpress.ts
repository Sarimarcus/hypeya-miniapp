// WordPress API service class
// Handles all communication with the WordPress REST API

import { 
  API_CONFIG, 
  API_REQUESTS,
  API_ERRORS,
  buildApiUrl 
} from '@/constants/api';
import { 
  WordPressArticle, 
  WordPressCategory, 
  WordPressTag,
  WordPressTerm
} from '@/types/wordpress';
import { Article } from '@/types/article';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';
import { ApiResponse, ApiError } from '@/types/api';

export class WordPressApiService {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private username?: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
    
    // Get credentials from environment variables
    this.username = process.env.WP_API_USERNAME;
    this.apiKey = process.env.WP_API_KEY;
  }

  /**
   * Make HTTP request with retry logic and error handling
   */
  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Add authentication headers if credentials are available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge with any additional headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.username && this.apiKey) {
      const auth = btoa(`${this.username}:${this.apiKey}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: controller.signal,
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (attempt === this.retryAttempts) {
          throw this.handleError(error);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }

    throw new Error('Maximum retry attempts reached');
  }

  /**
   * Handle and standardize API errors
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          code: 'TIMEOUT_ERROR',
          message: API_ERRORS.TIMEOUT_ERROR,
          statusCode: 408,
        };
      }

      if (error.message.includes('fetch')) {
        return {
          code: 'NETWORK_ERROR',
          message: API_ERRORS.NETWORK_ERROR,
          statusCode: 0,
        };
      }

      if (error.message.includes('404')) {
        return {
          code: 'NOT_FOUND',
          message: API_ERRORS.NOT_FOUND,
          statusCode: 404,
        };
      }

      if (error.message.includes('500')) {
        return {
          code: 'SERVER_ERROR',
          message: API_ERRORS.SERVER_ERROR,
          statusCode: 500,
        };
      }
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: 0,
    };
  }

  /**
   * Transform WordPress article to application article format
   */
  private transformArticle(wpArticle: WordPressArticle): Article {
    return {
      id: wpArticle.id,
      slug: wpArticle.slug,
      title: wpArticle.title.rendered,
      content: wpArticle.content.rendered,
      excerpt: wpArticle.excerpt.rendered,
      publishedAt: new Date(wpArticle.date),
      updatedAt: new Date(wpArticle.modified),
      author: {
        id: wpArticle.author,
        name: wpArticle._embedded?.author?.[0]?.name || 'Unknown Author',
        slug: wpArticle._embedded?.author?.[0]?.slug || 'unknown',
        description: wpArticle._embedded?.author?.[0]?.description,
        avatarUrl: wpArticle._embedded?.author?.[0]?.avatar_urls?.['96'],
      },
      featuredImage: wpArticle._embedded?.['wp:featuredmedia']?.[0] ? {
        id: wpArticle._embedded['wp:featuredmedia'][0].id,
        url: wpArticle._embedded['wp:featuredmedia'][0].source_url,
        alt: wpArticle._embedded['wp:featuredmedia'][0].alt_text || '',
        width: wpArticle._embedded['wp:featuredmedia'][0].media_details?.width || 0,
        height: wpArticle._embedded['wp:featuredmedia'][0].media_details?.height || 0,
        sizes: {
          thumbnail: wpArticle._embedded['wp:featuredmedia'][0].media_details?.sizes?.thumbnail?.source_url,
          medium: wpArticle._embedded['wp:featuredmedia'][0].media_details?.sizes?.medium?.source_url,
          large: wpArticle._embedded['wp:featuredmedia'][0].media_details?.sizes?.large?.source_url,
          full: wpArticle._embedded['wp:featuredmedia'][0].source_url,
        },
      } : undefined,
      categories: wpArticle._embedded?.['wp:term']?.[0]?.map((cat: WordPressTerm) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: '', // WordPressTerm doesn't have description
        count: 0, // Will be populated from separate API call if needed
        color: '#3B82F6', // Default color, can be customized
      })) || [],
      tags: wpArticle._embedded?.['wp:term']?.[1]?.map((tag: WordPressTerm) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: '', // WordPressTerm doesn't have description
        count: 0, // Will be populated from separate API call if needed
      })) || [],
    };
  }

  /**
   * Transform WordPress category to application category format
   */
  private transformCategory(wpCategory: WordPressCategory): Category {
    return {
      id: wpCategory.id,
      name: wpCategory.name,
      slug: wpCategory.slug,
      description: wpCategory.description || '',
      count: wpCategory.count || 0,
      color: '#3B82F6', // Default color, can be customized
    };
  }

  /**
   * Transform WordPress tag to application tag format
   */
  private transformTag(wpTag: WordPressTag): Tag {
    return {
      id: wpTag.id,
      name: wpTag.name,
      slug: wpTag.slug,
      description: wpTag.description || '',
      count: wpTag.count || 0,
    };
  }

  /**
   * Extract pagination info from response headers
   */
  private extractPaginationInfo(response: Response): {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const currentPage = parseInt(new URL(response.url).searchParams.get('page') || '1', 10);
    const itemsPerPage = parseInt(new URL(response.url).searchParams.get('per_page') || '10', 10);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }

  // Public API methods

  /**
   * Get latest articles with pagination
   */
  async getLatestArticles(page = 1, perPage = 12): Promise<ApiResponse<Article[]>> {
    try {
      const request = API_REQUESTS.LATEST_ARTICLES(page, perPage);
      const url = buildApiUrl(request.endpoint, request.params);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();
      const articles = wpArticles.map(wp => this.transformArticle(wp));
      const pagination = this.extractPaginationInfo(response);

      return {
        data: articles,
        success: true,
        pagination,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(categoryId: number, page = 1, perPage = 12): Promise<ApiResponse<Article[]>> {
    try {
      const request = API_REQUESTS.ARTICLES_BY_CATEGORY(categoryId, page, perPage);
      const url = buildApiUrl(request.endpoint, request.params);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();
      const articles = wpArticles.map(wp => this.transformArticle(wp));
      const pagination = this.extractPaginationInfo(response);

      return {
        data: articles,
        success: true,
        pagination,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get single article by slug
   */
  async getArticleBySlug(slug: string): Promise<ApiResponse<Article | null>> {
    try {
      const request = API_REQUESTS.ARTICLE_BY_SLUG(slug);
      const url = buildApiUrl(request.endpoint, request.params);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();
      
      if (wpArticles.length === 0) {
        return {
          data: null,
          success: true,
        };
      }

      const article = this.transformArticle(wpArticles[0]);

      return {
        data: article,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const request = API_REQUESTS.ALL_CATEGORIES();
      const url = buildApiUrl(request.endpoint, request.params);
      
      const wpCategories: WordPressCategory[] = await this.makeRequest(url);
      const categories = wpCategories.map(wp => this.transformCategory(wp));

      return {
        data: categories,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<ApiResponse<Tag[]>> {
    try {
      const request = API_REQUESTS.ALL_TAGS();
      const url = buildApiUrl(request.endpoint, request.params);
      
      const wpTags: WordPressTag[] = await this.makeRequest(url);
      const tags = wpTags.map(wp => this.transformTag(wp));

      return {
        data: tags,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search articles
   */
  async searchArticles(query: string, page = 1, perPage = 12): Promise<ApiResponse<Article[]>> {
    try {
      const request = API_REQUESTS.SEARCH_ARTICLES(query, page, perPage);
      const url = buildApiUrl(request.endpoint, request.params);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();
      const articles = wpArticles.map(wp => this.transformArticle(wp));
      const pagination = this.extractPaginationInfo(response);

      return {
        data: articles,
        success: true,
        pagination,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Export singleton instance
export const wordpressApi = new WordPressApiService();
