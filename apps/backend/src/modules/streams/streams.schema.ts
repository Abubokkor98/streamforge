import { z } from 'zod';

export const roomKeyParam = z.object({
  roomKey: z.string().min(1, { error: 'Room key is required' }),
});

export type StreamRoomKeyParam = z.infer<typeof roomKeyParam>;
