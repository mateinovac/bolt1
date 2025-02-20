import React, { useState } from 'react';
import { Edit2, Copy, Download, Check } from 'lucide-react';

interface PresentationControlsProps {
  url: string;
}

export function PresentationControls({ url }: PresentationControlsProps) {
  const [copied, setCopied] = useState(false);
  
  const baseUrl = url.split('?')[0]; // Remove any existing parameters
  const editUrl = `${baseUrl}/edit`;
  const downloadUrl = `${baseUrl}/export/pptx`;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(editUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2 mt-2">
      <a
        href={editUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
        title="Edit presentation"
      >
        <Edit2 className="w-4 h-4" />
      </a>
      
      <button
        onClick={handleCopyUrl}
        className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        title={copied ? 'URL copied!' : 'Copy URL'}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      <a
        href={downloadUrl}
        className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        title="Download PPTX"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}
