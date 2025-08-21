// Application-specific category types
// Simplified category types for the application

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
  color?: string; // For UI theming - custom field
  parent?: {
    id: number;
    name: string;
    slug: string;
  };
}

// For category filter components
export interface CategoryOption {
  id: number;
  name: string;
  slug: string;
  count: number;
  selected?: boolean;
}

// For category responses
export interface CategoryListResponse {
  categories: Category[];
  total: number;
}

// For loading states
export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}
