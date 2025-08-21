// Mobile UX showcase page
// Demonstrates all mobile enhancement features

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { Swipeable } from '@/components/mobile/Swipeable';
import { useHaptics } from '@/utils/haptics';
import { 
  NavigationProvider, 
  NavBar, 
  TabNavigation, 
  PageTransition 
} from '@/components/navigation/AppNavigation';
import { 
  Home, 
  Search, 
  Bell, 
  User, 
  Heart, 
  Share, 
  ChevronRight,
  Smartphone,
  Zap,
  Vibrate
} from 'lucide-react';

export default function MobileUXPage() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const { triggerHaptic, impact, notification, selection } = useHaptics();

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshCount(prev => prev + 1);
    notification.success();
  };

  const handleSwipeLeft = () => {
    selection();
    setCurrentCard(prev => (prev + 1) % demoCards.length);
  };

  const handleSwipeRight = () => {
    selection();
    setCurrentCard(prev => (prev - 1 + demoCards.length) % demoCards.length);
  };

  const demoCards = [
    {
      id: 1,
      title: "Pull to Refresh",
      description: "Pull down anywhere to refresh the content",
      icon: <ChevronRight className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Swipe Navigation",
      description: "Swipe left or right to navigate between cards",
      icon: <Smartphone className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Haptic Feedback",
      description: "Feel the responses with every interaction",
      icon: <Vibrate className="w-6 h-6" />,
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Performance Optimized",
      description: "Smooth 60fps animations and optimized loading",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-orange-500"
    }
  ];

  const tabs = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, path: '/mobile-ux' },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" />, path: '/search' },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="w-5 h-5" />, path: '/notifications', badge: 3 },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, path: '/profile' }
  ];

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavBar 
          title="Mobile UX Demo"
          showBack={false}
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => impact.medium()}
            >
              <Bell className="w-5 h-5" />
            </Button>
          }
        />

        <PageTransition>
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="p-4 space-y-6">
              
              {/* Refresh Counter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Pull to Refresh Demo
                    <Badge variant="secondary">
                      Refreshed {refreshCount} times
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Pull down on this page to trigger a refresh. You&apos;ll feel haptic feedback when the refresh starts.
                  </p>
                </CardContent>
              </Card>

              {/* Swipeable Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Swipe Navigation Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Swipeable
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    className="relative h-48 rounded-lg overflow-hidden"
                  >
                    <div 
                      className={`absolute inset-0 ${demoCards[currentCard].color} text-white p-6 flex flex-col justify-center transition-all duration-300`}
                    >
                      <div className="mb-4">
                        {demoCards[currentCard].icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {demoCards[currentCard].title}
                      </h3>
                      <p className="text-white/90">
                        {demoCards[currentCard].description}
                      </p>
                    </div>
                    
                    {/* Card indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {demoCards.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentCard ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </Swipeable>
                  
                  <div className="mt-4 text-center text-sm text-gray-600">
                    Swipe left or right to navigate • Card {currentCard + 1} of {demoCards.length}
                  </div>
                </CardContent>
              </Card>

              {/* Haptic Feedback Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Haptic Feedback Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => impact.light()}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Vibrate className="w-5 h-5" />
                      <span>Light Impact</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => impact.medium()}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Vibrate className="w-5 h-5" />
                      <span>Medium Impact</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => impact.heavy()}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Vibrate className="w-5 h-5" />
                      <span>Heavy Impact</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => selection()}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Vibrate className="w-5 h-5" />
                      <span>Selection</span>
                    </Button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="default"
                      onClick={() => notification.success()}
                      className="w-full"
                    >
                      Success Notification
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={() => notification.warning()}
                      className="w-full"
                    >
                      Warning Notification
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={() => notification.error()}
                      className="w-full"
                    >
                      Error Notification
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Feature List */}
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: <ChevronRight className="w-5 h-5" />, text: "Pull-to-refresh with custom animations" },
                      { icon: <Smartphone className="w-5 h-5" />, text: "Swipe gestures with velocity detection" },
                      { icon: <Vibrate className="w-5 h-5" />, text: "Haptic feedback for all interactions" },
                      { icon: <Zap className="w-5 h-5" />, text: "Smooth 60fps animations" },
                      { icon: <Heart className="w-5 h-5" />, text: "App-like navigation patterns" },
                      { icon: <Share className="w-5 h-5" />, text: "Native mobile optimizations" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          {feature.icon}
                        </div>
                        <span className="text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </PullToRefresh>
        </PageTransition>

        {/* Bottom Tab Navigation */}
        <div className="fixed bottom-0 left-0 right-0">
          <TabNavigation tabs={tabs} />
        </div>

      </div>
    </NavigationProvider>
  );
}
