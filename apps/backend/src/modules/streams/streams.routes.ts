import { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { roomKeyParam } from '@/modules/streams/streams.schema';
import * as streamsController from '@/modules/streams/streams.controller';

const router = Router();

const STREAMS_ROUTE_PATHS = {
  start: '/:roomKey/start',
  end: '/:roomKey/end',
} as const;

router.post(
  STREAMS_ROUTE_PATHS.start,
  authenticate,
  validate(roomKeyParam, 'params'),
  streamsController.startStream,
);

router.post(
  STREAMS_ROUTE_PATHS.end,
  authenticate,
  validate(roomKeyParam, 'params'),
  streamsController.endStream,
);

export default router;
