import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,           // or any port you like
    proxy: {
      // Proxy /api requests to your Functions host:
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
        secure: false,
        // (no rewrite needed if Functions are at /api/<route>)
      },
    },
  },
});
