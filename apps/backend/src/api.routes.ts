import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import roomsRoutes from '@/modules/rooms/rooms.routes';

const apiRouter = Router();

const API_ROUTE_PATHS = {
  auth: '/auth',
  rooms: '/rooms',
} as const;

apiRouter.use(API_ROUTE_PATHS.auth, authRoutes);
apiRouter.use(API_ROUTE_PATHS.rooms, roomsRoutes);

export default apiRouter;
