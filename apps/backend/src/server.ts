import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import apiRouter from '@/api.routes';
import { notFoundHandler } from '@/middlewares/not-found';
import { errorHandler } from '@/middlewares/error-handler';
import { globalLimiter } from '@/middlewares/rate-limiter';
import { StatusCodes } from 'http-status-codes';

const app = express();

const SERVER_ROUTE_PATHS = {
  health: '/health',
  api: '/api',
} as const;
const STATUS_OK = 'OK';

// Global middlewares
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

// Health check
app.get(SERVER_ROUTE_PATHS.health, (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: STATUS_OK, timestamp: new Date() });
});

// Central API router — all module routes register here
app.use(SERVER_ROUTE_PATHS.api, apiRouter);

// Error handling (order matters: 404 first, then global handler)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
