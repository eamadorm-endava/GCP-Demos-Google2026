import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Added 'base' path to match the reverse proxy URL structure in the parent showcase.
  // This ensures all built assets (js, css, images) are requested relatively from this sub-path 
  // instead of the root '/', preventing 404 errors when loaded inside the showcase iframe.
  base: '/demos/sentinel-ai/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true
  }
});