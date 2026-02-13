// File acting as a reverse proxy gateway.
// This server serves the static React application and proxies requests to private child demos.
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Initializes GoogleAuth to automatically retrieve credentials from the Cloud Run Metadata Server
const auth = new GoogleAuth();
const PORT = process.env.PORT || 8080;

// Mapping of local proxy paths to secure backend Cloud Run URLs
const VERTICALS = {
  'agentic-governance': 'https://agentic-vendor-governance-platform-956266717219.us-west4.run.app',
};

// Function to fetch OIDC tokens scoped to the target application
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

// Setup proxy middleware for each defined vertical
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gateway proxy server running on port ${PORT}`);
});