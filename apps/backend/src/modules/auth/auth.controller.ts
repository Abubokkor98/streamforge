import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@/utils/api-error';
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenFromCookie } from '@/shared/cookies';
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
    const { refreshToken, ...responseData } = await authService.register({ name, email, password });

    setRefreshTokenCookie(res, refreshToken);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: responseData });
  } catch (error) {
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
    const { refreshToken, ...responseData } = await authService.login(body);

    setRefreshTokenCookie(res, refreshToken);
    res.status(StatusCodes.OK).json({ status: 'success', data: responseData });
  } catch (error) {
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

    const { refreshToken, ...responseData } = await authService.refreshAccessToken(currentToken);

    setRefreshTokenCookie(res, refreshToken);
    res.status(StatusCodes.OK).json({ status: 'success', data: responseData });
  } catch (error) {
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

    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json({ status: 'success', data: { message: 'Logged out successfully' } });
  } catch (error) {
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

    clearRefreshTokenCookie(res);
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

    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
