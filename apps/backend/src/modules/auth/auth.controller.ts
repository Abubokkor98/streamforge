import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@/utils/api-error';
import { setAuthCookies, clearAuthCookies, getRefreshTokenFromCookie } from '@/shared/cookies';
import * as authService from '@/modules/auth/auth.service';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
} from '@/modules/auth/auth.schema';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, password } = req.body as RegisterInput;
    console.log(`[Auth] Registering user: ${email}`);
    const { refreshToken, accessToken, ...userData } = await authService.register({ name, email, password });

    console.log(`[Auth] User registered successfully. Setting cookies.`);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: { user: userData.user, accessToken } });
  } catch (error) {
    console.error(`[Auth] Registration error:`, error);
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.body as LoginInput;
    console.log(`[Auth] Logging in user: ${body.email}`);
    const { refreshToken, accessToken, ...userData } = await authService.login(body);

    console.log(`[Auth] User logged in successfully. Setting cookies.`);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(StatusCodes.OK).json({ status: 'success', data: { user: userData.user, accessToken } });
  } catch (error) {
    console.error(`[Auth] Login error:`, error);
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const currentToken = getRefreshTokenFromCookie(req.cookies);

    if (!currentToken) {
      throw ApiError.unauthorized('No refresh token provided');
    }

    const { refreshToken, accessToken, ...userData } = await authService.refreshAccessToken(currentToken);

    setAuthCookies(res, accessToken, refreshToken);
    res.status(StatusCodes.OK).json({ status: 'success', data: { user: userData.user, accessToken } });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const currentToken = getRefreshTokenFromCookie(req.cookies);

    if (currentToken) {
      await authService.logout(currentToken);
    }

    clearAuthCookies(res);
    res.status(StatusCodes.OK).json({ status: 'success', data: { message: 'Logged out successfully' } });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
}

export async function logoutAllDevices(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const result = await authService.logoutAllDevices(req.user.userId);

    clearAuthCookies(res);
    res.status(StatusCodes.OK).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.body as ForgotPasswordInput;
    const result = await authService.forgotPassword(body);

    res.status(StatusCodes.OK).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.body as VerifyOtpInput;
    const result = await authService.verifyOtp(body);

    res.status(StatusCodes.OK).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { resetToken, newPassword } = req.body as ResetPasswordInput;
    const result = await authService.resetPassword({ resetToken, newPassword });

    clearAuthCookies(res);
    res.status(StatusCodes.OK).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
