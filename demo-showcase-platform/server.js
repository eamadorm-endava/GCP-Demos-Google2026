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
app.set('trust proxy', true);

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
  'agentic-governance': 'https://test-agentic-vendor-governance-platform-956266717219.us-west4.run.app',
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

  console.log(`[AUTH] Generating new token Id for target: ${targetAudience}`);

  try {
    const client = await auth.getIdTokenClient(targetAudience);

    const token = await client.idTokenProvider.fetchIdToken(targetAudience);

    tokenCache[targetAudience] = {
      token: token,
      expiresAt: now + (55 * 60 * 1000) 
    };

    return token;
  } catch (err) {
    console.error(`[AUTH ERROR] No se pudo generar token para ${targetAudience}:`, err.message);
    throw err;
  }
}

// --- PROXY Config ---

Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  const proxyOptions = {
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/demos/${key}`]: '', // Delete the prefix /demos/demo1 when sending the request
    },
    // Hook: It is executed right before sending the request to the demos
    onProxyReq: async (proxyReq, req, res) => {
      try {
        const idToken = await getIdToken(targetUrl);
        
        // Set the authentication: Bearer <token>
        if (idToken) {
          proxyReq.setHeader('Authorization', `Bearer ${idToken}`);
        }
      } catch (err) {
        console.error('[PROXY AUTH FAILED]', err);

      }
    },
    onError: (err, req, res) => {
      console.error('[PROXY ERROR]', err);
      res.status(500).send('Proxy Error');
    }
  };

  app.use(routePath, createProxyMiddleware(proxyOptions));
});

// 4. Serve Frontend
app.use(express.static(path.join(__dirname, 'dist')));

// 5. SPA Fallback (For React Router, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gateway proxy server running on port ${PORT}`);
});