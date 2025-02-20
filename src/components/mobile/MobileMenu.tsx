import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface MobileMenuProps {
  label: string;
  items: MenuItem[];
}

export function MobileMenu({ label, items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-h-[44px] px-4 py-2
                   bg-gray-800 text-gray-100 rounded-lg
                   hover:bg-gray-700 active:bg-gray-600
                   focus:outline-none focus:ring-2 focus:ring-violet-500
                   transition-colors"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 ml-2" />
        ) : (
          <ChevronDown className="w-5 h-5 ml-2" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2
                      bg-gray-800 rounded-lg shadow-lg z-50">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="flex w-full min-h-[44px] px-4 py-2 text-left text-gray-100
                         hover:bg-gray-700 active:bg-gray-600
                         focus:outline-none focus:bg-gray-700
                         transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
