import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { uploadsDir } from './config/db.js';
import { initAdminAuth } from './middleware/auth.js';
import apiRouter from './routes/api.js';
import adminRouter from './routes/admin.js';
import { redirectAppClick } from './controllers/analyticsController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize admin account (default: admin / admin123 or from env)
initAdminAuth();

// CORS configuration - support both development and production origins
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Visitor tracking cookie middleware
app.use((req, res, next) => {
  if (!req.cookies.site_visitor) {
    const visitorId = randomUUID();
    res.cookie('site_visitor', visitorId, {
      maxAge: 90 * 24 * 3600 * 1000,
      httpOnly: false,
      sameSite: 'lax',
      path: '/'
    });
    req.cookies.site_visitor = visitorId;
  }
  if (!req.cookies.site_session) {
    const sessionId = randomUUID();
    res.cookie('site_session', sessionId, {
      maxAge: 30 * 60 * 1000, // 30 mins
      httpOnly: false,
      sameSite: 'lax',
      path: '/'
    });
    req.cookies.site_session = sessionId;
  }
  next();
});

// Static files
app.use('/uploads', express.static(uploadsDir));
const assetsDir = resolve(__dirname, 'assets');
app.use('/assets', express.static(assetsDir));

// Clean direct redirect endpoint
app.get('/go/:appId', redirectAppClick);

// API Routes
app.use('/api', apiRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve built frontend if available
import { existsSync } from 'node:fs';
const frontendDist = resolve(__dirname, '..', 'frontend', 'dist');
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/assets') || req.path.startsWith('/go')) {
      return next();
    }
    res.sendFile(resolve(frontendDist, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AllRummyApps Backend Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Admin API: http://localhost:${PORT}/api/admin`);
});
