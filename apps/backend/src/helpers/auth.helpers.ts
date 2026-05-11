import { signToken } from '@/utils/jwt';
import type { AuthResponse, TokenPayload } from '@/modules/auth/auth.types';
import { UserRole } from '@prisma/client';

export function buildAuthResponse(
  user: { id: number; name: string; email: string; role: UserRole },
  refreshToken: string,
): AuthResponse {
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken: signToken(tokenPayload),
    refreshToken,
  };
}
