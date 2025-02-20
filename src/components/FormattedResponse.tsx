import React from 'react';
import { ListFormatter } from './formatting/ListFormatter';
import { TableFormatter } from './formatting/TableFormatter';
import { CodeBlockFormatter } from './formatting/CodeBlockFormatter';
import { BlockquoteFormatter } from './formatting/BlockquoteFormatter';
import { formatInlineStyles, formatParagraph } from '../utils/textFormatting';
import { parseText } from '../utils/textParser';

interface FormattedResponseProps {
  text: string;
}

export function FormattedResponse({ text }: FormattedResponseProps) {
  const formatTextSection = (content: string): React.ReactNode => {
    // Handle blockquotes
    if (content.startsWith('>')) {
      return <BlockquoteFormatter content={content} />;
    }

    // Handle tables
    if (content.includes('|') && content.includes('\n|---')) {
      return <TableFormatter content={content} />;
    }

    // Handle lists
    if (content.split('\n').some(line => /^[*-]/.test(line.trim()))) {
      return <ListFormatter content={content} />;
    }

    if (content.split('\n').some(line => /^\d+\./.test(line.trim()))) {
      return <ListFormatter content={content} ordered />;
    }

    // Handle headers
    if (content.startsWith('#')) {
      const level = content.match(/^#+/)?.[0].length ?? 1;
      const headerText = content.replace(/^#+\s/, '');
      const Tag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
      const sizes = {
        h1: 'text-3xl font-extrabold',
        h2: 'text-2xl font-bold',
        h3: 'text-xl font-bold',
        h4: 'text-lg font-semibold',
        h5: 'text-base font-semibold',
        h6: 'text-sm font-semibold'
      };
      return (
        <Tag className={`${sizes[Tag]} my-4 text-gray-100`}>
          {formatInlineStyles(headerText)}
        </Tag>
      );
    }

    // Regular paragraph with inline formatting
    return formatParagraph(content);
  };

  const sections = parseText(text);

  return (
    <div className="prose prose-invert prose-violet max-w-none space-y-4">
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          {section.type === 'code' ? (
            <CodeBlockFormatter content={section.content} language={section.language} />
          ) : section.type === 'hr' ? (
            <hr className="my-6 border-t border-gray-700" />
          ) : (
            formatTextSection(section.content)
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
