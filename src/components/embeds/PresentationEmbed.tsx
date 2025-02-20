import React from 'react';

interface PresentationEmbedProps {
  url: string;
}

export function PresentationEmbed({ url }: PresentationEmbedProps) {
  return (
    <div className="w-full max-w-[500px]">
      <div className="relative w-full">
        <div className="aspect-[500/130]">
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full rounded-lg border-0 shadow-lg"
            style={{ maxWidth: '500px' }}
            frameBorder="0"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
