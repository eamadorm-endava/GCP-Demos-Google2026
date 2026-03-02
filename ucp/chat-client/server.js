import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GoogleAuth } from 'google-auth-library';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Cloud Run backend URL (the Cloud Run service you want to call)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



// Where the React build is located
const DIST_DIR = path.join(__dirname, 'dist');

// Google ADC-based ID token minting (same mechanism as your gateway)
const auth = new GoogleAuth();
const clientCache = new Map();

async function getBearerForAudience(targetAudience) {
  if (!clientCache.has(targetAudience)) {
    console.log(`[AUTH] Creating IdTokenClient for audience: ${targetAudience}`);
    clientCache.set(targetAudience, await auth.getIdTokenClient(targetAudience));
  }
  const client = clientCache.get(targetAudience);
  const idToken = await client.idTokenProvider.fetchIdToken(targetAudience);
  return `Bearer ${idToken}`;
}

// Rate limiter object pointing to Max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Protect all API routes
app.use('/api', limiter);

// 1) Proxy API calls to the backend, injecting the ID token
app.use(
  '/api',
  async (req, _res, next) => {
    try {
      // Store Authorization header on the incoming request so onProxyReq can forward it
      req.headers['authorization'] = await getBearerForAudience(BACKEND_URL);
      next();
    } catch (err) {
      console.error('[AUTH] Failed to mint ID token:', err?.message || err);
      next(err);
    }
  },
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },

    onProxyReq: (proxyReq, req, _res) => {
      // Forward Authorization header
      const authHeader = req.headers['authorization'];
      if (authHeader) proxyReq.setHeader('Authorization', authHeader);

      // Optional: remove headers that can confuse Cloud Run auth / upstream services
      const headersToRemove = [
        'cookie',
        'referer',
        'origin',
        'x-goog-iap-jwt-assertion',
        'x-goog-authenticated-user-email',
        'x-goog-authenticated-user-id',
        'x-serverless-authorization',
      ];
      headersToRemove.forEach((h) => proxyReq.removeHeader(h));

      // Make sure Host matches the backend
      proxyReq.setHeader('host', new URL(BACKEND_URL).host);
      proxyReq.setHeader('User-Agent', 'UCP-Frontend-Gateway/1.0');
    },

    onError: (err, _req, res) => {
      console.error('[PROXY] Backend proxy error:', err);
      res.status(502).send('Gateway error');
    },
  }),
);

// 2) Serve the built frontend (static)
app.use(express.static(DIST_DIR));

// 3) SPA fallback (React Router, etc.)
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend gateway listening on port ${PORT}`);
  console.log(`Proxying /api -> ${BACKEND_URL}`);
});
