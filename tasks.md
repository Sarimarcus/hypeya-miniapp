# Hypeya NextJS Mini-App MVP - Development Tasks

## Overview
This document contains granular, testable tasks for building the mobile-only MVP of the Hypeya NextJS mini-app. Each task is designed to be completed independently with clear start/end points.

## Phase 1: Project Setup & Foundation

### Task 1.1: Initialize NextJS Project ✅ COMPLETED
**Objective**: Create a new NextJS 14+ project with TypeScript
**Start**: Empty directory
**End**: Working NextJS app with TypeScript that runs on `npm run dev`

**Steps**:
1. Run `npx create-next-app@latest hypeya-miniapp --typescript --tailwind --eslint --app`
2. Navigate to project directory
3. Test that `npm run dev` works and shows default NextJS page
4. Verify TypeScript is working by creating a simple typed component

**Test**: App loads at localhost:3000 with no errors

---

### Task 1.2: Configure Tailwind for Mobile-First ✅ COMPLETED
**Objective**: Set up Tailwind CSS with mobile-first responsive utilities
**Start**: Basic NextJS project with default Tailwind
**End**: Tailwind configured with custom mobile breakpoints and utilities

**Steps**:
1. Update `tailwind.config.js` with mobile-first breakpoints
2. Add custom utilities for mobile spacing and typography
3. Update `globals.css` with base mobile styles
4. Create a test component to verify mobile styles work

**Test**: Create a div with mobile-specific classes that render correctly

---

### Task 1.3: Install and Configure Shadcn/ui ✅ COMPLETED
**Objective**: Set up Shadcn/ui component library
**Start**: NextJS project with Tailwind
**End**: Shadcn/ui installed with at least Button component working

**Steps**:
1. Run `npx shadcn-ui@latest init`
2. Choose appropriate configuration for mobile-first design
3. Install Button component: `npx shadcn-ui@latest add button`
4. Test Button component in a page

**Test**: Button component renders correctly with Shadcn/ui styling

---

### Task 1.4: Set Up Project Structure ✅ COMPLETED
**Objective**: Create the folder structure for the application
**Start**: Basic NextJS project
**End**: All necessary directories created with index files

**Steps**:
1. Create `src/components/` directory structure
2. Create `src/lib/`, `src/types/`, `src/hooks/`, `src/services/` directories
3. Add index.ts files to each directory for clean imports
4. Create basic barrel exports

**Test**: Import from each directory works without errors

---

## Phase 2: Type Definitions & API Foundation

### Task 2.1: Define WordPress API Types ✅ COMPLETED
**Objective**: Create TypeScript types for WordPress API responses
**Start**: Empty types directory
**End**: Complete type definitions for WordPress entities

**Steps**:
1. Create `src/types/wordpress.ts`
2. Define `WordPressArticle` interface
3. Define `WordPressCategory` and `WordPressTag` interfaces
4. Define `WordPressMedia` interface for images

**Test**: Types compile without errors and match WordPress API structure

---

### Task 2.2: Define Application Types ✅ COMPLETED
**Objective**: Create app-specific type definitions
**Start**: WordPress types completed
**End**: Clean application types that hide WordPress complexity

**Steps**:
1. Create `src/types/article.ts` with simplified Article interface ✅
2. Create `src/types/category.ts` and `src/types/tag.ts` ✅
3. Create `src/types/api.ts` for API response types ✅
4. Export all types from `src/types/index.ts` ✅

**Test**: All types are importable and have no TypeScript errors ✅

---

### Task 2.3: Create API Constants ✅ COMPLETED
**Objective**: Define API endpoints and configuration
**Start**: Types defined
**End**: Constants file with all API endpoints and configuration

**Steps**:
1. Create `src/constants/api.ts` ✅
2. Define WordPress API base URL ✅
3. Define endpoint paths for articles, categories, tags ✅
4. Define default query parameters ✅

**Test**: Constants are accessible and have correct values ✅

