import React from 'react';
import { isFalMediaVideo } from '../../utils/urlHelpers';

interface VideoEmbedProps {
  url: string;
}

export function VideoEmbed({ url }: VideoEmbedProps) {
  // Handle fal.media videos differently
  if (isFalMediaVideo(url)) {
    return (
      <div className="relative w-full max-w-[300px] mx-auto mt-2">
        <div className="aspect-video">
          <video
            src={url}
            className="absolute inset-0 w-full h-full rounded-lg border-0 shadow-lg"
            controls
            playsInline
            preload="metadata"
          >
            <p>Your browser doesn't support HTML5 video.</p>
          </video>
        </div>
      </div>
    );
  }

  // Default iframe embed for other video sources
  return (
    <div className="relative w-full max-w-[300px] mx-auto mt-2">
      <div className="aspect-video">
        <iframe
          src={url}
          className="absolute inset-0 w-full h-full rounded-lg border-0 shadow-lg"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
}
