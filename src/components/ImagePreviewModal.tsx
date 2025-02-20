import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export function ImagePreviewModal({ imageUrl, alt, onClose }: ImagePreviewModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-3xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50 z-[10000]"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
