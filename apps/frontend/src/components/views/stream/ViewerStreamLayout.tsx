"use client"

import {
  VideoTrack,
  AudioTrack,
  useTracks,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import { StreamStats } from "@/components/views/stream/StreamStats"
import { ReconnectionOverlay } from "@/components/views/stream/ReconnectionOverlay"
import { ChatPanel } from "@/components/views/stream/chat/ChatPanel"
import { ReactionBar } from "@/components/views/stream/reactions/ReactionBar"
import { ReactionOverlay } from "@/components/views/stream/reactions/ReactionOverlay"
import { useViewerCount } from "@/hooks/useViewerCount"
import { useReactions } from "@/hooks/useReactions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@phosphor-icons/react"
import Link from "next/link"
import type { Room } from "@/lib/types/room"

interface ViewerStreamLayoutProps {
  room: Room
  guestChatEnabled: boolean
}

function ViewerStreamLayout({ room, guestChatEnabled }: ViewerStreamLayoutProps) {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone])
  const { viewerCount } = useViewerCount(room.roomKey)
  const { activeReactions, sendReaction, isCooldown } = useReactions({
    roomKey: room.roomKey,
  })

  const hostVideoTrack = tracks.find(
    (track) => track.source === Track.Source.Camera,
  )

  const hostAudioTrack = tracks.find(
    (track) => track.source === Track.Source.Microphone,
  )

  return (
    <main className="relative flex h-dvh w-full overflow-hidden bg-black text-white">
      {/* Video area */}
      <section className="relative flex flex-1 flex-col">
        <ReconnectionOverlay />
        <ReactionOverlay reactions={activeReactions} />

        {/* Stream Video */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {hostVideoTrack ? (
            <VideoTrack
              trackRef={hostVideoTrack}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-zinc-900/50">
              <div className="flex size-16 animate-pulse items-center justify-center rounded-full bg-white/5">
                <div className="size-8 rounded-full bg-white/10" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-white/40">
                Waiting for host…
              </p>
            </div>
          )}
          {hostAudioTrack && <AudioTrack trackRef={hostAudioTrack} />}
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
              <Link href="/" aria-label="Leave stream">
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
            <StreamStats isLive={true} viewerCount={viewerCount} />
          </div>
        </header>

        {/* Floating Footer — Reactions */}
        <footer className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-6 bg-linear-to-t from-black/80 via-black/40 to-transparent pb-10 pt-20">
          <ReactionBar onReaction={sendReaction} disabled={isCooldown} />
        </footer>
      </section>

      {/* Chat Panel — side panel on desktop */}
      <aside className="hidden w-[360px] shrink-0 p-3 pl-0 lg:block">
        <ChatPanel
          roomKey={room.roomKey}
          isHost={false}
          guestChatEnabled={guestChatEnabled}
        />
      </aside>
    </main>
  )
}

export { ViewerStreamLayout }
