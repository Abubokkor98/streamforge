/**
 * Pure formatting utilities for stream session data.
 */

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === 0) return "—"

  const hours = Math.floor(seconds / SECONDS_PER_HOUR)
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const secs = seconds % SECONDS_PER_MINUTE

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(" ")
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTimeRange(
  startedAt: string,
  endedAt: string | null,
): string {
  const startTime = formatTime(startedAt)

  if (!endedAt) return startTime

  const endTime = formatTime(endedAt)
  return `${startTime} — ${endTime}`
}
