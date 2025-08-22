// Application-specific article types
// Simplified and clean types that hide WordPress API complexity

export interface Author {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  website?: string;
}

export interface Image {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full: string;
  };
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  author: Author;
  categories: Category[];
  tags: Tag[];
  featuredImage?: Image;
  link?: string; // Direct URL to the article on WordPress
  readTime?: number; // Estimated reading time in minutes
  isSticky?: boolean;
}

// For article previews/cards
export interface ArticlePreview {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  author: {
    name: string;
    avatarUrl?: string;
  };
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  featuredImage?: {
    url: string;
    alt: string;
  };
  readTime?: number;
}

// For article list responses with pagination
export interface ArticleListResponse {
  articles: ArticlePreview[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// For loading states and errors
export interface ArticleState {
  articles: ArticlePreview[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Import these from other files to avoid circular dependencies
import type { Category } from "./category";
import type { Tag } from "./tag";
