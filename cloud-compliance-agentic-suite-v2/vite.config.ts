import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Nota: Si usas la integración oficial de Vite para Tailwind 4

export default defineConfig(({ mode }) => {
    // Carga las variables de entorno basadas en el modo (development/production)
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
      // Added 'base' path to match the reverse proxy URL structure in the parent showcase.
      // This ensures all built assets (js, css, images) are requested relatively from this sub-path 
      // instead of the root '/', preventing 404 errors when loaded inside the showcase iframe.
      base: '/demos/cloud-compliance/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // tailwindcss(), // Descomenta si usas el plugin de Vite nativo de Tailwind 4, si usas PostCSS déjalo así.
      ],
      define: {
        // Esto inyecta la variable de entorno de manera segura en el cliente
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});