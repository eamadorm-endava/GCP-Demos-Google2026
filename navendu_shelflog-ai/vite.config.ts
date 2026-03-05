
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Support both API_KEY and GEMINI_API_KEY (GEMINI_API_KEY takes priority)
  const apiKey = env.GEMINI_API_KEY || env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    server: {
      host: '0.0.0.0',
      port: process.env.PORT ? Number(process.env.PORT) : 8080,
    },
    preview: {
      host: '0.0.0.0',
      port: process.env.PORT ? Number(process.env.PORT) : 8080,
    },
  };
});
