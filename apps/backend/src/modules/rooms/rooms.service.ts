import { nanoid } from 'nanoid';
import { RoomStatus } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { ApiError } from '@/utils/api-error';
import { toRoomResponse } from '@/helpers/rooms.helpers';
import type {
  RoomResponse,
  CreateRoomInput,
  UpdateRoomInput,
} from '@/modules/rooms/rooms.types';

const ROOM_KEY_LENGTH = 12;

export async function createRoom(hostId: number, input: CreateRoomInput): Promise<RoomResponse> {
  const roomKey = nanoid(ROOM_KEY_LENGTH);

  const room = await prisma.room.create({
    data: {
      host_id: hostId,
      room_key: roomKey,
      title: input.title,
      description: input.description,
    },
  });

  return toRoomResponse(room);
}

export async function getHostRooms(hostId: number): Promise<RoomResponse[]> {
  const rooms = await prisma.room.findMany({
    where: { host_id: hostId },
    orderBy: { created_at: 'desc' },
  });

  return rooms.map(toRoomResponse);
}

export async function findRoomByKey(roomKey: string): Promise<RoomResponse> {
  const room = await prisma.room.findUnique({
    where: { room_key: roomKey },
  });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  return toRoomResponse(room);
}

export async function updateRoom(
  roomKey: string,
  hostId: number,
  input: UpdateRoomInput,
): Promise<RoomResponse> {
  const room = await prisma.room.findUnique({
    where: { room_key: roomKey },
  });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.host_id !== hostId) {
    throw ApiError.forbidden('You do not own this room');
  }

  const updated = await prisma.room.update({
    where: { room_key: roomKey },
    data: {
      title: input.title,
      description: input.description,
      slow_mode_interval: input.slowModeInterval,
      guest_chat_enabled: input.guestChatEnabled,
    },
  });

  return toRoomResponse(updated);
}

export async function deleteRoom(roomKey: string, hostId: number): Promise<void> {
  const room = await prisma.room.findUnique({
    where: { room_key: roomKey },
  });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.host_id !== hostId) {
    throw ApiError.forbidden('You do not own this room');
  }

  if (room.status === RoomStatus.LIVE) {
    throw ApiError.badRequest('Cannot delete a room that is currently live');
  }

  await prisma.room.delete({
    where: { room_key: roomKey },
  });
}
