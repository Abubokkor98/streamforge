import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: UserRole;
}

// Extend Express Request globally to carry authenticated user data
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
