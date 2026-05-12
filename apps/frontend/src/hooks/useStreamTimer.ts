"use client"

import { useState, useRef, useEffect } from "react"

const TIMER_INTERVAL_MS = 1000
const MS_PER_SECOND = 1000

interface StreamTimerReturn {
  elapsedSeconds: number
  formattedTime: string
}

function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, "0")

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${pad(minutes)}:${pad(seconds)}`
}

/**
 * Automatically starts/stops the timer based on the `isRunning` flag.
 * Uses a start timestamp ref to compute elapsed time — avoids
 * calling setState synchronously inside the effect body.
 */
export function useStreamTimer(isRunning: boolean): StreamTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!isRunning) {
      return
    }

    startTimeRef.current = Date.now()

    const intervalId = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTimeRef.current) / MS_PER_SECOND,
      )
      setElapsedSeconds(elapsed)
    }, TIMER_INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
    }
  }, [isRunning])

  return { elapsedSeconds, formattedTime: formatElapsedTime(elapsedSeconds) }
}
