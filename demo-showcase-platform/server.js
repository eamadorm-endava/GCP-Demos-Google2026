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
  'agentic-governance': 'https://agentic-vendor-governance-platform-956266717219.us-west4.run.app',
};

async function getAuthHeaders(targetUrl) {
  try {
    const client = await auth.getIdTokenClient(targetUrl);
    const headers = await client.getRequestHeaders();
    return headers['Authorization'];
  } catch (error) {
    console.error(`Error fetching auth token for ${targetUrl}:`, error);
    return null;
  }
}

Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  app.use(
    `/demos/${key}`,
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/demos/${key}`]: '', 
      },
      // Intercept the outgoing request to the child demo and attach the IAM token
      onProxyReq: async (proxyReq, req, res) => {
        const authHeader = await getAuthHeaders(targetUrl);
        if (authHeader) {
          proxyReq.setHeader('Authorization', authHeader);
        }
      },
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