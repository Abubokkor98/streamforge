import { prisma } from '@/config/prisma';
import { UserRole } from '@prisma/client';
import { ApiError } from '@/utils/api-error';
import { hashPassword, verifyPassword } from '@/utils/password';
import { buildAuthResponse } from '@/modules/auth/auth.helpers';
import type {
  AuthResponse,
  RegisterServiceInput,
  LoginServiceInput,
} from '@/modules/auth/auth.types';

export async function register(input: RegisterServiceInput): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: UserRole.HOST,
    },
  });

  return buildAuthResponse(user);
}

export async function login(input: LoginServiceInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(input.password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  return buildAuthResponse(user);
}
