"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { EditRoomForm } from "@/components/views/dashboard/EditRoomForm"
import { axiosInstance } from "@/lib/api-client"
import type { Room } from "@/lib/types/room"
import type { ApiResponse } from "@/lib/types/api"

const ROOMS_ENDPOINT = "/api/rooms"

function EditRoomLoader() {
  const params = useParams<{ roomKey: string }>()
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    async function loadRoom() {
      try {
        const response = await axiosInstance.get<ApiResponse<Room>>(
          `${ROOMS_ENDPOINT}/${params.roomKey}`,
        )
        if (isMounted.current) {
          setRoom(response.data.data)
        }
      } catch (err) {
        if (isMounted.current) {
          const message =
            err instanceof Error ? err.message : "Failed to load room."
          setError(message)
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }

    loadRoom()

    return () => {
      isMounted.current = false
    }
  }, [params.roomKey])

  if (isLoading) {
    return <div className="animate-pulse py-10 text-center text-muted-foreground">Loading room...</div>
  }

  if (error || !room) {
    return <div className="py-10 text-center text-destructive">{error ?? "Room not found."}</div>
  }

  return <EditRoomForm room={room} />
}

export { EditRoomLoader }
