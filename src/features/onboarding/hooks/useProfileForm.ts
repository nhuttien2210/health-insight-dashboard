import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UserProfile } from '@/apis/health/health.type'
import { profileFormSchema } from '@/apis/profile/profile.schema'
import type { ProfileFormInput, ProfileFormValues } from '@/apis/profile/profile.type'
import { PROFILE_LIMITS } from '@/constants/health'
import { defaultSleepTargetMinutes } from '@/utils/health/metrics'

function toFormInput(profile: UserProfile | null): ProfileFormInput {
  if (!profile) {
    return {
      name: '',
      age: '',
      sex: 'female',
      heightCm: '',
      weightKg: '',
      activityLevel: 'moderate',
      goals: [],
      sleepTargetMinutes: String(defaultSleepTargetMinutes(30)),
    }
  }

  return {
    name: profile.name,
    age: String(profile.age),
    sex: profile.sex,
    heightCm: String(profile.heightCm),
    weightKg: String(profile.weightKg),
    activityLevel: profile.activityLevel,
    goals: profile.goals,
    sleepTargetMinutes: String(profile.sleepTargetMinutes),
  }
}

export function useProfileForm(initialProfile: UserProfile | null) {
  const sleepTouched = useRef(initialProfile !== null)

  const form = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toFormInput(initialProfile),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  /** The age-based sleep target is a starting point, not a decision made for the user. */
  function syncSleepTargetWithAge(rawAge: string) {
    if (sleepTouched.current) return
    const age = Number(rawAge)
    if (!Number.isFinite(age) || age < PROFILE_LIMITS.age.min || age > PROFILE_LIMITS.age.max) return
    form.setValue('sleepTargetMinutes', String(defaultSleepTargetMinutes(age)))
  }

  function markSleepTouched() {
    sleepTouched.current = true
  }

  return { form, syncSleepTargetWithAge, markSleepTouched }
}
