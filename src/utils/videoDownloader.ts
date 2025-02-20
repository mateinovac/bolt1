interface DownloadOptions {
  onProgress?: (progress: number) => void;
  timeout?: number;
}

const DEFAULT_OPTIONS: Required<DownloadOptions> = {
  onProgress: () => {},
  timeout: 600000, // 10 minutes
};

export async function downloadVideo(url: string, options: DownloadOptions = {}): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to download video');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('video/')) {
      throw new Error('Invalid video format');
    }

    const reader = response.body?.getReader();
    const contentLength = response.headers.get('content-length');
    const totalLength = contentLength ? parseInt(contentLength, 10) : 0;

    if (!reader) throw new Error('Failed to read video data');

    const chunks: Uint8Array[] = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      if (totalLength) {
        opts.onProgress(Math.round((receivedLength / totalLength) * 100));
      }
    }

    const blob = new Blob(chunks, { type: contentType });
    const fileName = getVideoFileName(url);

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
    throw new Error('Failed to download video');
  }
}

function getVideoFileName(url: string): string {
  try {
    const urlPath = new URL(url).pathname;
    const originalName = urlPath.split('/').pop();
    if (originalName?.match(/\.(mp4|webm)$/i)) {
      return originalName;
    }
  } catch (e) {
    // Ignore URL parsing errors
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `video-${timestamp}.mp4`;
}
