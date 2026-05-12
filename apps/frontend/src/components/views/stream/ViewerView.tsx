"use client"

import { useState } from "react"
import { LiveKitRoom } from "@livekit/components-react"
import "@livekit/components-styles"
import { useRoom } from "@/hooks/useRoom"
import { useLivekitToken } from "@/hooks/useLivekitToken"
import { useIsAuthenticated } from "@/lib/auth-store"
import { ViewerStreamLayout } from "@/components/views/stream/ViewerStreamLayout"
import { GuestNamePrompt } from "@/components/views/stream/GuestNamePrompt"
import { WaitingForHost } from "@/components/views/stream/WaitingForHost"
import { HostViewSkeleton } from "@/components/views/stream/HostViewSkeleton"
import { HostViewError } from "@/components/views/stream/HostViewError"
import { StreamEndedOverlay } from "@/components/views/stream/StreamEndedOverlay"

interface ViewerViewProps {
  roomKey: string
}

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? ""

function ViewerView({ roomKey }: ViewerViewProps) {
  const isAuthenticated = useIsAuthenticated()
  const [guestName, setGuestName] = useState<string | null>(null)

  const { room, isLoading: isRoomLoading, error: roomError } = useRoom(roomKey, 15000)

  // Token is fetched only when the viewer is ready (authenticated OR guest name provided)
  const isReadyToConnect = isAuthenticated || guestName !== null
  const { tokenData, isLoading: isTokenLoading, error: tokenError } =
    useLivekitToken({
      roomKey,
      isHost: false,
      guestName: guestName ?? undefined,
      enabled: isReadyToConnect && room?.status === "LIVE",
    })

  if (isRoomLoading) {
    return <HostViewSkeleton />
  }

  if (roomError) {
    return <HostViewError message={roomError.message} />
  }

  if (!room) {
    return <HostViewError message="Room not found" />
  }

  if (room.status !== "LIVE") {
    return room.status === "ENDED"
      ? <StreamEndedOverlay roomTitle={room.title} />
      : <WaitingForHost roomTitle={room.title} hostName={room.hostName} />
  }

  // Guest flow: prompt for display name before connecting
  if (!isAuthenticated && guestName === null) {
    return <GuestNamePrompt roomTitle={room.title} onSubmit={setGuestName} />
  }

  if (isTokenLoading) {
    return <HostViewSkeleton />
  }

  if (tokenError) {
    return <HostViewError message={tokenError.message} />
  }

  if (!tokenData) {
    return <HostViewError message="Failed to join stream" />
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={tokenData.token}
      connect={true}
      video={false}
      audio={false}
    >
      <ViewerStreamLayout room={room} />
    </LiveKitRoom>
  )
}

export { ViewerView }
