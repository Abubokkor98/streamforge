import { isAxiosError } from "axios"

export interface ApiErrorResponse {
  status: "error"
  statusCode: number
  message: string
  errors?: { field: string; message: string }[]
}

/**
 * Extracts a descriptive, user-friendly error message from any caught error.
 * Uses a three-tiered approach to handle server responses, network failures, and setup errors.
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred.",
): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    // Tier 1: Server responded with a non-2xx status code
    if (error.response) {
      const serverMessage = error.response.data?.message?.trim()
      return serverMessage ? serverMessage : fallbackMessage
    }
    
    // Tier 2: Request was made but no response was received (e.g. server offline, network timeout)
    if (error.request) {
      return "Network error. Please check your internet connection and try again."
    }
    
    // Tier 3: Something happened when setting up the request
    return error.message ?? fallbackMessage
  }

  // Fallback for standard JavaScript/runtime errors
  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}


