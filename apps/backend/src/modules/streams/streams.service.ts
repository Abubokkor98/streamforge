import { RoomStatus } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { ApiError } from '@/utils/api-error';
import { toStreamSessionResponse } from '@/helpers/streams.helpers';
import type { StreamSessionResponse } from '@/modules/streams/streams.types';

const MS_PER_SECOND = 1000;

async function getOwnedRoomOrThrow(roomKey: string, hostId: number) {
  const room = await prisma.room.findUnique({ where: { room_key: roomKey } });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.host_id !== hostId) {
    throw ApiError.forbidden('You do not own this room');
  }

  return room;
}

export async function startStream(
  roomKey: string,
  hostId: number,
): Promise<StreamSessionResponse> {
  const room = await getOwnedRoomOrThrow(roomKey, hostId);

  if (room.status === RoomStatus.LIVE) {
    throw ApiError.badRequest('Room is already live');
  }

  const [session] = await prisma.$transaction([
    prisma.streamSession.create({
      data: { room_id: room.id },
    }),
    prisma.room.update({
      where: { room_key: roomKey },
      data: { status: RoomStatus.LIVE },
    }),
  ]);

  return toStreamSessionResponse(session);
}

export async function endStream(
  roomKey: string,
  hostId: number,
): Promise<StreamSessionResponse> {
  const room = await getOwnedRoomOrThrow(roomKey, hostId);

  if (room.status !== RoomStatus.LIVE) {
    throw ApiError.badRequest('Room is not currently live');
  }

  const activeSession = await prisma.streamSession.findFirst({
    where: {
      room_id: room.id,
      ended_at: null,
    },
    orderBy: { started_at: 'desc' },
  });

  if (!activeSession) {
    throw ApiError.notFound('No active stream session found');
  }

  const now = new Date();
  const durationMs = now.getTime() - activeSession.started_at.getTime();
  const durationSeconds = Math.floor(durationMs / MS_PER_SECOND);

  const [updatedSession] = await prisma.$transaction([
    prisma.streamSession.update({
      where: { id: activeSession.id },
      data: {
        ended_at: now,
        duration_seconds: durationSeconds,
      },
    }),
    prisma.room.update({
      where: { room_key: roomKey },
      data: { status: RoomStatus.ENDED },
    }),
  ]);

  return toStreamSessionResponse(updatedSession);
}
