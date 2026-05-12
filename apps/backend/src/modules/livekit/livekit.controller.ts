import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as livekitService from '@/modules/livekit/livekit.service';
import type { LiveKitTokenSchemaInput } from '@/modules/livekit/livekit.schema';

export async function getToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as LiveKitTokenSchemaInput;
    const authenticatedUserId = req.user?.userId;

    const tokenResponse = await livekitService.generateToken(body, authenticatedUserId);

    res.status(StatusCodes.OK).json({ status: 'success', data: tokenResponse });
  } catch (error) {
    next(error);
  }
}
