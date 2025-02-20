import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

interface ReloadButtonProps {
  onReload: () => Promise<void>;
  className?: string;
}

export function ReloadButton({ onReload, className = '' }: ReloadButtonProps) {
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await onReload();
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <button
      onClick={handleReload}
      disabled={isReloading}
      className={`inline-flex items-center gap-1 text-sm text-gray-400 hover:text-violet-400 transition-colors ${className}`}
      aria-label="Reload response"
    >
      <RotateCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">Reload response</span>
    </button>
  );
}
