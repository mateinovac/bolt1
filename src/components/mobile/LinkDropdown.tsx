import React from 'react';
import { Link, Image, FileText, Youtube } from 'lucide-react';

interface LinkDropdownProps {
  isOpen: boolean;
  onImageClick: () => void;
  onDocumentClick: () => void;
  onYoutubeClick: () => void;
}

export function LinkDropdown({ 
  isOpen, 
  onImageClick, 
  onDocumentClick, 
  onYoutubeClick 
}: LinkDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full mb-2 left-0 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {[
        { icon: Image, label: 'Image', onClick: onImageClick },
        { icon: FileText, label: 'Document', onClick: onDocumentClick },
        { icon: Youtube, label: 'YouTube', onClick: onYoutubeClick }
      ].map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 active:bg-gray-600
                     text-gray-200 text-left transition-colors"
        >
          <Icon className="w-5 h-5 text-gray-400" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
