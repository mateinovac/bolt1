import React from 'react';
import { Volume2, ExternalLink } from 'lucide-react';
import { VideoDownloadButton } from './VideoDownloadButton';

interface VideoControlsProps {
  videoUrl: string;
  onEdit: () => void;
}

export function VideoControls({ videoUrl, onEdit }: VideoControlsProps) {
  return (
    <div className="flex gap-2 mt-2">
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
        title="Open URL"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
      <button
        onClick={onEdit}
        className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        title="Add Sound to Video"
      >
        <Volume2 className="w-4 h-4" />
      </button>
      <VideoDownloadButton videoUrl={videoUrl} iconOnly />
    </div>
  );
}
