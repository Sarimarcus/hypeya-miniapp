// Simple search bar component
// Quick search input with search suggestions

'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onAdvancedSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export function SearchBar({ 
  onAdvancedSearch, 
  placeholder = "Search articles...",
  className,
  compact = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, search, clearSearch } = useSearch();

  // Show top 5 suggestions
  const suggestions = results.slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      search(value);
      setShowSuggestions(true);
    } else {
      clearSearch();
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onAdvancedSearch) {
      onAdvancedSearch(query);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestionQuery: string) => {
    setQuery(suggestionQuery);
    if (onAdvancedSearch) {
      onAdvancedSearch(suggestionQuery);
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearQuery = () => {
    setQuery('');
    clearSearch();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)} role="search">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <div className={cn(
          "relative flex items-center transition-all duration-200",
          compact ? "h-10" : "h-12",
          isFocused ? "ring-2 ring-blue-500" : "ring-1 ring-gray-300",
          "rounded-lg bg-white"
        )}>
          <Search 
            className={cn(
              "absolute left-3 text-gray-400 transition-colors",
              compact ? "h-4 w-4" : "h-5 w-5",
              isFocused && "text-blue-500"
            )}
            aria-hidden="true"
          />
          
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (query.trim() && results.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 150);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowSuggestions(false);
                inputRef.current?.blur();
              }
            }}
            className={cn(
              "w-full bg-transparent outline-none transition-all",
              compact ? "pl-9 pr-8 py-2 text-sm" : "pl-10 pr-10 py-3 text-base",
              "placeholder-gray-400"
            )}
            aria-label="Search articles"
            aria-describedby={showSuggestions ? "search-suggestions" : undefined}
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            aria-controls={showSuggestions ? "search-suggestions" : undefined}
            role="combobox"
          />

          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearQuery}
              className={cn(
                "absolute right-2 p-1 hover:bg-gray-100 rounded",
                compact ? "h-6 w-6" : "h-8 w-8"
              )}
              aria-label="Clear search"
              title="Clear search"
            >
              <X className={compact ? "h-3 w-3" : "h-4 w-4"} aria-hidden="true" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          id="search-suggestions"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Suggestions
            </div>
            {suggestions.map((article) => (
              <button
                key={article.id}
                onClick={() => handleSuggestionClick(article.title)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-none bg-transparent"
                role="option"
                aria-selected={false}
                aria-label={`Search for article: ${article.title}`}
                tabIndex={-1}
              >
                <div className="flex items-start gap-3">
                  {article.featuredImage && (
                    <Image
                      src={article.featuredImage.sizes?.thumbnail || article.featuredImage.url}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded object-cover flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-1" aria-hidden="true">
                      {article.categories.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="inline-block px-1.5 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor: category.color + '20',
                            color: category.color
                          }}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            
            {query && (
              <button
                onClick={() => handleSuggestionClick(query)}
                className="w-full px-3 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-t border-gray-100 text-blue-600 font-medium"
                role="option"
                aria-selected={false}
                aria-label={`Search for: ${query}`}
                tabIndex={-1}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search for &ldquo;{query}&rdquo;
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
