import { signToken } from '@/utils/jwt';
import type { AuthResponse, TokenPayload } from '@/modules/auth/auth.types';

export function buildAuthResponse(
  user: { id: number; name: string; email: string; role: string },
): AuthResponse {
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as AuthResponse['user']['role'],
  };

  return {
    user: { id: user.id, name: user.name, email: user.email, role: tokenPayload.role },
    token: signToken(tokenPayload),
  };
}