---

### Task 2.4: Create WordPress API Service Foundation ✅ COMPLETED
**Objective**: Basic WordPress API service class
**Start**: Types and constants ready
**End**: Service class with comprehensive functionality and authentication

**Steps**:
1. Create `src/services/wordpress.ts` ✅
2. Create `WordPressApiService` class with constructor ✅
3. Implement comprehensive API methods (getLatestArticles, getCategories, getTags, etc.) ✅
4. Add comprehensive error handling, retry logic, and authentication ✅
5. Set up environment variables for WordPress credentials ✅

**Test**: Can fetch articles from WordPress API with full functionality ✅

---

## Phase 3: Basic UI Components

### Task 3.1: Create Loading Spinner Component ✅ COMPLETED
**Objective**: Reusable loading component for mobile
**Start**: Shadcn/ui installed
**End**: Working loading spinner component

**Steps**:
1. Create `src/components/common/LoadingSpinner.tsx` ✅
2. Use Shadcn/ui spinner or create custom mobile-friendly spinner ✅
3. Add TypeScript props interface ✅
4. Export from components index ✅

**Test**: Component renders and animates correctly on mobile viewport ✅

---

### Task 3.2: Create Error Message Component ✅ COMPLETED
**Objective**: Reusable error display component
**Start**: LoadingSpinner completed
**End**: Error component that displays user-friendly messages

**Steps**:
1. Create `src/components/common/ErrorMessage.tsx` ✅
2. Accept error message and retry function as props ✅
3. Style for mobile display with proper spacing ✅
4. Add optional retry button ✅

**Test**: Component displays error message and retry button works ✅

---

### Task 3.3: Create Basic Mobile Header ✅ COMPLETED
**Objective**: Simple mobile header with logo
**Start**: Basic UI components ready
**End**: Mobile header component with logo and title

**Steps**:
1. Create `src/components/layout/Header.tsx` ✅
2. Add Hypeya logo or text logo ✅
3. Style for mobile with proper height and padding ✅
4. Make header sticky on scroll ✅

**Test**: Header displays correctly on mobile and stays visible when scrolling ✅

---

### Task 3.4: Create Article Card Component Shell ✅ COMPLETED
**Objective**: Basic article card without data
**Start**: Header component ready
**End**: Article card with placeholder content and mobile styling

**Steps**:
1. Create `src/components/articles/ArticleCard.tsx` ✅
2. Use Shadcn/ui Card component ✅
3. Add placeholders for title, excerpt, date, category ✅
4. Style for mobile viewport (full width, proper spacing) ✅

**Test**: Card renders with placeholder content and looks good on mobile ✅

---

## Phase 4: Data Fetching & Transformation

### Task 4.1: Create Data Transformation Service
**Objective**: Transform WordPress API data to app format
**Start**: WordPress service foundation ready
**End**: Working transform service with article transformation

**Steps**:
1. Create `src/services/transformService.ts`
2. Implement `transformArticle()` function
3. Handle title, excerpt, date formatting
4. Add basic HTML sanitization for content

**Test**: Can transform WordPress article to app Article type

---

### Task 4.2: Enhance WordPress Service with Transformation
**Objective**: Integrate transformation into API service
**Start**: Transform service ready
**End**: WordPress service returns clean app data

**Steps**:
1. Update `WordPressService.getArticles()` to use transformation
2. Add error handling for malformed API responses
3. Add basic caching with in-memory store
4. Type all return values properly

**Test**: Service returns properly transformed Article objects

---

### Task 4.3: Create useArticles Hook
**Objective**: React hook for fetching articles
**Start**: WordPress service with transformation ready
**End**: Working hook that manages loading, error, and data states

**Steps**:
1. Create `src/hooks/useArticles.ts`
2. Implement loading, error, and data state management
3. Add automatic fetching on mount
4. Return articles, loading, error, and refetch function

**Test**: Hook correctly manages states and returns data

