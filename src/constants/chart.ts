import type { MetricAccent } from '@/types/metric'

/** One accent per health domain, shared by cards, badges and charts. */
export const ACCENT_COLOR: Record<MetricAccent, string> = {
  activity: 'var(--chart-activity)',
  sleep: 'var(--chart-sleep)',
  nutrition: 'var(--chart-nutrition)',
  weight: 'var(--chart-weight)',
  heart: 'var(--chart-heart)',
}

export function accentSurface(accent: MetricAccent, percent = 14): string {
  return `color-mix(in oklab, ${ACCENT_COLOR[accent]} ${percent}%, transparent)`
}
