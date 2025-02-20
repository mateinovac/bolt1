import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { PROMPTS, Prompt } from '../types/prompts';

interface PromptSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prompt: Prompt) => void;
}

export function PromptSearch({ isOpen, onClose, onSelect }: PromptSearchProps) {
  const [search, setSearch] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState(PROMPTS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const filtered = PROMPTS.filter(prompt =>
      prompt.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPrompts(filtered);
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredPrompts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (filteredPrompts[selectedIndex]) {
          e.preventDefault();
          handleSelect(filteredPrompts[selectedIndex]);
          // Immediately submit if there's a template
          if (filteredPrompts[selectedIndex].template) {
            e.preventDefault();
            onSelect(filteredPrompts[selectedIndex]);
            setSearch('');
            onClose();
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleSelect = (prompt: Prompt) => {
    onSelect(prompt);
    setSearch('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-[64px] left-4 right-4 max-w-4xl mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50 max-h-[300px] overflow-hidden z-50"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 sticky top-0 bg-gray-800/95 backdrop-blur-sm">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-700/50 text-white rounded-lg placeholder-gray-400 border border-gray-600/50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="Search prompts..."
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-0.5 rounded-full hover:bg-gray-600/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
          aria-label="Close prompt search"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-y-auto max-h-[250px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {filteredPrompts.map((prompt, index) => (
          <button
            key={prompt.id}
            onClick={() => handleSelect(prompt)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors ${
              index === selectedIndex ? 'bg-violet-500/10 text-violet-300' : 'text-gray-300'
            }`}
          >
            <div className="font-medium">{prompt.name}</div>
            <div className="text-sm text-gray-400">{prompt.description}</div>
          </button>
        ))}
        {filteredPrompts.length === 0 && (
          <div className="px-4 py-8 text-gray-400 text-center">
            No prompts found
          </div>
        )}
      </div>
    </div>
  );
}
