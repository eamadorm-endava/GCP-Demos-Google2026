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
    // Uses the SA of the CloudRun instance
    const client = await auth.getIdTokenClient(targetUrl);
    const headers = await client.getRequestHeaders();
    return headers['Authorization'];
  } catch (error) {
    console.error('=======================================');
    console.error(`[AUTH ERROR] Falló la generación de token para: ${targetUrl}`);
    console.error('Detalle del error:', error.message);
    if (error.response) console.error('Response data:', error.response.data);
    console.error('=======================================');
    return null;
  }
}

// Proxy Configuration
Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  // Middleware 1: Auth Injection
  app.use(routePath, async (req, res, next) => {
    try {
      // Get the token
      const authToken = await getAuthToken(targetUrl);
      
      if (authToken) {
        // Inject the token in the headers of the incoming requests
        req.headers['authorization'] = authToken;
      } else {
        console.warn(`Token could not be generated for: ${key}`);
      }
      
      next();
    } catch (err) {
      console.error('Error in authentication middleware:', err);
      next(err);
    }
  });

  // Middleware 2: Proxy
  app.use(
    routePath,
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/demos/${key}`]: '', // Delete the prefix /demos/xyz
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxy request to: ${targetUrl}${proxyReq.path}`);
        }
    })
  );
});

// Serve the static React assets from Vite's build folder
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gateway proxy server running on port ${PORT}`);
});