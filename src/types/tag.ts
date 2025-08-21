// Application-specific tag types
// Simplified tag types for the application

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

// For tag filter components
export interface TagOption {
  id: number;
  name: string;
  slug: string;
  count: number;
  selected?: boolean;
}

// For tag search/autocomplete
export interface TagSearchResult {
  id: number;
  name: string;
  slug: string;
  count: number;
  highlighted?: string; // For search highlighting
}

// For tag responses
export interface TagListResponse {
  tags: Tag[];
  total: number;
}

// For loading states
export interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  searchResults: TagSearchResult[];
  searchLoading: boolean;
}
