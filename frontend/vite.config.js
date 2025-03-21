import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:5000', // Proxy all requests starting with /auth to the backend
    }, // Opens browser automatically
  }
});
