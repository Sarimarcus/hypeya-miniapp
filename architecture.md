# Hypeya NextJS Mini-App Architecture

## Project Overview

A NextJS application that displays the latest articles from the Hypeya.xyz WordPress website using the WordPress REST API. The app features article listing, filtering by categories and tags, and a modern UI built with Shadcn/ui components.

## Tech Stack

- **Framework**: NextJS 14+ (App Router)
- **UI Library**: Shadcn/ui + Tailwind CSS
- **Data Fetching**: WordPress REST API
- **State Management**: React Context + useReducer / Zustand (for complex state)
- **Styling**: Tailwind CSS
- **TypeScript**: Full TypeScript implementation
- **Package Manager**: npm/yarn/pnpm

## File & Folder Structure

```
hypeya-miniapp/
├── README.md
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── components.json                 # Shadcn/ui config
│
├── src/
│   ├── app/                       # App Router pages
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Home page (latest articles)
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   │
│   │   ├── article/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # Individual article page
│   │   │       ├── loading.tsx
│   │   │       └── error.tsx
│   │   │
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # Category filtered articles
│   │   │       ├── loading.tsx
│   │   │       └── error.tsx
│   │   │
│   │   └── api/                   # API routes (if needed)
│   │       ├── articles/
│   │       │   └── route.ts
│   │       ├── categories/
│   │       │   └── route.ts
│   │       └── tags/
│   │           └── route.ts
│   │
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── ...                # Other Shadcn/ui components
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── articles/              # Article-related components
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleList.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   ├── ArticleDetail.tsx
│   │   │   ├── ArticleContent.tsx
│   │   │   ├── ArticleMeta.tsx
│   │   │   └── FeaturedArticle.tsx
│   │   │
│   │   ├── filters/               # Filter components
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── TagFilter.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   └── SortSelector.tsx
│   │   │
│   │   └── common/                # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ImageWithFallback.tsx
│   │       └── DateFormatter.tsx
│   │
│   ├── lib/                       # Utility functions & configurations
│   │   ├── utils.ts               # General utilities (cn helper, etc.)
│   │   ├── wordpress-api.ts       # WordPress API client
│   │   ├── constants.ts           # App constants
│   │   ├── validations.ts         # Data validation schemas
│   │   └── date-utils.ts          # Date formatting utilities
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── wordpress.ts           # WordPress API types
│   │   ├── article.ts             # Article-related types
│   │   ├── category.ts            # Category types
│   │   ├── tag.ts                 # Tag types
│   │   └── api.ts                 # API response types
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useArticles.ts         # Articles data fetching hook
│   │   ├── useCategories.ts       # Categories data fetching hook
│   │   ├── useTags.ts             # Tags data fetching hook
│   │   ├── useDebounce.ts         # Debounce hook for search
│   │   ├── useLocalStorage.ts     # Local storage hook
│   │   └── usePagination.ts       # Pagination logic hook
│   │
│   ├── context/                   # React Context providers
│   │   ├── FilterContext.tsx      # Filter state management
│   │   ├── ThemeContext.tsx       # Theme management (if needed)
│   │   └── AppContext.tsx         # Global app state
│   │
│   └── services/                  # Business logic & API services
│       ├── wordpressService.ts    # WordPress API service
│       ├── articleService.ts      # Article-specific operations
│       ├── cacheService.ts        # Caching logic
│       └── transformService.ts    # Data transformation
│
├── public/                        # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── placeholder.jpg
│   │   └── favicon.ico
│   └── icons/
│
└── docs/                          # Documentation
    ├── api-endpoints.md
    ├── component-guide.md
    └── deployment.md
```

## Component Architecture

### 1. Layout Components (`components/layout/`)

- **Header.tsx**: Main navigation, logo, search bar
- **Footer.tsx**: Footer with links and copyright
- **Navigation.tsx**: Main navigation menu with categories
- **Sidebar.tsx**: Side navigation for filters (mobile/desktop)

### 2. Article Components (`components/articles/`)

