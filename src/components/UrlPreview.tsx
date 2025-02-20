import React from 'react';
import { isGooglePresentationUrl, getGooglePresentationEmbed } from '../utils/urlHelpers';
import { PresentationControls } from './PresentationControls';

interface UrlPreviewProps {
  url: string;
}

export function UrlPreview({ url }: UrlPreviewProps) {
  if (isGooglePresentationUrl(url)) {
    return (
      <div className="w-full max-w-[500px]">
        <div className="relative w-full">
          <div className="aspect-[4/3]">
            <iframe
              src={getGooglePresentationEmbed(url)}
              className="absolute inset-0 w-full h-full rounded-lg border-0 shadow-lg"
              style={{ maxWidth: '500px' }}
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            />
          </div>
        </div>
        <PresentationControls url={url} />
      </div>
    );
  }

  return null;
}
