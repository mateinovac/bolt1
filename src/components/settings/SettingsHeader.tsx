import React from 'react';
import { X } from 'lucide-react';

interface SettingsHeaderProps {
  onClose: () => void;
}

export function SettingsHeader({ onClose }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <h2 className="text-xl font-semibold text-white">Settings</h2>
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
        aria-label="Close settings"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
