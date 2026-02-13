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
    if (!targetUrl) throw new Error('Target URL is undefined or empty');
    
    // console.log(`[AUTH START] Intentando generar token para: ${targetUrl}`);
    
    // 1. Obtenemos el cliente para ID Token
    const client = await auth.getIdTokenClient(targetUrl);

    // 2. CAMBIO CRÍTICO: Usamos fetchIdToken para obtener el string crudo
    // Esto evita el problema de getRequestHeaders() devolviendo {}
    const idToken = await client.fetchIdToken(targetUrl);
    
    if (!idToken) {
        throw new Error('fetchIdToken devolvió vacío');
    }

    console.log('[AUTH SUCCESS] Token generado correctamente. Longitud:', idToken.length);
    
    // 3. Construimos nosotros mismos el valor del header
    return `Bearer ${idToken}`;

  } catch (error) {
    console.error(`[AUTH ERROR] Falló token para: ${targetUrl}`);
    console.error('Mensaje:', error.message);
    // Si hay respuesta detallada del error de Google, la mostramos
    if (error.response) console.error('Data:', JSON.stringify(error.response.data));
    return null;
  }
}

Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  app.use(routePath, async (req, res, next) => {
    // Si ya viene con auth (pruebas locales), lo respetamos
    if (req.headers['authorization']) return next();

    const authToken = await getAuthToken(targetUrl);
    
    if (authToken) {
      req.headers['authorization'] = authToken;
      // console.log(`[PROXY] Token inyectado para ${key}`);
    } else {
      console.warn(`[PROXY WARNING] ¡ERROR CRÍTICO! Enviando petición a ${key} SIN TOKEN.`);
    }
    next();
  });

  app.use(
    routePath,
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/demos/${key}`]: '', 
      },
      onError: (err, req, res) => {
        console.error('[PROXY FAIL]', err);
        res.status(500).send('Proxy Error');
      }
    })
  );
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gateway proxy server running on port ${PORT}`);
});