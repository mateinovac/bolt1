import React from 'react';
import { Home, Search, Bell, User } from 'lucide-react';

export function MobileNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
      <div className="flex justify-around items-center h-16">
        {[
          { icon: Home, label: 'Home' },
          { icon: Search, label: 'Search' },
          { icon: Bell, label: 'Notifications' },
          { icon: User, label: 'Profile' }
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center w-full h-full
                     text-gray-400 hover:text-violet-400 active:text-violet-500
                     focus:outline-none focus:text-violet-400
                     transition-colors"
            aria-label={label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
