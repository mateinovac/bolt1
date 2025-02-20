import React, { useState } from 'react';
import { Menu, Shield, ShieldOff } from 'lucide-react';

interface MenuButtonProps {
  onModeChange: (mode: 'safe' | 'uncensored') => void;
  currentMode: 'safe' | 'uncensored';
}

export function MenuButton({ onModeChange, currentMode }: MenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700">
            <div className="p-2">
              <div className="text-sm text-gray-400 px-3 py-2 border-b border-gray-700">
                Mode Selection
              </div>
              <button
                onClick={() => {
                  onModeChange('safe');
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm ${
                  currentMode === 'safe'
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-gray-300 hover:bg-gray-700'
                } transition-colors rounded-md`}
              >
                <Shield className="w-4 h-4" />
                Safe Mode
              </button>
              <button
                onClick={() => {
                  onModeChange('uncensored');
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm ${
                  currentMode === 'uncensored'
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-gray-300 hover:bg-gray-700'
                } transition-colors rounded-md`}
              >
                <ShieldOff className="w-4 h-4" />
                Uncensored Mode
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
