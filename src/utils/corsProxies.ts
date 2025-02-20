// Set timeout to 10 minutes (600000ms)
export const PROXY_TIMEOUT = 600000;

// List of CORS proxies to try in order
export const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
];
