import { Router } from 'express';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/auth';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from '@/modules/auth/auth.schema';
import * as authController from '@/modules/auth/auth.controller';

const router = Router();

const AUTH_ROUTE_PATHS = {
  register: '/register',
  login: '/login',
  refresh: '/refresh',
  logout: '/logout',
  logoutAll: '/logout-all',
  forgotPassword: '/forgot-password',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',
} as const;

router.post(AUTH_ROUTE_PATHS.register, validate(registerSchema), authController.register);
router.post(AUTH_ROUTE_PATHS.login, validate(loginSchema), authController.login);
router.post(AUTH_ROUTE_PATHS.refresh, authController.refresh);
router.post(AUTH_ROUTE_PATHS.logout, authController.logout);
router.post(AUTH_ROUTE_PATHS.logoutAll, authenticate, authController.logoutAllDevices);
router.post(AUTH_ROUTE_PATHS.forgotPassword, validate(forgotPasswordSchema), authController.forgotPassword);
router.post(AUTH_ROUTE_PATHS.verifyOtp, validate(verifyOtpSchema), authController.verifyOtp);
router.post(AUTH_ROUTE_PATHS.resetPassword, validate(resetPasswordSchema), authController.resetPassword);

export default router;
