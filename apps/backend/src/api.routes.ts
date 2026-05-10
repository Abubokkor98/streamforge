import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';

const apiRouter = Router();

const AUTH_BASE_PATH = '/auth';
apiRouter.use(AUTH_BASE_PATH, authRoutes);

export default apiRouter;
