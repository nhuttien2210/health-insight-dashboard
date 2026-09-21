import { ArrowRight, Loader2 } from 'lucide-react'
import type { UserProfile } from '@/apis/health/health.type'
import type { ProfileFormValues } from '@/apis/profile/profile.type'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ACTIVITY_LEVEL_LABEL, ACTIVITY_LEVEL_VALUES } from '@/constants/health'
import { formatMinutesAsHours } from '@/utils/format'
import { useProfileForm } from '../hooks/useProfileForm'
import { GoalSelector } from './GoalSelector'

const SLEEP_OPTIONS = Array.from({ length: 9 }, (_, index) => 360 + index * 30)

type ProfileFormProps = {
  initialProfile: UserProfile | null
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: ProfileFormValues) => void
}

export function ProfileForm({
  initialProfile,
  isSubmitting,
  submitLabel,
  onSubmit,
}: ProfileFormProps) {
  const { form, syncSleepTargetWithAge, markSleepTouched } = useProfileForm(initialProfile)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Alex Nguyen" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="32"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      syncSleepTargetWithAge(event.target.value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Used for the calorie formula only.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="heightCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="decimal" placeholder="170" {...field} />
                </FormControl>
                <FormDescription>Centimetres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weightKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="decimal" step="0.1" placeholder="65" {...field} />
                </FormControl>
                <FormDescription>Kilograms</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>How active are you?</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ACTIVITY_LEVEL_VALUES.map((level) => (
                      <SelectItem key={level} value={level}>
                        {ACTIVITY_LEVEL_LABEL[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sleepTargetMinutes"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Nightly sleep target</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    markSleepTouched()
                    field.onChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SLEEP_OPTIONS.map((minutes) => (
                      <SelectItem key={minutes} value={String(minutes)}>
                        {formatMinutesAsHours(minutes)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Suggested from your age. Adjust if you know better.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>What are you working on?</FormLabel>
                <FormControl>
                  <GoalSelector value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription>Pick up to three. Your targets adapt to them.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {submitLabel}
          {isSubmitting ? null : <ArrowRight />}
        </Button>
      </form>
    </Form>
  )
}
