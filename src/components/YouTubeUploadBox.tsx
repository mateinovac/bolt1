import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface YouTubeUploadBoxProps {
  onSubmit: (url: string) => void;
  onCancel: () => void;
}

export function YouTubeUploadBox({ onSubmit, onCancel }: YouTubeUploadBoxProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    onSubmit(url);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 animate-in fade-in duration-200">
      <div className="space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          placeholder="Paste YouTube URL"
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                     text-gray-100 placeholder-gray-400 text-sm
                     focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          autoFocus
        />
        
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-2 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
