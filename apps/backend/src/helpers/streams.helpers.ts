import type { StreamSession } from '@prisma/client';
import type { StreamSessionResponse } from '@/modules/streams/streams.types';

export function toStreamSessionResponse(session: StreamSession): StreamSessionResponse {
  return {
    id: session.id,
    roomId: session.room_id,
    startedAt: session.started_at,
    endedAt: session.ended_at,
    durationSeconds: session.duration_seconds,
    peakViewerCount: session.peak_viewer_count,
    totalChatMessages: session.total_chat_messages,
  };
}
