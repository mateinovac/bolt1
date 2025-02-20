import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';

interface ThoughtProcessProps {
  content: string;
}

export function ThoughtProcess({ content }: ThoughtProcessProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-violet-400 hover:text-violet-300 transition-colors rounded-lg hover:bg-violet-500/10 group"
      >
        <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>
          {isExpanded ? 'Hide' : 'Show'} Thought Process
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-violet-500/5 border border-violet-500/10 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="prose prose-invert prose-violet max-w-none">
            {content.split('\n').map((line, index) => (
              <p key={index} className="text-gray-300 text-sm leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
