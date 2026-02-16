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

// 1. Trust Proxy
app.set('trust proxy', 1);

// 2. Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

app.use(limiter);

// Target URLs
const VERTICALS = {
  'agentic-governance': 'https://test-agentic-vendor-governance-platform-956266717219.us-west4.run.app/',
};


const auth = new GoogleAuth();
const clientCache = {};
async function getAuthHeaders(targetAudience) {
  try {
    // 1. Reutilizamos el cliente si ya existe para esa audiencia
    if (!clientCache[targetAudience]) {
      console.log(`[AUTH] Creando nuevo IdTokenClient para: ${targetAudience}`);
      clientCache[targetAudience] = await auth.getIdTokenClient(targetAudience);
    }

    const client = clientCache[targetAudience];

    // 2. Método Mágico: Obtiene headers con el token OIDC válido y firmado.
    // Maneja automáticamente la expiración y renovación.
    const headers = await client.getRequestHeaders(targetAudience);
    
    return headers['Authorization']; // Retorna "Bearer eyJ..."
  } catch (err) {
    console.error(`[AUTH ERROR] Falló al obtener cliente para ${targetAudience}:`, err.message);
    return null;
  }
}

// --- PROXY Config ---

Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  // 1. Authentication Middleware (executed before the proxy)
  const authMiddleware = async (req, res, next) => {
    try {
      const authHeader = await getAuthHeaders(targetUrl);
      if (authHeader) {
        req.cloudRunAuth = authHeader; // Guardamos el header listo
      }
      next();
    } catch (error) {
      console.error('[AUTH MIDDLEWARE ERROR]', error);
      next(); 
    }
  };

  // 2. Proxy Middleware
  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^${routePath}`]: '', 
    },

    onProxyReq: (proxyReq, req, res) => {

      if (req.cloudRunAuth) {
        proxyReq.setHeader('Authorization', req.cloudRunAuth);
      }

      if (!proxyReq.path || proxyReq.path.trim() === '') {
        proxyReq.path = '/';
      }

      // Set the right target host
      const targetHost = new URL(targetUrl).host;
      proxyReq.setHeader('host', targetHost);

      console.log(`[PROXY SEND] Destiny: https://${targetHost}${proxyReq.path}`);
    },
    
    onError: (err, req, res) => {
      console.error('[PROXY ERROR]', err);
      res.status(502).send('Gateway Proxy Error');
    },
    
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[PROXY RESPONSE] ${req.method} ${req.path} -> Status: ${proxyRes.statusCode}`);
        
        // Si quieres ver a dónde te redirige (si es un 301/302)
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
            console.log(`[PROXY REDIRECT] Location header: ${proxyRes.headers['location']}`);
        }
        console.error(`[CLOUD RUN ERROR] Motivo del ${proxyRes.statusCode}: ${proxyRes.headers['www-authenticate']}`);
    },
  });

  // 3. Chain auth & proxy
  app.use(routePath, authMiddleware, proxyMiddleware);
});

// Serve Frontend
app.use(express.static(path.join(__dirname, 'dist')));

// 5. SPA Fallback (For React Router, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gateway proxy server running on port ${PORT}`);
});