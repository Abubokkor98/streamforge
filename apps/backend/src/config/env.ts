import dotenv from 'dotenv';
import path from 'path';

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
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env: EnvironmentConfig = {
  PORT: (() => {
    const port = parseInt(getRequiredEnv('PORT'), 10);
    if (isNaN(port) || port <= 0) {
      throw new Error(`Invalid PORT value: ${process.env.PORT}`);
    }
    return port;
  })(),
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getRequiredEnv('JWT_EXPIRES_IN'),
};
