import { AppError } from './error'

const MIN_LATENCY_MS = 280
const MAX_LATENCY_MS = 650

function readFailureRate(): number {
  const parsed = Number.parseFloat(import.meta.env.VITE_MOCK_FAILURE_RATE ?? '')
  if (Number.isNaN(parsed)) return 0
  return Math.min(Math.max(parsed, 0), 1)
}

/**
 * The health history is generated locally, but every read still goes through the
 * async layer so loading and error states are exercised exactly as they would be
 * against a real API.
 */
export function simulateLatency(signal?: AbortSignal): Promise<void> {
  const delay = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS)

  return new Promise((resolve, reject) => {
    function onAbort() {
      clearTimeout(timer)
      reject(new AppError('ABORTED', 'Request cancelled.'))
    }

    if (signal?.aborted) {
      reject(new AppError('ABORTED', 'Request cancelled.'))
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      if (Math.random() < readFailureRate()) {
        reject(new AppError('NETWORK', 'Could not load this section. Please try again.'))
        return
      }
      resolve()
    }, delay)

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}
