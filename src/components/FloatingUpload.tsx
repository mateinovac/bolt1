import React from 'react';
import { ImageUpload } from './ImageUpload';
import { Image as ImageIcon, X } from 'lucide-react';

interface FloatingUploadProps {
  onUploadComplete: (imageUrl: string) => void;
}

export function FloatingUpload({ onUploadComplete }: FloatingUploadProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-24 right-4">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-80">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Upload Image</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ImageUpload
            onUploadComplete={(url) => {
              onUploadComplete(url);
              setIsOpen(false);
            }}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-violet-500 text-white p-3 rounded-full shadow-lg hover:bg-violet-600 transition-colors"
        >
          <ImageIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
