import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';

export function signToken(payload: object): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): Record<string, unknown> {
  return jwt.verify(token, env.JWT_SECRET) as Record<string, unknown>;
}
