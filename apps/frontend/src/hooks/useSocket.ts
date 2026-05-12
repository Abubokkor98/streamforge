"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { useAuthStore } from "@/lib/auth-store"

interface UseSocketOptions {
  guestName?: string
}

interface UseSocketReturn {
  isConnected: boolean
  connectionError: string | null
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { guestName } = options
  const accessToken = useAuthStore((state) => state.accessToken)

  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    if (accessToken) {
      socket.auth = { token: accessToken }
    } else if (guestName) {
      socket.auth = { guestName }
    } else {
      return
    }

    socket.connect()

    function onConnect() {
      setIsConnected(true)
      setConnectionError(null)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onConnectError(error: Error) {
      setConnectionError(error.message)
      setIsConnected(false)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", onConnectError)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("connect_error", onConnectError)
      socket.disconnect()
    }
  }, [accessToken, guestName])

  return { isConnected, connectionError }
}
