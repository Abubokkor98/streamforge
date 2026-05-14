"use client"

import {
  VideoTrack,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import { BroadcastControls } from "@/components/views/stream/BroadcastControls"
import { StreamStats } from "@/components/views/stream/StreamStats"
import { EndStreamDialog } from "@/components/views/stream/EndStreamDialog"
import { ReconnectionOverlay } from "@/components/views/stream/ReconnectionOverlay"
import { ChatPanel } from "@/components/views/stream/chat/ChatPanel"
import { ReactionOverlay } from "@/components/views/stream/reactions/ReactionOverlay"
import { useViewerCount } from "@/hooks/useViewerCount"
import { useReactions } from "@/hooks/useReactions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@phosphor-icons/react"
import Link from "next/link"
import type { Room } from "@/lib/types/room"

interface HostBroadcastLayoutProps {
  room: Room
  isLive: boolean
  onGoLive: () => Promise<void>
  onEndStream: () => Promise<void>
}

function HostBroadcastLayout({
  room,
  isLive,
  onGoLive,
  onEndStream,
}: HostBroadcastLayoutProps) {
  const { localParticipant } = useLocalParticipant()
  const tracks = useTracks([Track.Source.Camera])
  const { viewerCount } = useViewerCount(room.roomKey)
  const { activeReactions } = useReactions({ roomKey: room.roomKey })

  const localCameraTrack = tracks.find(
    (track) =>
      track.participant.sid === localParticipant.sid &&
      track.source === Track.Source.Camera,
  )

  return (
    <main className="relative flex h-dvh w-full overflow-hidden bg-black text-white">
      {/* Video area */}
      <section className="relative flex flex-1 flex-col">
        <ReconnectionOverlay />
        <ReactionOverlay reactions={activeReactions} />

        {/* Video */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {localCameraTrack ? (
            <VideoTrack
              trackRef={localCameraTrack}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-zinc-900/50">
              <div className="flex size-16 animate-pulse items-center justify-center rounded-full bg-white/5">
                <div className="size-8 rounded-full bg-white/10" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-white/70">
                {isLive ? "Camera Off" : "Standby Mode"}
              </p>
            </div>
          )}
        </div>

        {/* Floating Header */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent px-6 py-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10"
            >
              <Link href="/dashboard" aria-label="Back to dashboard">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div className="space-y-0.5">
              <h1 className="text-base font-bold tracking-tight text-white drop-shadow-md">
                {room.title}
              </h1>
              <div className="flex items-center gap-2">
                <div className="size-1.5 animate-pulse rounded-full bg-primary" />
                <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                  {room.hostName}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StreamStats isLive={isLive} viewerCount={viewerCount} />
          </div>
        </header>

        {/* Floating Footer / Controls */}
        <footer className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-6 bg-linear-to-t from-black/80 via-black/40 to-transparent pb-10 pt-20">
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-2xl">
            <BroadcastControls isLive={isLive} onGoLive={onGoLive} />
            {isLive && (
              <>
                <div className="mx-1 h-8 w-px bg-white/10" />
                <EndStreamDialog onConfirm={onEndStream} />
              </>
            )}
          </div>
        </footer>
      </section>

      {/* Chat Panel — side panel on desktop */}
      <aside className="hidden w-[360px] shrink-0 p-3 pl-0 lg:block">
        <ChatPanel
          roomKey={room.roomKey}
          isHost={true}
          guestChatEnabled={true}
        />
      </aside>
    </main>
  )
}

export { HostBroadcastLayout }
