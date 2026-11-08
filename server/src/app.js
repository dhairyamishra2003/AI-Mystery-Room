import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import caseRoutes from './routes/caseRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();
app.use(helmet());

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');

    if (
      configuredOrigins.includes('*') ||
      process.env.NODE_ENV !== 'production' ||
      configuredOrigins.includes(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    if (/^https:\/\/[a-zA-Z0-9_.-]+\.vercel\.app$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    if (/^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json({ limit: '250kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'AI Mystery Room API is running.' }));
app.use('/api/cases', caseRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.', errorCode: 'NOT_FOUND' }));
app.use(errorHandler);

export default app;
