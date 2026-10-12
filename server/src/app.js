import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import bridalRoutes from './routes/bridal.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';

const app = express();

// ─── Trust Proxy for Vercel/Reverse Proxy Rate Limiting ────────────────────────
app.set('trust proxy', 1);

// ─── Auto DB Connection for Serverless ─────────────────────────────────────────
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // connectDB already logs warning, non-fatal
  }
  next();
});

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin
    if (!origin) return callback(null, true);
    if (process.env.CLIENT_URL === '*' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow Vercel preview and production subdomains
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    // If CLIENT_URL not set or in dev, allow origin
    if (!process.env.CLIENT_URL || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Pre-flight support
app.options('*', cors());

// ─── Rate limiting ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'محاولات كثيرة جداً. يرجى المحاولة بعد 15 دقيقة.' }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500
});

app.use(generalLimiter);

// ─── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── API Router ───────────────────────────────────────────────────────────────
const apiRouter = express.Router();

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'powermax-api', timestamp: new Date().toISOString() });
});

apiRouter.use('/auth', authLimiter, authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/bridal', bridalRoutes);

// Mount router on /api prefix and root to support all Vercel rewrite patterns
app.use('/api', apiRouter);
app.use(apiRouter);

// Root route
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'powermax-api', message: 'PowerMax API is running' });
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `المسار غير موجود: ${req.method} ${req.originalUrl}` });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
