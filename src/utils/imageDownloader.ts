import { validateImageType } from './imageValidator';
import { CORS_PROXIES } from './corsProxies';

interface DownloadOptions {
  onProgress?: (progress: number) => void;
  suggestedFileName?: string;
  timeout?: number;
  maxSize?: number; // in bytes
}

const DEFAULT_OPTIONS: Required<DownloadOptions> = {
  onProgress: () => {},
  suggestedFileName: 'image',
  timeout: 600000, // 10 minutes
  maxSize: 50 * 1024 * 1024, // 50MB
};

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

export async function downloadImage(url: string, options: DownloadOptions = {}): Promise<void> {
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
      throw new Error('Failed to download image');
    }

    // Get content type and size
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;

    // Validate content type
    if (!validateImageType(contentType)) {
      throw new Error('Invalid image type');
    }

    // Check file size
    if (size > opts.maxSize) {
      throw new Error('Image file is too large');
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

    // Combine chunks
    const blob = new Blob(chunks, { type: contentType || 'image/jpeg' });

    // Generate file name
    const fileName = getFileName(url, contentType, opts.suggestedFileName);

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    opts.onProgress(100);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Download timed out');
      }
      throw error;
    }
    throw new Error('Failed to download image');
  }
}

function getFileName(url: string, contentType: string | null, suggestedName: string): string {
  // Try to get extension from content type
  const ext = contentType
    ? `.${contentType.split('/')[1].split('+')[0]}`
    : '.jpg';

  // Try to get original filename from URL
  try {
    const urlPath = new URL(url).pathname;
    const originalName = urlPath.split('/').pop();
    if (originalName && /\.(jpg|jpeg|png|gif|webp)$/i.test(originalName)) {
      return originalName;
    }
  } catch (e) {
    // Ignore URL parsing errors
  }

  // Fallback to suggested name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${suggestedName}-${timestamp}${ext}`;
}
