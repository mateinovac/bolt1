import { NETWORK_CONFIG } from './config';

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

// Simple fetch without retries
export async function fetchWithRetry(
  url: string,
  options: FetchOptions
): Promise<Response> {
  const {
    retries = NETWORK_CONFIG.MAX_RETRIES,
    retryDelay = NETWORK_CONFIG.RETRY_DELAY,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        credentials: 'omit',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        keepalive: true,
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Network request failed');
      
      if (attempt < retries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch after retries');
}
