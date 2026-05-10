import dotenv from 'dotenv';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@/utils/api-error';

// Load .env from the backend root (apps/backend/.env)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvironmentConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Missing required environment variable: ${key}`);
  }

  return value;
}

export const env: EnvironmentConfig = {
  PORT: parseInt(getRequiredEnv('PORT'), 10),
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getRequiredEnv('JWT_EXPIRES_IN'),
};