- **ArticleCard.tsx**: Card display for article previews
- **ArticleList.tsx**: List container for articles
- **ArticleGrid.tsx**: Grid layout for articles
- **ArticleDetail.tsx**: Full article view
- **ArticleContent.tsx**: Article content with WordPress formatting
- **ArticleMeta.tsx**: Author, date, category, tags display
- **FeaturedArticle.tsx**: Hero article display

### 3. Filter Components (`components/filters/`)

- **CategoryFilter.tsx**: Category selection dropdown/chips
- **TagFilter.tsx**: Tag selection with search
- **SearchBox.tsx**: Search input with debouncing
- **FilterBar.tsx**: Container for all filters
- **SortSelector.tsx**: Sort options (date, popularity, etc.)

### 4. UI Components (`components/ui/`)

All Shadcn/ui components:

- Button, Card, Badge, Input, Select
- Skeleton loaders, Pagination
- Dialog, Dropdown, Tooltip, etc.

## State Management

### 1. Filter Context (`context/FilterContext.tsx`)

```typescript
interface FilterState {
  categories: string[];
  tags: string[];
  searchQuery: string;
  sortBy: "date" | "title" | "popularity";
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
}

interface FilterActions {
  setCategories: (categories: string[]) => void;
  setTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}
```

### 2. Global App Context (`context/AppContext.tsx`)

```typescript
interface AppState {
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  theme: "light" | "dark";
}
```

## Services & Data Layer

### 1. WordPress API Service (`services/wordpressService.ts`)

```typescript
class WordPressService {
  private baseURL = "https://hypeya.xyz/wp-json/wp/v2";

  async getArticles(params: ArticleParams): Promise<Article[]>;
  async getArticle(slug: string): Promise<Article>;
  async getCategories(): Promise<Category[]>;
  async getTags(): Promise<Tag[]>;
  async searchArticles(query: string): Promise<Article[]>;
}
```

### 2. Cache Service (`services/cacheService.ts`)

- Implements caching for API responses
- Uses localStorage/sessionStorage for client-side caching
- Cache invalidation strategies

### 3. Transform Service (`services/transformService.ts`)

- Transforms WordPress API responses to app-specific format
- Sanitizes HTML content
- Formats dates and metadata

## Data Types

### WordPress API Types (`types/wordpress.ts`)

```typescript
interface WordPressArticle {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  author: number;
  categories: number[];
  tags: number[];
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressTerm[][];
  };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}
```

### App Types (`types/article.ts`)

```typescript
interface Article {
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
  readTime?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
  color?: string; // For UI theming
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}
```

## Custom Hooks

### 1. useArticles Hook (`hooks/useArticles.ts`)

```typescript
interface UseArticlesParams {
  categories?: string[];
  tags?: string[];
  search?: string;
  sortBy?: string;
  page?: number;
  perPage?: number;
}

const useArticles = (params: UseArticlesParams) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch logic with dependency on params
  // Returns: { articles, loading, error, totalPages, refetch }
};
```

### 2. useCategories Hook (`hooks/useCategories.ts`)

- Fetches and caches categories
- Provides loading and error states

### 3. useTags Hook (`hooks/useTags.ts`)

- Fetches and caches tags
- Provides search functionality

## API Integration

### WordPress REST API Endpoints

```
Base URL: https://hypeya.xyz/wp-json/wp/v2

GET /posts                 # Get articles
GET /posts/{id}           # Get single article
GET /posts?slug={slug}    # Get article by slug
GET /categories           # Get categories
GET /tags                 # Get tags
GET /media/{id}          # Get media/images

Query Parameters:
- categories: Filter by category IDs
- tags: Filter by tag IDs
- search: Search in title/content
- per_page: Items per page (default: 10, max: 100)
- page: Page number
- orderby: date, title, menu_order
- order: asc, desc
- _embed: Include embedded resources (media, terms)
```

### API Response Transformation

