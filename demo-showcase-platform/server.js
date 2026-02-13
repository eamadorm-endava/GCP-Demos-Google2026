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
const PORT = process.env.PORT || 8080;

// 1. CRITICAL FOR CLOUD RUN: Trust the Load Balancer
app.set('trust proxy', true);

// 2. Rate Limiting Security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 200, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false } 
});

app.use(limiter);

// Target URLs (Backend)
const VERTICALS = {
  'agentic-governance': 'https://test-agentic-vendor-governance-platform-956266717219.us-west4.run.app',
};

// 4. Robust Authentication Helper
async function getAuthToken(targetUrl) {
  try {
    if (!targetUrl) throw new Error('Target URL is undefined');

    // Initialize GoogleAuth (uses Cloud Run Service Account automatically)
    const auth = new GoogleAuth();
    
    // Get the ID Token client specifically for the target audience
    const client = await auth.getIdTokenClient(targetUrl);

    // FIX: Access the internal provider to get the raw token string
    // This resolves the issue where getRequestHeaders returned empty objects
    const token = await client.idTokenProvider.fetchIdToken(targetUrl);

    console.log(`[AUTH SUCCESS] Token generado para ${targetUrl}, token = ${token}`);
    return `Bearer ${token}`;

  } catch (error) {
    console.error(`[AUTH ERROR] Falló la generación de token para: ${targetUrl}`);
    console.error('Mensaje:', error.message);
    
    // Fallback: Try fetching directly from Metadata Server (Cloud Run Native)
    try {
        console.log('[AUTH RETRY] Intentando método nativo de Metadata Server...');
        const metadataUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${targetUrl}`;
        const response = await fetch(metadataUrl, { headers: { 'Metadata-Flavor': 'Google' } });
        if (response.ok) return `Bearer ${await response.text()}`;
    } catch (e) {
        console.error('[AUTH FATAL] El fallback también falló.');
    }
    
    return null;
  }
}

// 5. Setup Proxies
Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  // Middleware A: Auth Injection (Runs before Proxy)
  app.use(routePath, async (req, res, next) => {
    // If auth is already present (e.g. local testing), skip
    if (req.headers['authorization']) return next();

    const authToken = await getAuthToken(targetUrl);
    
    if (authToken) {
      req.headers['authorization'] = authToken;
      console.log(`[PROXY PREPARE] Token inyectado en request para ${key}`);
    } else {
      console.warn(`[PROXY WARNING] ⚠️ Enviando petición a ${key} SIN TOKEN (Probable 403)`);
    }
    next();
  });

  // Middleware B: The Proxy (http-proxy-middleware v2.x)
  app.use(
    routePath,
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/demos/${key}`]: '', // Removes /demos/agentic-governance from path
      },
      // LOG EXTRA: Verifica que la petición sale con el header
      onProxyReq: (proxyReq, req, res) => {
         const hasAuth = proxyReq.getHeader('authorization');
         console.log(`[PROXY OUTGOING] -> ${targetUrl} | Auth Header Present: ${!!hasAuth}`);
      },
      onError: (err, req, res) => {
        console.error('[PROXY FAIL]', err);
        res.status(500).send('Proxy Error');
      }
    })
  );
});

// 6. Serve Static Frontend
app.use(express.static(path.join(__dirname, 'dist')));

// 7. SPA Fallback (Express 4 Compatible)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gateway proxy server running on port ${PORT}`);
});