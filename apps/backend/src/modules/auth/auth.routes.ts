import { Router } from 'express';
import { validate } from '@/middlewares/validate';
import { registerSchema, loginSchema } from '@/modules/auth/auth.schema';
import * as authController from '@/modules/auth/auth.controller';

const router = Router();

const AUTH_ROUTE_PATHS = {
  register: '/register',
  login: '/login',
} as const;

router.post(AUTH_ROUTE_PATHS.register, validate(registerSchema), authController.register);
router.post(AUTH_ROUTE_PATHS.login, validate(loginSchema), authController.login);

export default router;
