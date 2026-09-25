import { format, parseISO } from 'date-fns'

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export function formatCompact(value: number): string {
  if (Math.abs(value) < 1000) return formatNumber(value)
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatMinutesAsHours(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes))
  const hours = Math.floor(safe / 60)
  const rest = safe % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

export function formatSignedPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return `${rounded > 0 ? '+' : ''}${rounded}%`
}

export function formatShortDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMM')
}

export function formatWeekday(isoDate: string): string {
  return format(parseISO(isoDate), 'EEE d MMM')
}

export function formatRelativeDay(isoDate: string, todayDate: string): string {
  return isoDate === todayDate ? 'Today' : formatWeekday(isoDate)
}

export function formatClock(totalMinutes: number): string {
  const normalized = Math.round(totalMinutes) % (24 * 60)
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`
}

export function bedtimeToMinutes(bedtime: string): number {
  const [hours, minutes] = bedtime.split(':').map(Number)
  const raw = hours * 60 + minutes
  return raw < 12 * 60 ? raw + 24 * 60 : raw
}