---

### Task 4.4: Test API Integration
**Objective**: Verify real API connection works
**Start**: useArticles hook ready
**End**: Confirmed connection to live Hypeya WordPress API

**Steps**:
1. Create test page that uses useArticles hook
2. Display raw article data in console
3. Verify images, categories, and tags are included
4. Handle rate limiting and API errors

**Test**: Successfully fetch real articles from hypeya.xyz API

---

## Phase 5: Article Display

### Task 5.1: Connect Article Card to Real Data
**Objective**: Display real article data in card component
**Start**: Article card shell and useArticles hook ready
**End**: Article cards displaying real Hypeya articles

**Steps**:
1. Update `ArticleCard.tsx` to accept Article props
2. Display title, excerpt, formatted date
3. Show first category as badge
4. Add placeholder image handling

**Test**: Article cards show real data from API

---

### Task 5.2: Create Article List Component
**Objective**: Container for multiple article cards
**Start**: Article card with real data
**End**: Scrollable list of articles on mobile

**Steps**:
1. Create `src/components/articles/ArticleList.tsx`
2. Accept array of articles as props
3. Map over articles and render ArticleCard components
4. Add proper mobile spacing between cards

**Test**: List displays multiple articles with proper mobile layout

---

### Task 5.3: Create Home Page with Article List
**Objective**: Main page displaying latest articles
**Start**: Article list component ready
**End**: Working home page with real articles

**Steps**:
1. Update `src/app/page.tsx` to use useArticles hook
2. Integrate ArticleList component
3. Show loading state with LoadingSpinner
4. Show error state with ErrorMessage

**Test**: Home page loads and displays latest Hypeya articles

---

### Task 5.4: Add Basic Mobile Layout
**Objective**: Proper mobile layout with header and content
**Start**: Home page with articles
**End**: Complete mobile layout with header and content area

**Steps**:
1. Update `src/app/layout.tsx` to include Header
2. Add proper mobile padding and margins
3. Ensure content doesn't hide behind header
4. Test on actual mobile device or responsive mode

**Test**: App looks good on mobile viewport (375px width)

---

## Phase 6: Categories & Basic Filtering

### Task 6.1: Fetch Categories from API
**Objective**: Get available categories from WordPress
**Start**: Basic article display working
**End**: Categories fetched and available for filtering

**Steps**:
1. Add `getCategories()` method to WordPressService
2. Create `useCategories` hook
3. Transform category data to app format
4. Test that categories are fetched correctly

**Test**: Categories are fetched and displayed in console

---

### Task 6.2: Create Category Filter Component
**Objective**: Mobile-friendly category selection
**Start**: Categories available from API
**End**: Working category filter for mobile

**Steps**:
1. Create `src/components/filters/CategoryFilter.tsx`
2. Use horizontal scrollable chips for categories
3. Add "All" option to clear filters
4. Style for mobile with proper touch targets

**Test**: Category filter renders and allows selection

---

### Task 6.3: Implement Category Filtering Logic
**Objective**: Filter articles by selected category
**Start**: Category filter UI ready
**End**: Articles filtered when category is selected

**Steps**:
1. Update useArticles hook to accept category parameter
2. Modify WordPress API call to include category filter
3. Connect CategoryFilter to article fetching
4. Update URL to reflect selected category

**Test**: Selecting category filters articles correctly

---

### Task 6.4: Add Filter State Management
**Objective**: Manage filter state across app
**Start**: Basic category filtering working
**End**: Centralized filter state management

**Steps**:
1. Create `src/context/FilterContext.tsx`
2. Provide category state and setter functions
3. Update components to use filter context
4. Persist selected category in URL

**Test**: Filter state is shared across components and persisted

---

## Phase 7: Search Functionality

### Task 7.1: Create Search Input Component
**Objective**: Mobile search input with proper styling
**Start**: Category filtering working
**End**: Search input that looks good on mobile

