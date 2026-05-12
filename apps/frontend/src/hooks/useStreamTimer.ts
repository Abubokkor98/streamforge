"use client"

import { useState, useEffect } from "react"

interface StreamTimerReturn {
  elapsedSeconds: number
  formattedTime: string
}

/**
 * A lightweight timer for broadcast sessions.
 * Follows React 19 best practices by adjusting state during render 
 * to avoid cascading effect renders.
 */
export function useStreamTimer(isRunning: boolean): StreamTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [prevIsRunning, setPrevIsRunning] = useState(isRunning)

  // Adjust state during render when isRunning changes.
  // This is the idiomatic way to reset state without an Effect.
  if (isRunning !== prevIsRunning) {
    setPrevIsRunning(isRunning)
    setElapsedSeconds(0)
  }

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  const format = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return { 
    elapsedSeconds, 
    formattedTime: format(elapsedSeconds) 
  }
}
