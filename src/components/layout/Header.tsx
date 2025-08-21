// Mobile-optimized header component
// Sticky header with logo, navigation and search for mobile app

import { ArrowLeft, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  showSearchBar?: boolean;
  showMenuButton?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onAdvancedSearch?: (query: string) => void;
  onMenu?: () => void;
  className?: string;
  variant?: 'default' | 'transparent' | 'article';
}

export function Header({
  title = 'Hypeya',
  showBackButton = false,
  showSearchButton = false,
  showSearchBar = false,
  showMenuButton = false,
  onBack,
  onSearch,
  onAdvancedSearch,
  onMenu,
  className,
  variant = 'default'
}: HeaderProps) {
  const variantClasses = {
    default: 'bg-white border-b border-gray-200',
    transparent: 'bg-white/80 backdrop-blur-sm border-b border-gray-200/50',
    article: 'bg-white/95 backdrop-blur-sm border-b border-gray-200/30'
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side - Back button or Menu */}
        <div className="flex items-center">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          {showMenuButton && onMenu && !showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenu}
              className="mr-2 p-2"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Center - Logo/Title */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            {/* Logo placeholder - you can replace with actual logo */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side - Search button */}
        <div className="flex items-center">
          {showSearchButton && onSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearch}
              className="p-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// Specialized header for article pages
export function ArticleHeader({
  articleTitle,
  onBack,
  className
}: {
  articleTitle?: string;
  onBack?: () => void;
  className?: string;
}) {
  return (
    <Header
      title={articleTitle ? (articleTitle.length > 30 ? `${articleTitle.slice(0, 30)}...` : articleTitle) : 'Article'}
      showBackButton={true}
      onBack={onBack}
      variant="article"
      className={className}
    />
  );
}

// Specialized header for home page
export function HomeHeader({
  onSearch,
  onMenu,
  className
}: {
  onSearch?: () => void;
  onMenu?: () => void;
  className?: string;
}) {
  return (
    <Header
      title="Hypeya"
      showSearchButton={true}
      showMenuButton={true}
      onSearch={onSearch}
      onMenu={onMenu}
      variant="default"
      className={className}
    />
  );
}

// Simple header with just title
export function SimpleHeader({
  title,
  className
}: {
  title: string;
  className?: string;
}) {
  return (
    <Header
      title={title}
      variant="default"
      className={className}
    />
  );
}
