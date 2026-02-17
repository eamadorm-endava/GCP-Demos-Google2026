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
  'agentic-governance': 'https://test-agentic-vendor-governance-platform-956266717219.us-west4.run.app',
};


function inspectToken(authHeader) {
  try {
    if (!authHeader) return { error: 'No header' };
    
    const token = authHeader.replace('Bearer ', '');
    const parts = token.split('.');
    
    if (parts.length < 2) return { error: 'Token mal formado' };

    const payloadPart = parts[1];
    // Decodificamos el Base64Url
    const decoded = JSON.parse(Buffer.from(payloadPart, 'base64').toString());
    
    return {
      audience: decoded.aud,      // El destino (URL del microservicio)
      issuer: decoded.email,      // LA CUENTA DE SERVICIO (El origen)
      expiration: new Date(decoded.exp * 1000).toISOString() // Cuándo caduca
    }; 
  } catch (e) {
    return { error: 'Error al decodificar: ' + e.message };
  }
}

const auth = new GoogleAuth();
const clientCache = {};

async function getTokenId(targetAudience) {
  try {
    // 1. Reutilizamos el cliente si ya existe para esa audiencia
    if (!clientCache[targetAudience]) {
      console.log(`[AUTH] Creando nuevo IdTokenClient para: ${targetAudience}`);
      clientCache[targetAudience] = await auth.getIdTokenClient(targetAudience);
    }

    const client = clientCache[targetAudience];

    const tokenId = await client.fetchIdToken(targetAudience);
    
    if (tokenId){
      console.log("tokenId Generated = ", tokenId); 
    }
    else {
      console.log("tokenId was not generated");
      return null;
    }    
    return `Bearer ${tokenId}`
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
      const tokenId = await getTokenId(targetUrl);
      if (tokenId) {
        req.headers['Authorization'] = tokenId;
        console.log("Token stored in req headers");
        console.log("req.headers[Authorization] = ", req.headers['Authorization']);
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

      // FIX: Aseguramos que el header se pase al proxyReq desde el req modificado anteriormente
      if (req.headers['Authorization']) {
          proxyReq.setHeader('Authorization', req.headers['Authorization']);
      }

      console.log("Checking if auth header is already on proxyReq")
      console.log("proxyReq.getHeader('Authorization') = ", proxyReq.getHeader('Authorization'))
      const info = inspectToken(proxyReq.getHeader('Authorization')); // Leemos del proxyReq ya seteado
      console.log(`│ 👤 QUIÉN FIRMA (SA): ${info.issuer}`); 
      console.log(`│ 🎯 PARA QUIÉN (AUD): ${info.audience}`);
      console.log(`│ ⏳ EXPIRA:           ${info.expiration}`);
    

      if (!proxyReq.path || proxyReq.path.trim() === '') {
        proxyReq.path = '/';
      }

      // Set the right target host
      const targetHost = new URL(targetUrl).host;
      proxyReq.setHeader('host', targetHost);

      console.log(`[PROXY SEND] Destiny: https://${targetHost}${proxyReq.path}`);
      console.log(`│ 📝 Method:         ${proxyReq.method}`);
      console.log(`│ 🏠 Host Header:    ${proxyReq.getHeader('host')}`); // <--- CRÍTICO: Esto es lo que valida Google
      const auth = proxyReq.getHeader('Authorization');
      if (auth) {
        // Mostramos solo los últimos 6 caracteres para verificar que no esté vacío/null
        console.log(`│ 🔐 TOKEN:          ✅ PRESENTE (...${auth.slice(-6)})`);
      } else {
        console.log(`│ 🔐 TOKEN:          ❌ AUSENTE (Esto fallará)`);
      }
      console.log('└──────────────────────────────────────────────────┘');
      console.log("Final ProxyReq path: ", proxyReq.path);
      
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
        if (proxyRes.statusCode >= 400) {
        console.error(`[CLOUD RUN ERROR] Motivo del ${proxyRes.statusCode}: ${proxyRes.headers['www-authenticate']}`);
        console.error("ProxyRes.headers = ", proxyRes.headers)
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