import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as livekitService from '@/modules/livekit/livekit.service';
import { WebhookReceiver } from 'livekit-server-sdk';
import type { LiveKitTokenSchemaInput } from '@/modules/livekit/livekit.schema';
import * as streamsService from '@/modules/streams/streams.service';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const GRACE_PERIOD_MS = 30 * 1000;
const disconnectionTimeouts = new Map<string, NodeJS.Timeout>();
const receiver = new WebhookReceiver(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET);

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

export async function webhook(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      res.status(StatusCodes.UNAUTHORIZED).send();
      return;
    }

    // Next.js/Express global body parser makes req.body an object. 
    // We capture rawBody in server.ts specifically for signature verification.
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody?.toString('utf8');
    
    if (!rawBody) {
      logger.error('[LiveKit Webhook] Raw body not found');
      res.status(StatusCodes.BAD_REQUEST).send();
      return;
    }

    let event;
    try {
      event = await receiver.receive(rawBody, authHeader);
    } catch (err) {
      logger.error({ err }, '[LiveKit Webhook] Signature validation failed');
      res.status(StatusCodes.UNAUTHORIZED).send();
      return;
    }

    const roomKey = event.room?.name;
    if (!roomKey) {
      res.status(StatusCodes.OK).send();
      return;
    }

    const isHost = event.participant?.identity?.startsWith('host_');

    if (event.event === 'participant_left') {
      if (isHost) {
        logger.info({ roomKey }, '[LiveKit Webhook] Host disconnected. Starting 30s grace period.');
        
        if (disconnectionTimeouts.has(roomKey)) {
          clearTimeout(disconnectionTimeouts.get(roomKey));
        }

        const timeout = setTimeout(async () => {
          logger.info({ roomKey }, '[LiveKit Webhook] Grace period expired. Ending stream.');
          try {
            await streamsService.forceEndStream(roomKey);
          } catch (error) {
            logger.error({ error, roomKey }, '[LiveKit Webhook] Failed to end stream after grace period');
          }
          disconnectionTimeouts.delete(roomKey);
        }, GRACE_PERIOD_MS);

        disconnectionTimeouts.set(roomKey, timeout);
      }
    } else if (event.event === 'participant_joined') {
      if (isHost) {
        if (disconnectionTimeouts.has(roomKey)) {
          logger.info({ roomKey }, '[LiveKit Webhook] Host reconnected. Clearing grace period timeout.');
          clearTimeout(disconnectionTimeouts.get(roomKey));
          disconnectionTimeouts.delete(roomKey);
        }
      }
    }

    res.status(StatusCodes.OK).send();
  } catch (error) {
    logger.error({ error }, '[LiveKit Webhook] Error processing webhook');
    res.status(StatusCodes.OK).send();
  }
}
