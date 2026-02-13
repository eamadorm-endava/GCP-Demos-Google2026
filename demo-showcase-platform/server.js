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

// Configure rate limiter
// Limits requests to 200 per 15 minutes per IP.
// This prevents DoS attacks on file system access (res.sendFile)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 200, // Limit each IP to 200 requests per `window`
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: 'Too many requests from this IP, please try again after 15 minutes',
});

//Apply rate limiting to all requests
app.use(limiter);

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
    console.error(`Error generating token for ${targetUrl}:`, error);
    return null;
  }
}

// Proxy configuration with Auth Middleware
Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  // 1. Middleware of Authentication
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

  // 2. Proxy Middleware (After the token is set)
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