```typescript
// Transform WordPress API response to app format
const transformArticle = (wpArticle: WordPressArticle): Article => ({
  id: wpArticle.id,
  slug: wpArticle.slug,
  title: wpArticle.title.rendered,
  content: sanitizeHtml(wpArticle.content.rendered),
  excerpt: stripHtml(wpArticle.excerpt.rendered),
  publishedAt: new Date(wpArticle.date),
  updatedAt: new Date(wpArticle.modified),
  categories: extractCategories(wpArticle._embedded),
  tags: extractTags(wpArticle._embedded),
  featuredImage: extractFeaturedImage(wpArticle._embedded),
  readTime: calculateReadTime(wpArticle.content.rendered),
});
```

## Features Implementation

### 1. Article Listing

- **Home Page**: Latest articles with pagination
- **Grid/List View**: Toggle between layouts
- **Infinite Scroll**: Optional infinite loading
- **Loading States**: Skeleton components while fetching

### 2. Filtering System

- **Category Filter**: Multi-select dropdown or chip selection
- **Tag Filter**: Search and multi-select tags
- **Search**: Full-text search with debouncing
- **Sort Options**: Date, title, popularity
- **Clear Filters**: Reset all filters button

### 3. Article Detail Page

- **Full Content**: Rendered HTML content from WordPress
- **Meta Information**: Author, date, categories, tags
- **Related Articles**: Based on categories/tags
- **Social Sharing**: Share buttons
- **Reading Time**: Estimated reading time

### 4. Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch Interactions**: Mobile-friendly interactions
- **Performance**: Optimized images and lazy loading

## Performance Optimizations

### 1. Next.js Features

- **Server Side Rendering**: SEO-friendly rendering
- **Static Generation**: Pre-generate popular pages
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic code splitting

### 2. Caching Strategy

- **Browser Cache**: Cache API responses
- **CDN**: Use Vercel Edge Network
- **Stale While Revalidate**: Background updates

### 3. Data Fetching

- **Parallel Requests**: Fetch categories and tags in parallel
- **Deduplication**: Avoid duplicate API calls
- **Error Boundaries**: Graceful error handling

## Deployment & Development

### 1. Development Setup

```bash
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### 2. Environment Variables

```env
NEXT_PUBLIC_WP_API_URL=https://hypeya.xyz/wp-json/wp/v2
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
WP_AUTH_USER=username          # If authentication needed
WP_AUTH_PASSWORD=password      # If authentication needed
```

### 3. Production Deployment

- **Platform**: Vercel (recommended for Next.js)
- **CI/CD**: GitHub Actions or Vercel Git integration
- **Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry (optional)

## State Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Filter Context │───▶│   API Service   │
│                 │    │                 │    │                 │
│ - Select Category│    │ - Update State  │    │ - Fetch Articles│
│ - Search Query  │    │ - Trigger Fetch │    │ - Transform Data│
│ - Change Sort   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Update     │◀───│   React State   │◀───│   Data Layer    │
│                 │    │                 │    │                 │
│ - Re-render     │    │ - Articles      │    │ - Cache Results │
│ - Loading States│    │ - Loading       │    │ - Error Handling│
│ - Error Display │    │ - Error         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Security Considerations

### 1. Content Security

- **HTML Sanitization**: Clean WordPress content
- **XSS Prevention**: Sanitize user inputs
- **Content Security Policy**: Configure CSP headers

### 2. API Security

- **Rate Limiting**: Implement client-side rate limiting
- **CORS**: Configure CORS for API requests
- **Error Handling**: Don't expose sensitive information

## Future Enhancements

### 1. Advanced Features

- **User Authentication**: WordPress user login
- **Favorites**: Save favorite articles
- **Comments**: Display and manage comments
- **Newsletter**: Email subscription
- **PWA**: Progressive Web App features

### 2. Analytics

- **Google Analytics**: Track user behavior
- **Custom Events**: Track article interactions
- **Performance Metrics**: Monitor app performance

### 3. Internationalization

- **Multi-language**: Support multiple languages
- **RTL Support**: Right-to-left language support
- **Localization**: Date and number formatting

This architecture provides a solid foundation for building a modern, performant, and maintainable NextJS application that showcases articles from the Hypeya website with comprehensive filtering capabilities and an excellent user experience.
