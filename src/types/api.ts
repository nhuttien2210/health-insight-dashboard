export type ApiErrorCode =
  | 'NETWORK'
  | 'RATE_LIMIT'
  | 'INVALID_RESPONSE'
  | 'MISSING_KEY'
  | 'EMPTY'
  | 'ABORTED'
  | 'UNKNOWN'

/** Shape every hook exposes to the UI, regardless of which service produced it. */
export type QueryState<TData> = {
  data: TData | undefined
  isPending: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

export type Paginated<TItem> = {
  items: TItem[]
  page: number
  pageSize: number
  total: number
  hasNextPage: boolean
}
