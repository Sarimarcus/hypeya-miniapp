// API constants for WordPress REST API integration
// Configuration for hypeya.xyz API endpoints

// Base configuration
export const API_CONFIG = {
  BASE_URL: 'https://hypeya.xyz/wp-json/wp/v2',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// WordPress REST API endpoints
export const API_ENDPOINTS = {
  // Posts/Articles endpoints
  POSTS: '/posts',
  POST_BY_ID: (id: number) => `/posts/${id}`,
  POST_BY_SLUG: (slug: string) => `/posts?slug=${slug}`,
  
  // Categories endpoints
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: number) => `/categories/${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `/categories?slug=${slug}`,
  
  // Tags endpoints
  TAGS: '/tags',
  TAG_BY_ID: (id: number) => `/tags/${id}`,
  TAG_BY_SLUG: (slug: string) => `/tags?slug=${slug}`,
  
  // Media endpoints
  MEDIA: '/media',
  MEDIA_BY_ID: (id: number) => `/media/${id}`,
  
  // Users/Authors endpoints
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
} as const;

// Query parameters for API requests
export const API_PARAMS = {
  // Embedding related data
  EMBED: '_embed',
  
  // Common fields to include
  FIELDS: {
    POSTS: 'id,date,slug,title,content,excerpt,author,featured_media,categories,tags,_embedded',
    POST_PREVIEW: 'id,date,slug,title,excerpt,author,featured_media,categories,tags,_embedded',
    CATEGORIES: 'id,name,slug,description,count,parent',
    TAGS: 'id,name,slug,description,count',
    MEDIA: 'id,source_url,alt_text,media_details',
    USERS: 'id,name,slug,description,avatar_urls',
  },
  
  // Pagination
  PER_PAGE: {
    DEFAULT: 10,
    ARTICLES: 12,
    CATEGORIES: 50,
    TAGS: 100,
  },
  
  // Ordering
  ORDER: {
    ASC: 'asc',
    DESC: 'desc',
  },
  
  // Order by options
  ORDER_BY: {
    DATE: 'date',
    TITLE: 'title',
    SLUG: 'slug',
    MODIFIED: 'modified',
    MENU_ORDER: 'menu_order',
  },
  
  // Post status
  STATUS: {
    PUBLISH: 'publish',
    DRAFT: 'draft',
    PRIVATE: 'private',
  },
} as const;

// Build full API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number | boolean>) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
};

// Common API request configurations
export const API_REQUESTS = {
  // Get latest articles with embedded data
  LATEST_ARTICLES: (page: number = 1, perPage: number = API_PARAMS.PER_PAGE.ARTICLES) => ({
    endpoint: API_ENDPOINTS.POSTS,
    params: {
      page,
      per_page: perPage,
      status: API_PARAMS.STATUS.PUBLISH,
      orderby: API_PARAMS.ORDER_BY.DATE,
      order: API_PARAMS.ORDER.DESC,
      _embed: true,
      _fields: API_PARAMS.FIELDS.POSTS,
    },
  }),
  
  // Get articles by category
  ARTICLES_BY_CATEGORY: (categoryId: number, page: number = 1, perPage: number = API_PARAMS.PER_PAGE.ARTICLES) => ({
    endpoint: API_ENDPOINTS.POSTS,
    params: {
      categories: categoryId,
      page,
      per_page: perPage,
      status: API_PARAMS.STATUS.PUBLISH,
      orderby: API_PARAMS.ORDER_BY.DATE,
      order: API_PARAMS.ORDER.DESC,
      _embed: true,
      _fields: API_PARAMS.FIELDS.POSTS,
    },
  }),
  
  // Get articles by tag
  ARTICLES_BY_TAG: (tagId: number, page: number = 1, perPage: number = API_PARAMS.PER_PAGE.ARTICLES) => ({
    endpoint: API_ENDPOINTS.POSTS,
    params: {
      tags: tagId,
      page,
      per_page: perPage,
      status: API_PARAMS.STATUS.PUBLISH,
      orderby: API_PARAMS.ORDER_BY.DATE,
      order: API_PARAMS.ORDER.DESC,
      _embed: true,
      _fields: API_PARAMS.FIELDS.POSTS,
    },
  }),
  
  // Search articles
  SEARCH_ARTICLES: (query: string, page: number = 1, perPage: number = API_PARAMS.PER_PAGE.ARTICLES) => ({
    endpoint: API_ENDPOINTS.POSTS,
    params: {
      search: query,
      page,
      per_page: perPage,
      status: API_PARAMS.STATUS.PUBLISH,
      orderby: API_PARAMS.ORDER_BY.DATE,
      order: API_PARAMS.ORDER.DESC,
      _embed: true,
      _fields: API_PARAMS.FIELDS.POSTS,
    },
  }),
  
  // Get single article by slug
  ARTICLE_BY_SLUG: (slug: string) => ({
    endpoint: API_ENDPOINTS.POSTS,
    params: {
      slug,
      status: API_PARAMS.STATUS.PUBLISH,
      _embed: true,
      _fields: API_PARAMS.FIELDS.POSTS,
    },
  }),
  
  // Get all categories
  ALL_CATEGORIES: () => ({
    endpoint: API_ENDPOINTS.CATEGORIES,
    params: {
      per_page: API_PARAMS.PER_PAGE.CATEGORIES,
      orderby: 'name',
      order: API_PARAMS.ORDER.ASC,
      _fields: API_PARAMS.FIELDS.CATEGORIES,
    },
  }),
  
  // Get all tags
  ALL_TAGS: () => ({
    endpoint: API_ENDPOINTS.TAGS,
    params: {
      per_page: API_PARAMS.PER_PAGE.TAGS,
      orderby: 'count',
      order: API_PARAMS.ORDER.DESC,
      _fields: API_PARAMS.FIELDS.TAGS,
    },
  }),
} as const;

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  NOT_FOUND: 'The requested content was not found.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  INVALID_RESPONSE: 'Invalid response format received.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  // Cache durations in milliseconds
  ARTICLES: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  TAGS: 30 * 60 * 1000, // 30 minutes
  SINGLE_ARTICLE: 10 * 60 * 1000, // 10 minutes
  
  // Cache keys
  KEYS: {
    ARTICLES: 'articles',
    CATEGORIES: 'categories',
    TAGS: 'tags',
    ARTICLE: 'article',
  },
} as const;
