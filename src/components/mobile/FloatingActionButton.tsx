import React from 'react';
import { Plus } from 'lucide-react';

export function FloatingActionButton() {
  return (
    <button
      className="fixed right-4 bottom-20 w-12 h-12 bg-violet-500 rounded-full
                 flex items-center justify-center shadow-lg
                 hover:bg-violet-600 active:bg-violet-700
                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                 focus:ring-offset-gray-900 transition-colors
                 transform active:scale-95"
      aria-label="Add new item"
    >
      <Plus className="w-5 h-5 text-white" />
    </button>
  );
}
