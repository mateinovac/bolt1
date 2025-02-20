import { toast } from './toast';
import { CORS_PROXIES } from './corsProxies';
import { formatFileSize } from './formatters';

interface DownloadOptions {
  onProgress?: (progress: number) => void;
  suggestedFileName?: string;
  timeout?: number;
  maxSize?: number; // in bytes
}

const DEFAULT_OPTIONS: Required<DownloadOptions> = {
  onProgress: () => {},
  suggestedFileName: 'sound',
  timeout: 600000, // 10 minutes
  maxSize: 100 * 1024 * 1024, // 100MB
};

// Map of file extensions to MIME types
const AUDIO_MIME_TYPES = new Map([
  ['mp3', 'audio/mpeg'],
  ['wav', 'audio/wav'],
  ['ogg', 'audio/ogg'],
  ['m4a', 'audio/mp4'],
  ['aac', 'audio/aac'],
  ['webm', 'audio/webm']
]);

// Get MIME type from URL or fallback to a default
function getMimeType(url: string, contentType: string | null): string {
  // Try to get extension from URL
  const extension = url.split('.').pop()?.toLowerCase();
  if (extension && AUDIO_MIME_TYPES.has(extension)) {
    return AUDIO_MIME_TYPES.get(extension)!;
  }

  // Check if content-type is valid
  if (contentType && contentType.startsWith('audio/')) {
    return contentType;
  }

  // Fallback to mp3 if no valid type is found
  return 'audio/mpeg';
}

async function tryDownloadWithUrl(url: string, options: Required<DownloadOptions>) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout);

  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function downloadSound(url: string, options: DownloadOptions = {}): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('Invalid URL protocol');
    }

    // Try direct download first
    let response: Response | null = null;
    try {
      response = await tryDownloadWithUrl(url, opts);
    } catch (directError) {
      // If direct download fails, try proxies
      for (const proxyFn of CORS_PROXIES) {
        try {
          const proxyUrl = proxyFn(url);
          response = await tryDownloadWithUrl(proxyUrl, opts);
          if (response.ok) break;
        } catch (e) {
          continue;
        }
      }
    }

    if (!response) {
      throw new Error('Failed to download sound file');
    }

    // Get content type and size
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;

    // Check file size
    if (size > opts.maxSize) {
      throw new Error(`File size (${formatFileSize(size)}) exceeds maximum allowed size (${formatFileSize(opts.maxSize)})`);
    }

    // Read the response with progress
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Failed to read response');

    const chunks: Uint8Array[] = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      if (size) {
        opts.onProgress(Math.round((receivedLength / size) * 100));
      }
    }

    // Get the appropriate MIME type
    const mimeType = getMimeType(url, contentType);

    // Create blob with correct MIME type
    const blob = new Blob(chunks, { type: mimeType });

    // Generate file name with correct extension
    const extension = mimeType.split('/')[1].replace('mpeg', 'mp3');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = opts.suggestedFileName 
      ? `${opts.suggestedFileName}.${extension}`
      : `audio-${timestamp}.${extension}`;

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    opts.onProgress(100);
    toast.success('Sound downloaded successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Download timed out');
      }
      throw error;
    }
    throw new Error('Failed to download sound file');
  }
}
