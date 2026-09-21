/** Versioned so a shape change can be migrated instead of crashing on stale data. */
export const STORAGE_KEYS = {
  profile: 'hid.profile.v1',
  theme: 'hid.theme.v1',
} as const
