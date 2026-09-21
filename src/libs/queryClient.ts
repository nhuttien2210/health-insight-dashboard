import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
        // The health history is deterministic, so refetching on focus is pure noise.
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  })
}
