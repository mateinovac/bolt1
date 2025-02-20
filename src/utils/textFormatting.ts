import React from 'react';
import { MathRenderer } from '../components/MathRenderer';

// Helper to check if text contains math expressions
function containsMath(text: string): boolean {
  return /\\\(.*?\\\)|\$[^$].*?[^$]\$|\\\[.*?\\\]|\$\$.*?\$\$/.test(text);
}

// Helper to extract math expressions
function extractMath(text: string): { type: 'text' | 'math'; content: string }[] {
  const mathPattern = /(\\\(.*?\\\)|\$[^$].*?[^$]\$|\\\[.*?\\\]|\$\$.*?\$\$)/gs;
  const parts = text.split(mathPattern);
  
  return parts.map(part => {
    if (part.startsWith('\\(') && part.endsWith('\\)')) {
      return { type: 'math', content: part.slice(2, -2).trim() };
    }
    if (part.startsWith('$') && part.endsWith('$') && !part.startsWith('$$')) {
      return { type: 'math', content: part.slice(1, -1).trim() };
    }
    if (part.startsWith('\\[') && part.endsWith('\\]')) {
      return { type: 'math', content: part.slice(2, -2).trim(), display: true };
    }
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return { type: 'math', content: part.slice(2, -2).trim(), display: true };
    }
    return { type: 'text', content: part };
  });
}

export const formatInlineStyles = (text: string): React.ReactNode[] => {
  try {
    if (!containsMath(text)) {
      // Handle non-math formatting
      return [React.createElement('span', { key: 'text' }, text)];
    }

    const parts = extractMath(text);
    return parts.map((part, index) => {
      if (part.type === 'math') {
        return React.createElement(MathRenderer, {
          key: `math-${index}`,
          math: part.content,
          inline: !part.display
        });
      }
      return React.createElement('span', { key: `text-${index}` }, part.content);
    });
  } catch (error) {
    console.error('Error formatting math:', error);
    return [React.createElement('span', { key: 'fallback' }, text)];
  }
};

export const formatParagraph = (text: string): React.ReactNode => {
  try {
    if (!text || !text.trim()) {
      return null;
    }

    // Handle math blocks separately
    if (text.startsWith('$$') && text.endsWith('$$')) {
      const mathContent = text.slice(2, -2).trim();
      return React.createElement('div', {
        className: 'math-block my-4',
        key: 'math-block'
      }, React.createElement(MathRenderer, {
        math: mathContent,
        inline: false
      }));
    }

    // Handle inline math within paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.length > 0);
    
    return paragraphs.map((paragraph, index) => {
      try {
        if (containsMath(paragraph)) {
          return React.createElement('p', {
            key: index,
            className: "my-2 leading-relaxed text-gray-200"
          }, formatInlineStyles(paragraph));
        }
        
        return React.createElement('p', {
          key: index,
          className: "my-2 leading-relaxed text-gray-200"
        }, paragraph);
      } catch (error) {
        console.error('Error formatting paragraph:', error);
        return React.createElement('p', {
          key: index,
          className: "my-2 leading-relaxed text-gray-200"
        }, paragraph);
      }
    });
  } catch (error) {
    console.error('Error formatting text:', error);
    return React.createElement('p', {
      className: "my-2 leading-relaxed text-gray-200"
    }, text);
  }
};
