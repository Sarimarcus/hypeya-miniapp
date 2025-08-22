// API response and request types
// Generic types for API communication

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
}

// Pagination information
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Generic API error
export interface ApiError {
  code: string;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// Loading states for API calls
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Filter parameters for article queries
export interface ArticleFilters {
  categories?: string[]; // Category slugs
  tags?: string[]; // Tag slugs
  search?: string;
  author?: string;
  sortBy?: "date" | "title" | "modified" | "relevance";
  sortOrder?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

// Search parameters
export interface SearchParams {
  query: string;
  type?: "articles" | "categories" | "tags" | "all";
  limit?: number;
}

// Generic fetch options
export interface FetchOptions {
  signal?: AbortSignal;
  timeout?: number;
  retries?: number;
}

// Cache configuration
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  key: string;
}

// HTTP methods
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API endpoint configuration
export interface ApiEndpoint {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  cache?: CacheConfig;
}
