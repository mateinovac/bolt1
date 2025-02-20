import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [],
  },
  server: {
    hmr: {
      timeout: 0, // Disable HMR timeout
      clientTimeout: 0, // Disable client timeout
      serverTimeout: 0 // Disable server timeout
    },
    headers: {
      // Allow all sources for frames and other content
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' *; frame-src *; frame-ancestors *;",
      // Allow embedding in iframes from any origin
      'X-Frame-Options': 'ALLOWALL'
    },
    watch: {
      usePolling: true, // Enable polling for file changes
      interval: 1000 // Check every second
    },
    timeout: 0, // Disable server timeout
    middlewareTimeout: 0, // Disable middleware timeout
    connectTimeout: 0 // Disable connection timeout
  }
});
