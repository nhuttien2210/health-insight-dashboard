import type { z } from 'zod'
import type { profileFormSchema } from './profile.schema'

/** What the form holds while typing. */
export type ProfileFormInput = z.input<typeof profileFormSchema>

/** What the form produces once validated. */
export type ProfileFormValues = z.output<typeof profileFormSchema>
