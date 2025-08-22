// WordPress API service class
// Handles all communication with the WordPress REST API

import {
  API_CONFIG,
  API_REQUESTS,
  API_ERRORS,
  buildApiUrl,
} from "@/constants/api";
import {
  WordPressArticle,
  WordPressCategory,
  WordPressTag,
} from "@/types/wordpress";
import { Article } from "@/types/article";
import { Category } from "@/types/category";
import { Tag } from "@/types/tag";
import { ApiResponse, ApiError } from "@/types/api";
import { TransformService } from "@/services/transform";
import { mockWordpressApi } from "@/services/mockWordpress";

export class WordPressApiService {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private username?: string;
  private apiKey?: string;
  private useMock: boolean;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;

    // Get credentials from environment variables
    this.username = process.env.WP_API_USERNAME;
    this.apiKey = process.env.WP_API_KEY;

    // Use mock service when explicitly enabled (e.g., offline demos)
    this.useMock = process.env.NEXT_PUBLIC_OFFLINE_MODE === "true";
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
      "Content-Type": "application/json",
    };

    // Merge with any additional headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.username && this.apiKey) {
      const auth = btoa(`${this.username}:${this.apiKey}`);
      headers["Authorization"] = `Basic ${auth}`;
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
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * attempt)
        );
      }
    }

    throw new Error("Maximum retry attempts reached");
  }

  /**
   * Handle and standardize API errors
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          code: "TIMEOUT_ERROR",
          message: API_ERRORS.TIMEOUT_ERROR,
          statusCode: 408,
        };
      }

      if (error.message.includes("fetch")) {
        return {
          code: "NETWORK_ERROR",
          message: API_ERRORS.NETWORK_ERROR,
          statusCode: 0,
        };
      }

      if (error.message.includes("404")) {
        return {
          code: "NOT_FOUND",
          message: API_ERRORS.NOT_FOUND,
          statusCode: 404,
        };
      }

      if (error.message.includes("500")) {
        return {
          code: "SERVER_ERROR",
          message: API_ERRORS.SERVER_ERROR,
          statusCode: 500,
        };
      }
    }

    return {
      code: "UNKNOWN_ERROR",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      statusCode: 0,
    };
  }

  // Article transformation is centralized in TransformService

  /**
   * Transform WordPress category to application category format
   */
  private transformCategory(wpCategory: WordPressCategory): Category {
    return {
      id: wpCategory.id,
      name: wpCategory.name,
      slug: wpCategory.slug,
      description: wpCategory.description || "",
      count: wpCategory.count || 0,
      color: "#3B82F6", // Default color, can be customized
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
      description: wpTag.description || "",
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
    const totalPages = parseInt(
      response.headers.get("X-WP-TotalPages") || "1",
      10
    );
    const totalItems = parseInt(response.headers.get("X-WP-Total") || "0", 10);
    const currentPage = parseInt(
      new URL(response.url).searchParams.get("page") || "1",
      10
    );
    const itemsPerPage = parseInt(
      new URL(response.url).searchParams.get("per_page") || "10",
      10
    );

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
   * Get latest articles with pagination - optimized with embedded data
   */
  async getLatestArticles(
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<Article[]>> {
    try {
      if (this.useMock) {
        return mockWordpressApi.getLatestArticles(page, perPage);
      }

      const request = API_REQUESTS.LATEST_ARTICLES(page, perPage);
      const url = buildApiUrl(request.endpoint, request.params);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();

      // Transform articles using embedded data - no additional API calls needed!
      const articles = wpArticles.map((wpArticle) =>
        TransformService.transformArticle(wpArticle)
      );

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
   * Get articles by category - optimized with embedded data
   */
  async getArticlesByCategory(
    categoryId: number,
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<Article[]>> {
    try {
      if (this.useMock) {
        return mockWordpressApi.getArticlesByCategory(
          categoryId,
          page,
          perPage
        );
      }

      const request = API_REQUESTS.ARTICLES_BY_CATEGORY(
        categoryId,
        page,
        perPage
      );
      const url = buildApiUrl(request.endpoint, request.params);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();

      // Transform articles using embedded data - no additional API calls needed!
      const articles = wpArticles.map((wpArticle) =>
        TransformService.transformArticle(wpArticle)
      );

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
   * Get single article by slug - optimized with embedded data
   */
  async getArticleBySlug(slug: string): Promise<ApiResponse<Article | null>> {
    try {
      if (this.useMock) {
        return mockWordpressApi.getArticleBySlug(slug);
      }

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

      // Transform article using embedded data - no additional API calls needed!
      const article = TransformService.transformArticle(wpArticles[0]);

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
      if (this.useMock) {
        return mockWordpressApi.getCategories();
      }
      const request = API_REQUESTS.ALL_CATEGORIES();
      const url = buildApiUrl(request.endpoint, request.params);

      const wpCategories: WordPressCategory[] = await this.makeRequest(url);
      const categories = wpCategories.map((wp) => this.transformCategory(wp));

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
      if (this.useMock) {
        return mockWordpressApi.getTags();
      }
      const request = API_REQUESTS.ALL_TAGS();
      const url = buildApiUrl(request.endpoint, request.params);

      const wpTags: WordPressTag[] = await this.makeRequest(url);
      const tags = wpTags.map((wp) => this.transformTag(wp));

      return {
        data: tags,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search articles - optimized with embedded data
   */
  async searchArticles(
    query: string,
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<Article[]>> {
    try {
      const request = API_REQUESTS.SEARCH_ARTICLES(query, page, perPage);
      const url = buildApiUrl(request.endpoint, request.params);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();

      // Transform articles using embedded data - no additional API calls needed!
      const articles = wpArticles.map((wpArticle) =>
        TransformService.transformArticle(wpArticle)
      );

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
   * Get articles with multiple filter parameters - optimized with embedded data
   */
  async getFilteredArticles(
    filters: {
      categories?: number[];
      tags?: number[];
      search?: string;
    },
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<Article[]>> {
    try {
      if (this.useMock) {
        // Mock search/filter with the mock service's searchArticles
        if (filters.search && filters.search.trim()) {
          return mockWordpressApi.searchArticles(filters.search, page, perPage);
        }
        // Fall back to category-only or tag-only by filtering local results
        if (
          (filters.categories && filters.categories.length) ||
          (filters.tags && filters.tags.length)
        ) {
          const base = await mockWordpressApi.getLatestArticles(1, 100);
          const filtered = base.data.filter((a) => {
            const byCat =
              !filters.categories?.length ||
              a.categories.some((c) => filters.categories!.includes(c.id));
            const byTag =
              !filters.tags?.length ||
              a.tags.some((t) => filters.tags!.includes(t.id));
            return byCat && byTag;
          });
          const start = (page - 1) * perPage;
          const data = filtered.slice(start, start + perPage);
          return {
            data,
            success: true,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(filtered.length / perPage) || 1,
              totalItems: filtered.length,
              itemsPerPage: perPage,
              hasNext: start + perPage < filtered.length,
              hasPrevious: page > 1,
            },
          };
        }
        return mockWordpressApi.getLatestArticles(page, perPage);
      }
      const params = new URLSearchParams();

      // Add pagination
      params.append("per_page", perPage.toString());
      params.append("page", page.toString());

      // Add category filter
      if (filters.categories && filters.categories.length > 0) {
        params.append("categories", filters.categories.join(","));
      }

      // Add tag filter
      if (filters.tags && filters.tags.length > 0) {
        params.append("tags", filters.tags.join(","));
      }

      // Add search query
      if (filters.search && filters.search.trim()) {
        params.append("search", filters.search.trim());
      }

      // Add embedded data for optimal performance
      params.append("_embed", "true");
      // params.append('_fields', API_PARAMS.FIELDS.POSTS); // Temporarily disabled to test embedded data

      // Order by date
      params.append("orderby", "date");
      params.append("order", "desc");

      // Only published posts
      params.append("status", "publish");

      const url = `${this.baseUrl}/posts?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const wpArticles: WordPressArticle[] = await response.json();

      // Transform articles using embedded data - no additional API calls needed!
      const articles = wpArticles.map((wpArticle) =>
        TransformService.transformArticle(wpArticle)
      );

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
