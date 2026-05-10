import { UserRole } from '@prisma/client';

export interface TokenPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

export interface RegisterServiceInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginServiceInput {
  email: string;
  password: string;
}
