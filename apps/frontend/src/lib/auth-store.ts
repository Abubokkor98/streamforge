/**
 * In-memory access token storage.
 *
 * Access tokens are NEVER stored in localStorage or cookies — they live
 * only in module-level memory. This prevents XSS-based token theft.
 * The refresh token (HttpOnly cookie) handles persistence across reloads.
 */

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string): void {
  accessToken = token
}

export function clearAccessToken(): void {
  accessToken = null
}
