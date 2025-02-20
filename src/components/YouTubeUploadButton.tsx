import React, { useState } from 'react';
import { Youtube } from 'lucide-react';
import { ChatMode } from '../utils/config';
import { Tooltip } from './Tooltip';
import { YouTubeUploadBox } from './YouTubeUploadBox';
import { useTokens } from '../hooks/useTokens';

interface YouTubeUploadProps {
  onUpload: (url: string) => void;
  disabled: boolean;
  mode: ChatMode;
}

export function YouTubeUploadButton({ onUpload, disabled, mode }: YouTubeUploadProps) {
  const { tokens } = useTokens();
  const [showUploadBox, setShowUploadBox] = useState(false);

  // Disable uploads in both uncensored and funny modes
  const isRestrictedMode = mode === 'uncensored' || mode === 'funny';
  const isDisabled = disabled || isRestrictedMode || Number(tokens) <= 0;

  const handleSubmit = (url: string) => {
    onUpload(url);
    setShowUploadBox(false);
  };

  if (isDisabled) {
    return (
      <Tooltip content="Only available in Safe Mode" visible={isRestrictedMode}>
        <div className="opacity-50">
          <button
            type="button"
            disabled
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-not-allowed"
            title="Add YouTube video"
          >
            <Youtube className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowUploadBox(true)}
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        title="Add YouTube video"
      >
        <Youtube className="w-6 h-6 text-gray-400" />
      </button>

      {showUploadBox && (
        <div className="absolute bottom-full mb-2 left-0 min-w-[300px]">
          <YouTubeUploadBox
            onSubmit={handleSubmit}
            onCancel={() => setShowUploadBox(false)}
          />
        </div>
      )}
    </div>
  );
}
