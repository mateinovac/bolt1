import React, { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';
import { CodeRunner } from '../CodeRunner';

interface CodeBlockFormatterProps {
  content: string;
  language?: string;
}

export function CodeBlockFormatter({ content, language }: CodeBlockFormatterProps) {
  const [copied, setCopied] = useState(false);
  const [showRunner, setShowRunner] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Sanitize and validate content
  const sanitizedContent = React.useMemo(() => {
    try {
      // Remove null characters and other potentially problematic characters
      return content
        .replace(/\0/g, '')
        .replace(/\u2028/g, '\n')
        .replace(/\u2029/g, '\n');
    } catch (error) {
      console.error('Code sanitization error:', error);
      return 'Error: Could not display code content';
    }
  }, [content]);

  // Error boundary for content rendering
  if (!sanitizedContent) {
    return (
      <div className="my-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
        Error: Invalid code content
      </div>
    );
  }

  return (
    <div className="my-4 w-[calc(100vw-2rem)] sm:w-full mx-auto overflow-hidden rounded-lg bg-gray-900/50 border border-gray-800">
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-mono text-violet-400">
            {language || 'code'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {language && (
            <button
              onClick={() => setShowRunner(true)}
              className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 hover:text-violet-400 transition-colors"
              aria-label="Run code"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Run</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 hover:text-violet-400 transition-colors"
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <pre className="p-4 min-w-max">
            <code className="text-xs sm:text-sm font-mono text-gray-300 whitespace-pre leading-relaxed">
              {sanitizedContent}
            </code>
          </pre>
        </div>
      </div>
      {showRunner && (
        <CodeRunner
          code={sanitizedContent}
          language={language || 'javascript'}
          onClose={() => setShowRunner(false)}
        />
      )}
    </div>
  );
}
