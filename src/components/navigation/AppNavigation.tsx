// App-like navigation system with smooth transitions
// Provides native mobile app navigation feel

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { triggerHapticFeedback } from '@/utils/haptics';

interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  currentPath: string;
  history: string[];
  isTransitioning: boolean;
}

interface NavigationContextType extends NavigationState {
  navigate: (path: string, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  replace: (path: string) => void;
  setTransitioning: (transitioning: boolean) => void;
}

interface NavigationOptions {
  haptic?: boolean;
  transition?: 'slide' | 'fade' | 'push' | 'modal';
  direction?: 'left' | 'right' | 'up' | 'down';
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [state, setState] = useState<NavigationState>({
    canGoBack: false,
    canGoForward: false,
    currentPath: pathname,
    history: [pathname],
    isTransitioning: false
  });

  // Update state when pathname changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      currentPath: pathname,
      history: prev.history.includes(pathname) 
        ? prev.history 
        : [...prev.history, pathname],
      canGoBack: prev.history.length > 0,
      canGoForward: false // Reset forward history on new navigation
    }));
  }, [pathname]);

  const navigate = useCallback((path: string, options: NavigationOptions = {}) => {
    const { haptic = true, transition = 'slide' } = options;
    
    if (haptic) {
      triggerHapticFeedback('impact-light');
    }
    
    setState(prev => ({ ...prev, isTransitioning: true }));
    
    // Add transition class to body for animations
    if (typeof document !== 'undefined') {
      document.body.classList.add(`nav-transition-${transition}`);
    }
    
    router.push(path);
  }, [router]);

  const goBack = useCallback(() => {
    if (state.canGoBack) {
      triggerHapticFeedback('impact-light');
      setState(prev => ({ ...prev, isTransitioning: true }));
      router.back();
    }
  }, [router, state.canGoBack]);

  const goForward = useCallback(() => {
    if (state.canGoForward) {
      triggerHapticFeedback('impact-light');
      setState(prev => ({ ...prev, isTransitioning: true }));
      router.forward();
    }
  }, [router, state.canGoForward]);

  const replace = useCallback((path: string) => {
    setState(prev => ({ ...prev, isTransitioning: true }));
    router.replace(path);
  }, [router]);

  const setTransitioning = useCallback((transitioning: boolean) => {
    setState(prev => ({ ...prev, isTransitioning: transitioning }));
    
    // Remove transition classes after animation
    if (!transitioning && typeof document !== 'undefined') {
      setTimeout(() => {
        document.body.classList.remove(
          'nav-transition-slide',
          'nav-transition-fade', 
          'nav-transition-push',
          'nav-transition-modal'
        );
      }, 300);
    }
  }, []);

  const contextValue: NavigationContextType = {
    ...state,
    navigate,
    goBack,
    goForward,
    replace,
    setTransitioning
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// Page transition wrapper component
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const { isTransitioning, setTransitioning } = useNavigation();

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, setTransitioning]);

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isTransitioning ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}
        ${className || ''}
      `}
    >
      {children}
    </div>
  );
}

// Back button component
interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
  fallbackPath?: string;
}

export function BackButton({ className, children, fallbackPath = '/' }: BackButtonProps) {
  const { canGoBack, goBack, navigate } = useNavigation();

  const handleBack = () => {
    if (canGoBack) {
      goBack();
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
        flex items-center space-x-2 p-2 rounded-lg
        transition-colors duration-200
        hover:bg-gray-100 active:bg-gray-200
        ${className || ''}
      `}
    >
      {children || (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </>
      )}
    </button>
  );
}

// Navigation bar component
interface NavBarProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function NavBar({ 
  title, 
  showBack = true, 
  actions, 
  className 
}: NavBarProps) {
  return (
    <header className={`
      flex items-center justify-between p-4
      bg-white border-b border-gray-200
      sticky top-0 z-40
      ${className || ''}
    `}>
      <div className="flex items-center space-x-4">
        {showBack && <BackButton />}
        {title && (
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h1>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </header>
  );
}

// Tab navigation component
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  badge?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  className?: string;
}

export function TabNavigation({ tabs, className }: TabNavigationProps) {
  const { currentPath, navigate } = useNavigation();

  return (
    <nav className={`
      flex items-center justify-around
      bg-white border-t border-gray-200
      py-2 px-4
      ${className || ''}
    `}>
      {tabs.map(tab => {
        const isActive = currentPath === tab.path || currentPath.startsWith(tab.path + '/');
        
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path, { haptic: true })}
            className={`
              flex flex-col items-center space-y-1 p-2 rounded-lg
              transition-all duration-200
              ${isActive 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.icon && (
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
            )}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
