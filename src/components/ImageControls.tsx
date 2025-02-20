import React from 'react';
import { ExternalLink, Edit2, Eraser } from 'lucide-react';
import { ImageDownloadButton } from './ImageDownloadButton';

interface ImageControlsProps {
  imageUrl: string;
  onEdit: () => void;
  onRemoveBackground: () => void;
  isProcessing: boolean;
  altText?: string;
}

export function ImageControls({ 
  imageUrl, 
  onEdit, 
  onRemoveBackground, 
  isProcessing,
  altText 
}: ImageControlsProps) {
  // Check if the image URL ends with .gif
  const isGif = imageUrl.toLowerCase().endsWith('.gif');

  if (isGif) {
    return null; // Return null or an empty fragment if you want nothing to be rendered
  }

  return (
    <div className="flex gap-2 mt-2">
      <a
        href={imageUrl}
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
        title="Edit Image"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRemoveBackground}
        disabled={isProcessing}
        className={`p-2 bg-gray-700 text-white rounded-md transition-colors ${
          isProcessing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-600'
        }`}
        title="Remove Background"
      >
        <Eraser className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`} />
      </button>
      <ImageDownloadButton imageUrl={imageUrl} altText={altText} iconOnly />
    </div>
  );
}
