"use client"

import { io } from "socket.io-client"
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/lib/types/socket-events"
import type { Socket } from "socket.io-client"

const DEFAULT_SOCKET_URL = "http://localhost:5000"
const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_SOCKET_URL

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
    withCredentials: true,
  })
