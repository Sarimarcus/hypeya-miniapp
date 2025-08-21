// Filter component for categories and tags
// Mobile-optimized filtering interface

'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCategories, useTags } from '@/hooks';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';
import { cn } from '@/lib/utils';

interface FilterState {
  categories: number[];
  tags: number[];
}

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  compact?: boolean;
}

export function Filters({ 
  filters, 
  onFiltersChange, 
  className,
  compact = false 
}: FiltersProps) {
  const [showCategories, setShowCategories] = useState(!compact);
  const [showTags, setShowTags] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading } = useTags();

  const hasActiveFilters = filters.categories.length > 0 || filters.tags.length > 0;

  const toggleCategory = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const toggleTag = (tagId: number) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];
    
    onFiltersChange({
      ...filters,
      tags: newTags
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      tags: []
    });
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter(cat => filters.categories.includes(cat.id))
      .map(cat => cat.name);
  };

  const getSelectedTagNames = () => {
    return tags
      .filter(tag => filters.tags.includes(tag.id))
      .map(tag => tag.name);
  };

  // Show limited items for compact view
  const visibleCategories = showAllCategories || !compact 
    ? categories 
    : categories.slice(0, 8);
  
  const visibleTags = showAllTags || !compact 
    ? tags 
    : tags.slice(0, 12);

  return (
    <div className={cn("space-y-4", className)} role="region" aria-label="Article filters">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" aria-hidden="true" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <Badge 
              variant="default" 
              className="text-xs text-white" 
              style={{ backgroundColor: '#6a40f2' }}
              aria-label={`${filters.categories.length + filters.tags.length} active filters`}
            >
              {filters.categories.length + filters.tags.length}
            </Badge>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Clear all filters"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && compact && (
        <div className="space-y-2" role="status" aria-label="Active filters summary">
          {filters.categories.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories:</p>
              <div className="flex flex-wrap gap-1" role="list" aria-label="Selected categories">
                {getSelectedCategoryNames().map((name, index) => (
                  <Badge key={index} variant="secondary" className="text-xs" role="listitem">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {filters.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Tags:</p>
              <div className="flex flex-wrap gap-1" role="list" aria-label="Selected tags">
                {getSelectedTagNames().map((name, index) => (
                  <Badge key={index} variant="outline" className="text-xs" role="listitem">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories Section */}
      <Card className="p-4">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded p-2 -m-2"
          aria-expanded={showCategories}
          aria-controls="categories-content"
          aria-label={`${showCategories ? 'Hide' : 'Show'} categories filter options`}
        >
          <h4 className="font-medium text-gray-900">Categories</h4>
          {compact && (
            <div className="flex items-center gap-2">
              {filters.categories.length > 0 && (
                <Badge 
                  variant="default" 
                  className="text-xs text-white" 
                  style={{ backgroundColor: '#6a40f2' }}
                  aria-label={`${filters.categories.length} categories selected`}
                >
                  {filters.categories.length}
                </Badge>
              )}
              {showCategories ? (
                <ChevronUp className="h-4 w-4 text-gray-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
              )}
            </div>
          )}
        </button>

        {showCategories && (
          <div 
            id="categories-content"
            className="mt-3 space-y-3"
            role="group"
            aria-labelledby="categories-heading"
          >
            <div className="sr-only" id="categories-heading">Category filter options</div>
            {categoriesLoading ? (
              <div className="text-sm text-gray-500" role="status" aria-live="polite">Loading categories...</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Category options">
                  {visibleCategories.map((category) => (
                    <CategoryBadge
                      key={category.id}
                      category={category}
                      isSelected={filters.categories.includes(category.id)}
                      onClick={() => toggleCategory(category.id)}
                    />
                  ))}
                </div>
                
                {compact && categories.length > 8 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                    aria-label={showAllCategories 
                      ? 'Show fewer categories' 
                      : `Show ${categories.length - 8} more categories`
                    }
                  >
                    {showAllCategories 
                      ? 'Show less' 
                      : `Show ${categories.length - 8} more`
                    }
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </Card>

      {/* Tags Section */}
      <Card className="p-4">
        <button
          onClick={() => setShowTags(!showTags)}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded p-2 -m-2"
          aria-expanded={showTags}
          aria-controls="tags-content"
          aria-label={`${showTags ? 'Hide' : 'Show'} tags filter options`}
        >
          <h4 className="font-medium text-gray-900">Tags</h4>
          <div className="flex items-center gap-2">
            {filters.tags.length > 0 && (
              <Badge 
                variant="default" 
                className="text-xs text-white" 
                style={{ backgroundColor: '#6a40f2' }}
                aria-label={`${filters.tags.length} tags selected`}
              >
                {filters.tags.length}
              </Badge>
            )}
            {showTags ? (
              <ChevronUp className="h-4 w-4 text-gray-500" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
            )}
          </div>
        </button>

        {showTags && (
          <div 
            id="tags-content"
            className="mt-3 space-y-3"
            role="group"
            aria-labelledby="tags-heading"
          >
            <div className="sr-only" id="tags-heading">Tag filter options</div>
            {tagsLoading ? (
              <div className="text-sm text-gray-500" role="status" aria-live="polite">Loading tags...</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Tag options">
                  {visibleTags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      isSelected={filters.tags.includes(tag.id)}
                      onClick={() => toggleTag(tag.id)}
                    />
                  ))}
                </div>
                
                {tags.length > 12 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                    aria-label={showAllTags 
                      ? 'Show fewer tags' 
                      : `Show ${tags.length - 12} more tags`
                    }
                  >
                    {showAllTags 
                      ? 'Show less' 
                      : `Show ${tags.length - 12} more`
                    }
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// Category Badge Component
interface CategoryBadgeProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryBadge({ category, isSelected, onClick }: CategoryBadgeProps) {
  return (
    <Badge
      variant={isSelected ? "default" : "secondary"}
      className="cursor-pointer transition-all duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
      style={isSelected ? {
        backgroundColor: '#6a40f2'
      } : {
        backgroundColor: '#f4f0ff',
        color: '#6a40f2'
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Remove' : 'Add'} ${category.name} category filter ${category.count > 0 ? `(${category.count} articles)` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {category.name}
      {category.count > 0 && (
        <span className="ml-1 opacity-75" aria-hidden="true">({category.count})</span>
      )}
    </Badge>
  );
}

// Tag Badge Component
interface TagBadgeProps {
  tag: Tag;
  isSelected: boolean;
  onClick: () => void;
}

function TagBadge({ tag, isSelected, onClick }: TagBadgeProps) {
  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className="cursor-pointer transition-all duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
      style={isSelected ? {
        backgroundColor: '#6a40f2',
        color: 'white',
        borderColor: '#6a40f2'
      } : {
        borderColor: '#bfa5ff',
        color: '#6a40f2'
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Remove' : 'Add'} ${tag.name} tag filter ${tag.count > 0 ? `(${tag.count} articles)` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {tag.name}
      {tag.count > 0 && (
        <span className="ml-1 opacity-75" aria-hidden="true">({tag.count})</span>
      )}
    </Badge>
  );
}
