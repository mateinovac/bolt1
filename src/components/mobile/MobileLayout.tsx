import React from 'react';
import { MobileNavBar } from './MobileNavBar';
import { MobilePullToRefresh } from './MobilePullToRefresh';
import { FloatingActionButton } from './FloatingActionButton';

interface MobileLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

export function MobileLayout({ children, onRefresh }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <MobilePullToRefresh onRefresh={onRefresh}>
        <main className="flex-1 pb-16">
          {children}
        </main>
      </MobilePullToRefresh>
      
      <FloatingActionButton />
      <MobileNavBar />
    </div>
  );
}
