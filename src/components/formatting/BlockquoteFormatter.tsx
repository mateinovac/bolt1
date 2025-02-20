import React from 'react';
import { formatInlineStyles } from '../../utils/textFormatting';

interface BlockquoteFormatterProps {
  content: string;
}

export function BlockquoteFormatter({ content }: BlockquoteFormatterProps) {
  return (
    <blockquote className="my-4 pl-4 border-l-4 border-violet-500 italic text-gray-300">
      {formatInlineStyles(content.replace(/^>\s*/, ''))}
    </blockquote>
  );
}
