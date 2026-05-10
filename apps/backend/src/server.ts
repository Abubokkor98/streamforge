import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from '@/api.routes';
import { notFoundHandler } from '@/middlewares/not-found';
import { errorHandler } from '@/middlewares/error-handler';
import { StatusCodes } from 'http-status-codes';

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: 'OK', timestamp: new Date() });
});

// Central API router — all module routes register here
app.use('/api', apiRouter);

// Error handling (order matters: 404 first, then global handler)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
