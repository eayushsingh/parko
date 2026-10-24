import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { db } from './db/index.js';
import healthRouter from './routes/health.js';
import spacesRouter from './routes/spaces.js';
import bookingsRouter from './routes/bookings.js';
import authRouter from './routes/auth.js';
import metricsRouter from './routes/metrics.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Initialize database
db.init();

// Standard middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight timestamped request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Root welcome message on both / and /api
app.get(['/', '/api'], (_req: Request, res: Response) => {
  res.json({
    service: 'Parko Backend API',
    status: 'ONLINE',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      spaces: '/api/spaces',
      bookings: '/api/bookings',
      auth: '/api/auth',
      metrics: '/api/metrics'
    }
  });
});

// Mount modular API routes on both /api/* and /* so it works across direct proxy and serverless rewrites
app.use(['/api/health', '/health'], healthRouter);
app.use(['/api/spaces', '/spaces'], spacesRouter);
app.use(['/api/bookings', '/bookings'], bookingsRouter);
app.use(['/api/auth', '/auth'], authRouter);
app.use(['/api/metrics', '/metrics'], metricsRouter);

// 404 and global error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
