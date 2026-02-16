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
  'agentic-governance/': 'https://test-agentic-vendor-governance-platform-956266717219.us-west4.run.app',
};


const auth = new GoogleAuth();

// Simple Cache
// Structure: { 'https://...': { token: 'ey...', expiresAt: 123456789 } }
const tokenCache = {};

async function getIdToken(targetAudience) {
  const now = Date.now();

  if (tokenCache[targetAudience] && tokenCache[targetAudience].expiresAt > (now + 300000)) {
    return tokenCache[targetAudience].token;
  }

  console.log(`[AUTH] Generating new token for: ${targetAudience}`);

  try {
    const client = await auth.getIdTokenClient(targetAudience);

    const token = await client.idTokenProvider.fetchIdToken(targetAudience);

    tokenCache[targetAudience] = {
      token: token,
      expiresAt: now + (55 * 60 * 1000) 
    };

    return token;
  } catch (err) {
    console.error(`[AUTH ERROR] Failed for ${targetAudience}:`, err.message);
    throw err;
  }
}

// --- PROXY Config ---

Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  // 1. Authentication Middleware (executed before the proxy)
  const authMiddleware = async (req, res, next) => {
    try {
      const token = await getIdToken(targetUrl);
      if (token) {
        req.headers['authorization'] = `Bearer ${token}`;
        console.log("Token succesfully set in the request header")
        console.log('[DEBUG] Token Auth:', req.headers['authorization'].substring(0, 50) + '...');
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
      [`^/demos/${key}`]: '', // Delete the prefix /demos/demo1 when sending the request
    },

    onProxyReq: (proxyReq, req, res) => {
      console.log(`[PROXY] Sending request to ${targetUrl}`);
      console.log('[DEBUG] req.headers.authorization:', req.headers.authorization);
      console.log('[DEBUG] proxyReq.getHeader(authorization):', proxyReq.getHeader("authorization"));

      const protocol = 'https:';
      const host = proxyReq.getHeader('host');
      const path = proxyReq.path; 

      console.log(`[PROXY DEBUG] Final path: ${protocol}//${host}${path}`);
      console.log('[DEBUG] proxyReq.getHeader(host):', proxyReq.getHeader("host"))
    },
    onError: (err, req, res) => {
      console.error('[PROXY ERROR]', err);
      res.status(502).send('Gateway Proxy Error');
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[PROXY RESPONSE] ${req.method} ${req.url} -> Status: ${proxyRes.statusCode}`);
        
        // Si quieres ver a dónde te redirige (si es un 301/302)
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
            console.log(`[PROXY REDIRECT] Location header: ${proxyRes.headers['location']}`);
        }
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