**Steps**:
1. Create `src/components/filters/SearchBox.tsx`
2. Use Shadcn/ui Input component
3. Add search icon and clear button
4. Style for mobile with proper sizing

**Test**: Search input renders and handles user input

---

### Task 7.2: Implement Search Debouncing
**Objective**: Debounce search input to avoid excessive API calls
**Start**: Search input ready
**End**: Search input with 300ms debounce

**Steps**:
1. Create `src/hooks/useDebounce.ts`
2. Implement debouncing logic for search input
3. Connect debounced value to article fetching
4. Show loading state during search

**Test**: Search waits 300ms after typing stops before searching

---

### Task 7.3: Add Search to WordPress API
**Objective**: Search articles using WordPress search endpoint
**Start**: Search input with debouncing
**End**: Articles filtered by search query

**Steps**:
1. Update WordPressService to accept search parameter
2. Add search query to API request
3. Connect search input to article fetching
4. Handle empty search results

**Test**: Typing in search box filters articles by content

---

### Task 7.4: Combine Search and Category Filters
**Objective**: Allow both search and category filtering simultaneously
**Start**: Search and category filters working separately
**End**: Combined filtering with both search and category

**Steps**:
1. Update filter context to handle both search and category
2. Modify API service to accept multiple filter parameters
3. Update UI to show active filters
4. Add clear all filters option

**Test**: Can search within a specific category

---

## Phase 8: Article Detail Page

### Task 8.1: Create Article Detail Page Route
**Objective**: Individual article page accessible by slug
**Start**: Home page with article list working
**End**: Route for `/article/[slug]` that loads

**Steps**:
1. Create `src/app/article/[slug]/page.tsx`
2. Extract slug from URL parameters
3. Add basic page structure with loading state
4. Add navigation back to home

**Test**: Can navigate to `/article/some-slug` without errors

---

### Task 8.2: Fetch Single Article
**Objective**: Load individual article by slug
**Start**: Article detail route exists
**End**: Single article fetched and displayed

**Steps**:
1. Add `getArticle(slug)` method to WordPressService
2. Create `useArticle` hook for single article fetching
3. Handle article not found cases
4. Display article title and basic info

**Test**: Article detail page shows correct article data

---

### Task 8.3: Display Article Content
**Objective**: Render full article content with proper formatting
**Start**: Single article fetching works
**End**: Article content displayed with proper mobile formatting

**Steps**:
1. Create `src/components/articles/ArticleContent.tsx`
2. Render HTML content safely
3. Style content for mobile reading (proper line height, spacing)
4. Handle images in content

**Test**: Article content is readable and well-formatted on mobile

---

### Task 8.4: Add Article Navigation
**Objective**: Easy navigation between articles and back to home
**Start**: Article content displayed
**End**: Navigation controls on article page

**Steps**:
1. Add back button to home in article header
2. Add share button (opens native share if available)
3. Add date and category information
4. Style navigation for mobile use

**Test**: Can easily navigate from article back to home

---

## Phase 9: Mobile Optimization

### Task 9.1: Optimize Images for Mobile
**Objective**: Efficient image loading for mobile
**Start**: Basic article display with images
**End**: Optimized images with lazy loading

**Steps**:
1. Create `src/components/common/ImageWithFallback.tsx`
2. Use Next.js Image component with proper sizing
3. Add lazy loading and blur placeholders
4. Handle missing images gracefully

**Test**: Images load efficiently and look good on mobile

---

### Task 9.2: Add Pull-to-Refresh
**Objective**: Mobile-native pull-to-refresh functionality
**Start**: Article list working
**End**: Pull-to-refresh refreshes article list

**Steps**:
1. Add pull-to-refresh logic to article list
2. Show refresh indicator during reload
3. Update articles after successful refresh
4. Handle refresh errors gracefully

**Test**: Pull down on article list refreshes data

---

### Task 9.3: Improve Mobile Performance
**Objective**: Optimize app for mobile performance
**Start**: All features working
**End**: App loads quickly on mobile

