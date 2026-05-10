import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/api-error';
import { verifyToken } from '@/utils/jwt';

const BEARER_PREFIX = 'Bearer ';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    next(ApiError.unauthorized('Missing or malformed authorization header'));
    return;
  }

  const token = authHeader.slice(BEARER_PREFIX.length);

  try {
    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId as number,
      email: decoded.email as string,
      role: decoded.role as string,
    };

    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
