// File acting as a reverse proxy gateway.
// This server serves the static React application and proxies requests to private child demos.
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
// Initializes GoogleAuth to automatically retrieve credentials from the Cloud Run Metadata Server
const auth = new GoogleAuth();
const PORT = process.env.PORT || 8080;

// 1. CRITICAL FIX FOR CLOUD RUN: Trust the Google Load Balancer
// This fixes the "ValidationError: The 'Forwarded' header..." error
app.set('trust proxy', true);

// Configure Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 200, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // This disables the strict check if trust proxy isn't enough, 
  // but app.set('trust proxy') is the real fix.
  validate: { xForwardedForHeader: false } 
});

app.use(limiter);

// Target URLs (Backend)
const VERTICALS = {
  'agentic-governance': 'https://test-agentic-vendor-governance-platform-956266717219.us-west4.run.app',
};

// Helper to get token ID
async function getAuthToken(targetUrl) {
  try {
    console.log(`[AUTH START] Intentando generar token para: ${targetUrl}`);
    
    // 1. Verificar si targetUrl es válido
    if (!targetUrl) throw new Error('Target URL is undefined or empty');

    // 2. Obtener cliente
    const client = await auth.getIdTokenClient(targetUrl);
    console.log('[AUTH CLIENT] Cliente de identidad obtenido correctamente');

    // 3. Obtener headers
    const headers = await client.getRequestHeaders();
    console.log('[AUTH HEADERS] Headers generados con éxito');
    
    return headers['Authorization'];
  } catch (error) {
    // --- ESTOS SON LOS LOGS QUE NECESITAMOS ---
    console.error('=======================================');
    console.error(`[AUTH ERROR] Falló la generación de token para: ${targetUrl}`);
    console.error('Mensaje:', error.message);
    if (error.response) {
       console.error('Response Status:', error.response.status);
       console.error('Response Data:', JSON.stringify(error.response.data));
    }
    // Si el error es de credenciales, suele ser esto:
    if (error.message.includes('Could not load the default credentials')) {
        console.error('CAUSA PROBABLE: La Service Account no está asignada al contenedor o la librería no está instalada en prod.');
    }
    console.error('=======================================');
    return null;
  }
}

// Proxy Configuration
Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  // Middleware de Autenticación
  app.use(routePath, async (req, res, next) => {
    // Si ya tiene auth (ej. pruebas locales), no hacemos nada
    if (req.headers['authorization']) return next();

    const authToken = await getAuthToken(targetUrl);
    
    if (authToken) {
      req.headers['authorization'] = authToken;
      console.log(`[PROXY SUCCESS] Token inyectado correctamente para ${key}`);
    } else {
      console.warn(`[PROXY WARNING] Enviando petición a ${key} SIN TOKEN (Auth falló)`);
    }
    next();
  });

  // Middleware del Proxy
  app.use(
    routePath,
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/demos/${key}`]: '', // Delete the prefix /demos/xyz
      },
      onProxyReq: (proxyReq) => {
         // Opcional: ver si el header viaja en la salida
         console.log('[PROXY OUT CHECK] Auth Header:', proxyReq.getHeader('authorization') ? 'PRESENT' : 'MISSING');
      },
      onError: (err, req, res) => {
        console.error('[PROXY FAIL]', err);
        res.status(500).send('Proxy Error');
      }
    })
  );
});

// Serve the static React assets from Vite's build folder
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gateway proxy server running on port ${PORT}`);
});