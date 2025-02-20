import React from 'react';

interface EmbeddedContentProps {
  html: string;
}

export function EmbeddedContent({ html }: EmbeddedContentProps) {
  // Extract iframe src if present
  const getIframeSrc = (html: string): string | null => {
    const match = html.match(/src=["'](.*?)["']/);
    return match ? match[1] : null;
  };

  const iframeSrc = getIframeSrc(html);

  if (!iframeSrc) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="aspect-video">
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full rounded-lg"
          allow="autoplay"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </div>
    </div>
  );
}
