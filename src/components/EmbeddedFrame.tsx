import React from 'react';
import { PresentationEmbed } from './embeds/PresentationEmbed';
import { VideoEmbed } from './embeds/VideoEmbed';
import { AudioEmbed } from './embeds/AudioEmbed';
import { isFalMediaVideo, isFalMediaAudio } from '../utils/urlHelpers';

interface EmbeddedFrameProps {
  url: string;
}

export function EmbeddedFrame({ url }: EmbeddedFrameProps) {
  const isGoogleSlides = url.includes('docs.google.com/presentation');

  if (isGoogleSlides) {
    return <PresentationEmbed url={url} />;
  }

  if (isFalMediaVideo(url)) {
    return <VideoEmbed url={url} />;
  }

  if (isFalMediaAudio(url)) {
    return <AudioEmbed url={url} />;
  }

  return <VideoEmbed url={url} />;
}
