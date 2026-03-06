import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    base: './',
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        ...(env.VITE_AI_PROVIDER && env.VITE_AI_PROVIDER !== 'gemini' ? {
          '@google/genai': path.resolve(__dirname, '../demo-gallery/demos/shared/src/ai-shim.ts')
        } : {})
      }
    }
  };
});
