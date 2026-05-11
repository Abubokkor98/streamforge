import rateLimit from 'express-rate-limit';

const GLOBAL_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const GLOBAL_MAX_REQUESTS = 100;

const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const AUTH_MAX_REQUESTS = 10;

const RATE_LIMIT_MESSAGE = 'Too many requests, please try again later.';

export const globalLimiter = rateLimit({
  windowMs: GLOBAL_WINDOW_MS,
  max: GLOBAL_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: RATE_LIMIT_MESSAGE },
});

// Stricter limiter for auth endpoints (login, register, OTP, password reset)
export const authLimiter = rateLimit({
  windowMs: AUTH_WINDOW_MS,
  max: AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: RATE_LIMIT_MESSAGE },
});
