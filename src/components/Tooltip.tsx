import React from 'react';

interface TooltipProps {
  content: string;
  visible?: boolean;
  children: React.ReactNode;
}

export function Tooltip({ content, visible = true, children }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}
