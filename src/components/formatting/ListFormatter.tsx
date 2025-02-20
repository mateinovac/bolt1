import React from 'react';
import { formatInlineStyles } from '../../utils/textFormatting';

interface ListFormatterProps {
  content: string;
  ordered?: boolean;
}

export function ListFormatter({ content, ordered = false }: ListFormatterProps) {
  const lines = content.split('\n');
  const items = lines.filter(line => {
    const trimmedLine = line.trim();
    return ordered 
      ? /^\d+\.\s/.test(trimmedLine)  // Match "1. " pattern with required space
      : /^[*-]\s/.test(trimmedLine);   // Match "* " or "- " with required space
  });

  // For ordered lists, extract the actual numbers used in the content
  const numbers = ordered
    ? items.map(item => {
        const match = item.match(/^(\d+)\.\s/);
        return match ? parseInt(match[1], 10) : 1;
      })
    : [];

  // Find the starting number for ordered lists
  const start = numbers.length > 0 ? numbers[0] : 1;

  const ListComponent = ordered ? 'ol' : 'ul';
  
  return (
    <ListComponent 
      className={`my-4 ${ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-2`}
      start={start}
    >
      {items.map((item, index) => {
        // Remove the list marker and any leading/trailing whitespace
        const content = ordered
          ? item.replace(/^\d+\.\s+/, '').trim()
          : item.replace(/^[*-]\s+/, '').trim();

        return (
          <li key={index} className="text-gray-200">
            {formatInlineStyles(content)}
          </li>
        );
      })}
    </ListComponent>
  );
}
