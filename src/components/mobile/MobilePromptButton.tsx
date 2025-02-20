import React from 'react';
import { Sparkles } from 'lucide-react';

interface MobilePromptButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function MobilePromptButton({ onClick, visible }: MobilePromptButtonProps) {
  if (!visible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="absolute right-16 bottom-2 p-2 text-gray-400 hover:text-violet-400 transition-colors rounded-lg"
      aria-label="Select prompt"
    >
      <Sparkles className="w-5 h-5" />
    </button>
  );
}
