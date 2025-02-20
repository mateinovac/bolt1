// URL validation helpers
export const isUrl = (text: string): boolean => {
  return text.trim().toLowerCase().startsWith('https://');
};

// YouTube URL validation
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com/') || url.includes('youtu.be/');
};

// Extract YouTube video ID
export const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// Google-specific URL helpers
export const isGoogleStorageUrl = (url: string): boolean => {
  return url.startsWith('https://storage.googleapis.com/imagebucket163155555551/');
};

export const isGoogleStorageVideoUrl = (url: string): boolean => {
  return url.startsWith('https://storage.googleapis.com/isolate-dev-hot-rooster_toolkit_bucket/');
};

export const isGooglePresentationUrl = (url: string): boolean => {
  return url.startsWith('https://docs.google.com/presentation/');
};

export const isGoogleDocumentUrl = (url: string): boolean => {
  return url.startsWith('https://docs.google.com/document/');
};

export const getGooglePresentationEmbed = (url: string): string => {
  const baseUrl = url.split('?')[0];
  return `${baseUrl}/embed?start=false&loop=false&delayms=3000`;
};

// Media type helpers
export const isImageUrl = (text: string): boolean => {
  if (!isUrl(text)) return false;
  if (isGoogleStorageUrl(text) && !isGoogleStorageVideoUrl(text)) return true;
  const imageExtensions = /\.(jpg|jpeg|gif|png|webp|svg)(\?.*)?$/i;
  return imageExtensions.test(text);
};

export const isFalMediaVideo = (url: string): boolean => {
  return (url.startsWith('https://fal.media/files/') || url.startsWith('https://v3.fal.media/files/')) && 
         url.toLowerCase().endsWith('.mp4') || 
         isGoogleStorageVideoUrl(url);
};

export const isFalMediaAudio = (url: string): boolean => {
  return (
    (url.startsWith('https://fal.media/files/') && url.toLowerCase().endsWith('.mp3')) ||
    (url.startsWith('https://v2.fal.media/files/') && url.toLowerCase().endsWith('.wav'))
  );
};

// Embeddable content helpers
export const isEmbeddableUrl = (url: string): boolean => {
  return (
    isGooglePresentationUrl(url) ||
    url.includes('docs.google.com/spreadsheets') ||
    url.includes('youtube.com') ||
    url.includes('vimeo.com') ||
    isFalMediaVideo(url) ||
    isFalMediaAudio(url)
  );
};

export const getEmbedUrl = (url: string): string => {
  if (isGooglePresentationUrl(url)) {
    return getGooglePresentationEmbed(url);
  }
  return url;
};

// CORS and proxy helpers
export const proxyImageUrl = (url: string): string => {
  return `https://proxy.cors.sh/${url}`;
};
