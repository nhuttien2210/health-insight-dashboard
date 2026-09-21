import { Activity, HeartPulse, LineChart, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfileStore } from '@/stores/useProfileStore'
import { ProfileForm } from './components/ProfileForm'
import { useSubmitProfile } from './hooks/useSubmitProfile'

const HIGHLIGHTS = [
  {
    icon: LineChart,
    title: 'A dashboard built around your targets',
    description:
      'Steps, sleep, nutrition and recovery, each measured against a target derived from your profile.',
  },
  {
    icon: Activity,
    title: '90 days of history, instantly',
    description:
      'A consistent history is generated from your profile so trends and comparisons are meaningful from day one.',
  },
  {
    icon: Sparkles,
    title: 'An assistant that only uses your data',
    description:
      'Ask questions in plain language. Answers are grounded in the numbers on your dashboard.',
  },
]

export function OnboardingPage() {
  const profile = useProfileStore((state) => state.profile)
  const { submitProfile, isSubmitting } = useSubmitProfile()

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:py-16">
      <section className="flex flex-col justify-center gap-6">
        <div className="space-y-3">
          <span className="text-primary inline-flex items-center gap-2 text-sm font-medium">
            <HeartPulse className="size-4" aria-hidden />
            Health Insight
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {profile ? 'Update your health profile' : 'Tell us about yourself to build your dashboard'}
          </h1>
          <p className="text-muted-foreground max-w-prose">
            Your profile sets the targets everything else is measured against. It stays in your
            browser - nothing is sent to a server.
          </p>
        </div>

        <ul className="grid gap-4">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <item.icon className="size-4.5" aria-hidden />
              </span>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{profile ? 'Edit profile' : 'Your profile'}</CardTitle>
          <CardDescription>Takes about a minute. You can change any of this later.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialProfile={profile}
            isSubmitting={isSubmitting}
            submitLabel={profile ? 'Save changes' : 'Build my dashboard'}
            onSubmit={submitProfile}
          />
        </CardContent>
      </Card>
    </main>
  )
}
