import type { ApiErrorCode } from '@/types/api'

export class AppError extends Error {
  readonly code: ApiErrorCode
  readonly cause?: unknown

  constructor(code: ApiErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.cause = cause
  }
}

const FALLBACK_MESSAGE = 'Something went wrong while loading your data. Please try again.'

/** Every thrown value becomes one predictable shape with user-facing copy. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new AppError('ABORTED', 'Request cancelled.', error)
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('api key') || message.includes('api_key') || message.includes('unauthorized')) {
      return new AppError('MISSING_KEY', 'The AI assistant is not configured correctly.', error)
    }
    if (message.includes('quota') || message.includes('rate limit') || message.includes('429')) {
      return new AppError('RATE_LIMIT', 'The assistant has hit its usage limit. Try again in a moment.', error)
    }
    if (message.includes('fetch') || message.includes('network') || message.includes('failed to fetch')) {
      return new AppError('NETWORK', 'Could not reach the service. Check your connection and try again.', error)
    }

    return new AppError('UNKNOWN', FALLBACK_MESSAGE, error)
  }

  return new AppError('UNKNOWN', FALLBACK_MESSAGE, error)
}

export function isAbortError(error: unknown): boolean {
  return toAppError(error).code === 'ABORTED'
}
