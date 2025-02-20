import React from 'react';
import { Bot } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4 animate-pulse">
          <Bot className="w-8 h-8 text-violet-500 animate-bounce" />
        </div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
