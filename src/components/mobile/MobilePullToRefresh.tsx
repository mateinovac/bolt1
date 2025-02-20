import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface MobilePullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

export function MobilePullToRefresh({ children, onRefresh }: MobilePullToRefreshProps) {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        setStartY(touchStartY);
        setPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (pulling && !refreshing) {
        const touch = e.touches[0];
        const pullDistance = touch.clientY - startY;
        
        if (pullDistance > 60) {
          handleRefresh();
        }
      }
    };

    const handleTouchEnd = () => {
      setPulling(false);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, refreshing, startY]);

  const handleRefresh = async () => {
    if (onRefresh && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  return (
    <div className="relative">
      {refreshing && (
        <div className="absolute top-0 left-0 right-0 flex justify-center py-4">
          <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
        </div>
      )}
      <div className={refreshing ? 'mt-16 transition-all' : ''}>
        {children}
      </div>
    </div>
  );
}
