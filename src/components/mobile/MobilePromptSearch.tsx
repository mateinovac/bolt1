import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { PROMPTS, Prompt } from '../../types/prompts';

interface MobilePromptSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prompt: Prompt) => void;
}

export function MobilePromptSearch({ isOpen, onClose, onSelect }: MobilePromptSearchProps) {
  const [search, setSearch] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState(PROMPTS);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilteredPrompts(PROMPTS);
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = PROMPTS.filter(prompt =>
      prompt.name.toLowerCase().includes(search.toLowerCase()) ||
      prompt.description.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPrompts(filtered);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-x-0 bottom-16 bg-gray-900 border-t border-gray-800 z-50 max-h-[60vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 p-4 border-b border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Search prompts..."
            autoFocus
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto overscroll-contain"
        onScroll={(e) => e.stopPropagation()}
      >
        {filteredPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt)}
            className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors touch-none"
          >
            <div className="font-medium text-white">{prompt.name}</div>
            <div className="text-sm text-gray-400">{prompt.description}</div>
          </button>
        ))}
        {filteredPrompts.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No prompts found
          </div>
        )}
      </div>
    </div>
  );
}
