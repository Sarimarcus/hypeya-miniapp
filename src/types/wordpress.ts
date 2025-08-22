// WordPress API type definitions
// Based on WordPress REST API v2 specification

export interface WordPressArticle {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  class_list: string[];
  _embedded?: {
    author?: WordPressAuthor[];
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressTerm[][];
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "category";
  parent: number;
  meta: Record<string, unknown>;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "post_tag";
  meta: Record<string, unknown>;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  meta: Record<string, unknown>;
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: "attachment";
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: Record<string, unknown>;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: "image" | "file";
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    filesize?: number;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        filesize?: number;
        mime_type: string;
        source_url: string;
      };
    };
    image_meta: {
      aperture: string;
      credit: string;
      camera: string;
      caption: string;
      created_timestamp: string;
      copyright: string;
      focal_length: string;
      iso: string;
      shutter_speed: string;
      title: string;
      orientation: string;
      keywords: string[];
    };
  };
  source_url: string;
}

export interface WordPressTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: "category" | "post_tag";
  parent?: number;
}

// API Response wrapper types
export interface WordPressApiResponse<T> {
  data: T;
  headers: {
    "x-wp-total": string;
    "x-wp-totalpages": string;
  };
}

// Query parameter types
export interface WordPressPostsQuery {
  context?: "view" | "embed" | "edit";
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  author?: number[];
  author_exclude?: number[];
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: "asc" | "desc";
  orderby?:
    | "author"
    | "date"
    | "id"
    | "include"
    | "modified"
    | "parent"
    | "relevance"
    | "slug"
    | "include_slugs"
    | "title";
  slug?: string[];
  status?: string[];
  categories?: number[];
  categories_exclude?: number[];
  tags?: number[];
  tags_exclude?: number[];
  sticky?: boolean;
  _embed?: boolean;
}

export interface WordPressCategoriesQuery {
  context?: "view" | "embed" | "edit";
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  order?: "asc" | "desc";
  orderby?:
    | "id"
    | "include"
    | "name"
    | "slug"
    | "include_slugs"
    | "term_group"
    | "description"
    | "count";
  hide_empty?: boolean;
  parent?: number;
  post?: number;
  slug?: string[];
}

export interface WordPressTagsQuery {
  context?: "view" | "embed" | "edit";
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: "asc" | "desc";
  orderby?:
    | "id"
    | "include"
    | "name"
    | "slug"
    | "include_slugs"
    | "term_group"
    | "description"
    | "count";
  hide_empty?: boolean;
  post?: number;
  slug?: string[];
}

// Error response type
export interface WordPressError {
  code: string;
  message: string;
  data?: {
    status: number;
    params?: Record<string, unknown>;
    details?: Record<string, unknown>;
  };
}
