import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy /api requests to the .NET backend — avoids CORS in development
    proxy: {
      '/api': {
        target: 'http://localhost:5157',
        changeOrigin: true,
      },
    },
  },
});
