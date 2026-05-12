"use client"

import { useState, useEffect } from "react"
import { socket } from "@/lib/socket"

interface UseViewerCountReturn {
  viewerCount: number
}

export function useViewerCount(roomKey: string): UseViewerCountReturn {
  const [viewerCount, setViewerCount] = useState(0)

  useEffect(() => {
    function onViewerCountUpdated(payload: {
      roomKey: string
      count: number
    }) {
      if (payload.roomKey === roomKey) {
        setViewerCount(payload.count)
      }
    }

    socket.on("viewer-count-updated", onViewerCountUpdated)

    return () => {
      socket.off("viewer-count-updated", onViewerCountUpdated)
    }
  }, [roomKey])

  return { viewerCount }
}
