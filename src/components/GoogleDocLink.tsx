import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface GoogleDocLinkProps {
  url: string;
}

export function GoogleDocLink({ url }: GoogleDocLinkProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-gray-200">
        <FileText className="w-6 h-6 text-violet-400" />
        <span>Google Document</span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors w-fit"
      >
        <ExternalLink className="w-4 h-4" />
        <span>Open Document</span>
      </a>
    </div>
  );
}
