import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';

export function signToken(payload: object): string {
  // Cast assumes env.JWT_EXPIRES_IN is a valid jsonwebtoken format (e.g., '7d', 60)
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

/**
 * Verifies a JWT token.
 * @throws {JsonWebTokenError | TokenExpiredError | NotBeforeError} If the token is invalid, expired, or not yet valid.
 */
export function verifyToken(token: string): Record<string, unknown> {
  return jwt.verify(token, env.JWT_SECRET) as Record<string, unknown>;
}
