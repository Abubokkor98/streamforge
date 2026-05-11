import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
const REFRESH_ENDPOINT = "/api/auth/refresh"

interface ApiErrorResponse {
  message: string
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

/**
 * Mutex for token refresh — prevents the double-refresh race condition.
 *
 * When multiple requests get a 401 simultaneously, only ONE refresh
 * fires. All others wait for it to complete, then retry with the
 * new access token.
 */
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
      method: "POST",
      credentials: "include",
    })

    if (!response.ok) {
      clearAccessToken()
      return false
    }

    const data = (await response.json()) as { accessToken: string }
    setAccessToken(data.accessToken)
    return true
  } catch {
    clearAccessToken()
    return false
  }
}

async function handleTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false
    refreshPromise = null
  })

  return refreshPromise
}

/**
 * Core API client with automatic token refresh.
 *
 * - Attaches access token to Authorization header
 * - Sends credentials (refresh token cookie) with every request
 * - On 401: refreshes token once, then retries the original request
 * - On refresh failure: clears token and redirects to /login
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers: customHeaders, ...restOptions } = options

  const buildHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((customHeaders as Record<string, string>) ?? {}),
    }

    const token = getAccessToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers
  }

  const makeRequest = async (): Promise<Response> => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...restOptions,
      headers: buildHeaders(),
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  let response = await makeRequest()

  // If 401 and we have a token, attempt a single refresh + retry
  if (response.status === 401 && getAccessToken()) {
    const refreshed = await handleTokenRefresh()

    if (refreshed) {
      response = await makeRequest()
    } else {
      clearAccessToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return Promise.reject(new Error("Session expired. Please login again.")) as Promise<T>
    }
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }))) as ApiErrorResponse

    throw new Error(errorData.message)
  }

  return response.json() as Promise<T>
}
