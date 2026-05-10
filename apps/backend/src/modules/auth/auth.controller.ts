import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as authService from '@/modules/auth/auth.service';
import type { RegisterInput, LoginInput } from '@/modules/auth/auth.schema';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, password } = req.body as RegisterInput;
    const result = await authService.register({ name, email, password });

    res.status(StatusCodes.CREATED).json({ status: 'success', data: result });
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
    const result = await authService.login(body);

    res.status(StatusCodes.OK).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
