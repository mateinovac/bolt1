import { CORS_PROXIES } from './corsProxies';

interface ImageLoadResult {
  success: boolean;
  image?: HTMLImageElement;
  error?: string;
}

export async function loadImage(url: string): Promise<ImageLoadResult> {
  // Increased timeout to 1 hour for initial load
  const INITIAL_TIMEOUT = 600000; // 10 minutes
  const PROXY_TIMEOUT = 600000; // 10 minutes

  // Try direct load first
  try {
    const directResult = await loadWithTimeout(url, INITIAL_TIMEOUT);
    if (directResult.success) {
      return directResult;
    }
  } catch (error) {
    console.warn('Direct load failed, trying proxies...');
  }

  // Try proxies if direct load fails
  return tryWithProxies(url, PROXY_TIMEOUT);
}

function loadWithTimeout(url: string, timeout: number): Promise<ImageLoadResult> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    
    let isResolved = false;
    
    const timeoutId = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        resolve({ 
          success: false, 
          error: 'Image load timed out' 
        });
      }
    }, timeout);

    image.onload = () => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        resolve({ success: true, image });
      }
    };

    image.onerror = () => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        resolve({ 
          success: false, 
          error: 'Failed to load image directly' 
        });
      }
    };

    image.src = url;
  });
}

async function tryWithProxies(url: string, timeout: number): Promise<ImageLoadResult> {
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(url);
      const result = await loadWithTimeout(proxyUrl, timeout);
      
      if (result.success) {
        return result;
      }
    } catch (error) {
      continue;
    }
  }

  return {
    success: false,
    error: 'Failed to load image. Please try again in a few moments.'
  };
}
