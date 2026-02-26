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
  'agentic-governance': 'https://agentic-vendor-governance-platform-956266717219.us-west4.run.app',
  'buildintel-construction': 'https://buildintel-construction-ai-platform-956266717219.us-west4.run.app',
  'cloud-compliance': 'https://cloud-compliance-agentic-suite-v2-956266717219.us-west4.run.app',
  'contract-intelligence': 'https://contract-intelligence-platform-956266717219.us-west4.run.app',
  'contractintel': 'https://contractintel-ai-956266717219.us-west4.run.app',
  'sentinel-ai': 'https://sentinel-ai-autonomous-risk-assurance-956266717219.us-west4.run.app',
  'shelflogic-inventory' : 'https://shelflogic-ai-inventory-optimization-956266717219.us-west4.run.app',
  'supply-chain': 'https://supply-chain-and-logistics-demo-956266717219.us-west4.run.app',
  'ucp': 'https://ucp-business-frontend-956266717219.us-west4.run.app'
};

const auth = new GoogleAuth();
const clientCache = {};

async function getTokenId(targetAudience) {
  try {
    // Cache the client that generates the token for the required target audience
    if (!clientCache[targetAudience]) {
      console.log(`[AUTH] Creando nuevo IdTokenClient para: ${targetAudience}`);
      clientCache[targetAudience] = await auth.getIdTokenClient(targetAudience);
    }

    const client = clientCache[targetAudience];

    const tokenId = await client.idTokenProvider.fetchIdToken(targetAudience);
    
    if (tokenId){
      console.log("tokenId Successfully Generated");
    }
    else {
      console.log("tokenId was not generated");
      return null;
    }    
    return `Bearer ${tokenId}`
  } catch (err) {
    console.error(`TokenID was not generated for ${targetAudience}: `, err.message);
    return null;
  }
}

// --- PROXY Config ---
Object.entries(VERTICALS).forEach(([key, targetUrl]) => {
  const routePath = `/demos/${key}`;

  // 1. Authentication Middleware (executed before the proxy)
  const authMiddleware = async (req, res, next) => {
    try {
      const tokenId = await getTokenId(targetUrl);
      if (tokenId) {
        // Store the authorization in the original request (temporal, in further steps this header is passed to the actual request that will be 
        // sent to the demos)
        req.headers['authorization'] = tokenId;
        console.log("Token stored in req headers");
      }
      next();
    } catch (error) {
      console.error('Auth Middleware Error: ', error);
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

      // IAP and cookies headers confuse CloudRun demos at authentication time, for that reason it is required to be removed
      const headersToRemove = [
        'cookie',
        'referer',
        'origin',
        'sec-ch-ua',
        'sec-ch-ua-mobile',
        'sec-ch-ua-platform',
        'sec-fetch-dest',
        'sec-fetch-mode',
        'sec-fetch-site',
        'sec-fetch-user',
        'upgrade-insecure-requests',
        'user-agent',
        'x-goog-iap-jwt-assertion',
        'x-goog-authenticated-user-email',
        'x-goog-authenticated-user-id',
        'x-serverless-authorization',
        'via',
        'x-forwarded-for',
        'x-cloud-trace-context'
      ];

      headersToRemove.forEach(header => proxyReq.removeHeader(header));
      
      // User-Agent header identifies the client making the request 
      proxyReq.setHeader('User-Agent', 'Demo-Showcase-Proxy/1.0');

      // Add the authorization header in the proxyReq (the request that Will be sent to the demos)
      if (req.headers['authorization']) {
          proxyReq.setHeader('Authorization', req.headers['authorization']);
      }

      console.log("Header in proxyReq: ", proxyReq.getHeader('Authorization') ? "YES" : "NO")

      // Make sure that the path is not empty
      if (!proxyReq.path || proxyReq.path.trim() === '') {
        proxyReq.path = '/';
      }

      // Set the right target host
      const targetHost = new URL(targetUrl).host;
      proxyReq.setHeader('host', targetHost);

      console.log(`Sending request to: https://${targetHost}${proxyReq.path}`);
      console.log(`│ Method:         ${proxyReq.method}`);
      console.log(`│ Host Header:    ${proxyReq.getHeader('host')}`);
      console.log("Path inside the host: ", proxyReq.path); 
    },
    
    onError: (err, req, res) => {
      console.error('Error in the proxy request: ', err);
      res.status(502).send('Gateway Proxy Error');
    },
    
    // Checks the status of the response
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy Response: ${req.method} https://${req.host}${req.path} -> Status: ${proxyRes.statusCode}`);
        
        if (proxyRes.statusCode !== 200) {
            console.error(`Request Failed. Status Code: ${proxyRes.statusCode}: ${proxyRes.headers['www-authenticate']}`);
        }
    }
  });

  // 3. Chain auth & proxy middlewares
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