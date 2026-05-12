"use client"

import { Button } from "@/components/ui/button"
import { VideoCamera } from "@phosphor-icons/react"
import { MicToggle } from "@/components/views/stream/MicToggle"
import { CameraToggle } from "@/components/views/stream/CameraToggle"
import { ScreenShareToggle } from "@/components/views/stream/ScreenShareToggle"

interface BroadcastControlsProps {
  isLive: boolean
  onGoLive: () => Promise<void>
}

function BroadcastControls({ isLive, onGoLive }: BroadcastControlsProps) {
  return (
    <nav
      className="flex items-center justify-center gap-3"
      aria-label="Broadcast controls"
    >
      <MicToggle />
      <CameraToggle />
      <ScreenShareToggle />

      {!isLive && (
        <Button
          onClick={onGoLive}
          variant="default"
          size="lg"
          className="ml-2 gap-2 px-8"
        >
          <VideoCamera className="size-5" weight="bold" />
          Go Live
        </Button>
      )}
    </nav>
  )
}

export { BroadcastControls }