**Steps**:
1. Add loading skeletons for article cards
2. Implement virtual scrolling for long article lists
3. Optimize bundle size by analyzing imports
4. Add service worker for basic caching

**Test**: App loads in under 3 seconds on mobile

---

### Task 9.4: Mobile Touch Interactions
**Objective**: Improve touch interactions for mobile
**Start**: Performance optimized
**End**: Smooth mobile interactions

**Steps**:
1. Add proper touch feedback to buttons and cards
2. Ensure touch targets are at least 44px
3. Add swipe gestures for navigation
4. Test on actual mobile device

**Test**: All interactions feel smooth and responsive on touch

---

## Phase 10: Polish & Testing

### Task 10.1: Error Handling & Empty States
**Objective**: Handle all error and empty scenarios
**Start**: Core functionality complete
**End**: Graceful handling of all edge cases

**Steps**:
1. Add proper error boundaries
2. Create empty state components for no articles
3. Handle network errors and timeouts
4. Add retry mechanisms

**Test**: App handles all error scenarios gracefully

---

### Task 10.2: Loading States & Feedback
**Objective**: Clear user feedback for all operations
**Start**: Error handling complete
**End**: Clear loading indicators for all async operations

**Steps**:
1. Add skeleton loaders for all components
2. Show progress indicators for searches
3. Add success feedback for user actions
4. Ensure loading states don't flicker

**Test**: User always knows what's happening in the app

---

### Task 10.3: Mobile Accessibility
**Objective**: Make app accessible on mobile
**Start**: Loading states implemented
**End**: App meets basic accessibility requirements

**Steps**:
1. Add proper ARIA labels to all interactive elements
2. Ensure keyboard navigation works
3. Test with screen readers
4. Add focus indicators

**Test**: App is usable with screen reader on mobile

---

### Task 10.4: Final Mobile Testing
**Objective**: Comprehensive testing on mobile devices
**Start**: Accessibility implemented
**End**: App tested on multiple mobile devices and browsers

**Steps**:
1. Test on iOS Safari and Android Chrome
2. Verify all features work on both platforms
3. Test on different screen sizes (iPhone SE to iPhone Plus)
4. Fix any mobile-specific issues

**Test**: App works perfectly on all target mobile devices

---

## Deployment Tasks

### Task 11.1: Environment Configuration
**Objective**: Set up environment variables for deployment
**Start**: App fully tested
**End**: Environment configuration ready for production

**Steps**:
1. Create `.env.example` file
2. Document all required environment variables
3. Set up Vercel environment variables
4. Test with production API endpoints

**Test**: App works with production environment variables

---

### Task 11.2: Deploy to Vercel
**Objective**: Deploy MVP to production
**Start**: Environment configured
**End**: Live app accessible via URL

**Steps**:
1. Connect GitHub repository to Vercel
2. Configure build settings for Next.js
3. Deploy and test production build
4. Set up custom domain if needed

**Test**: App is accessible at production URL and fully functional

---

## Success Criteria for MVP

### Core Features Working:
- ✅ Display latest articles from Hypeya.xyz
- ✅ Filter articles by category
- ✅ Search articles by text
- ✅ View individual article details
- ✅ Mobile-optimized responsive design
- ✅ Fast loading and smooth performance

### Technical Requirements Met:
- ✅ NextJS 14+ with App Router
- ✅ TypeScript throughout
- ✅ Shadcn/ui components
- ✅ Mobile-first responsive design
- ✅ WordPress API integration
- ✅ Error handling and loading states
- ✅ Deployed and accessible

### Mobile Experience:
- ✅ Touch-friendly interactions
- ✅ Proper mobile viewport handling
- ✅ Fast loading on mobile networks
- ✅ Native-like user experience
- ✅ Accessible on mobile devices

Each task should be completed in order, with testing after each task to ensure the feature works before moving to the next task.
