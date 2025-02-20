import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PlainTextFormatterProps {
  content: string;
}

export function PlainTextFormatter({ content }: PlainTextFormatterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4">
      <div className="bg-gray-800/50 rounded-t-lg px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <span className="text-sm text-gray-400">
          Plain Text
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-violet-400 transition-colors"
          aria-label={copied ? 'Copied!' : 'Copy text'}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-800/50 rounded-b-lg p-4 overflow-x-auto">
        <span className="text-sm text-gray-300 whitespace-pre-wrap font-normal">
          {content}
        </span>
      </pre>
    </div>
  );
}
