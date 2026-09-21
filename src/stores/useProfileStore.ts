import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { UserProfile } from '@/apis/health/health.type'
import { userProfileSchema } from '@/apis/health/health.schema'
import type { ProfileFormValues } from '@/apis/profile/profile.type'
import { STORAGE_KEYS } from '@/constants/storage'

type ProfileState = {
  profile: UserProfile | null
  completedAt: string | null
  saveProfile: (values: ProfileFormValues) => UserProfile
  resetProfile: () => void
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/** Guards against a stale or hand-edited localStorage payload. */
function parseStoredProfile(value: unknown): UserProfile | null {
  const result = userProfileSchema.safeParse(value)
  return result.success ? result.data : null
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        completedAt: null,

        saveProfile: (values) => {
          const existing = get().profile
          // Keeping the id on edit keeps the generated history stable.
          const profile: UserProfile = {
            ...values,
            goals: [...values.goals],
            id: existing?.id ?? createId(),
            createdAt: existing?.createdAt ?? new Date().toISOString(),
          }
          set({ profile, completedAt: new Date().toISOString() }, false, 'profile/save')
          return profile
        },

        resetProfile: () => set({ profile: null, completedAt: null }, false, 'profile/reset'),
      }),
      {
        name: STORAGE_KEYS.profile,
        version: 1,
        partialize: (state) => ({ profile: state.profile, completedAt: state.completedAt }),
        merge: (persisted, current) => {
          const stored = persisted as { profile?: unknown; completedAt?: string | null } | undefined
          return {
            ...current,
            profile: parseStoredProfile(stored?.profile),
            completedAt: stored?.completedAt ?? null,
          }
        },
        migrate: (persisted, version) => {
          if (version < 1) return { profile: null, completedAt: null }
          return persisted as { profile: UserProfile | null; completedAt: string | null }
        },
      },
    ),
    { name: 'ProfileStore' },
  ),
)

export const selectProfile = (state: ProfileState) => state.profile
export const selectHasProfile = (state: ProfileState) => state.profile !== null
