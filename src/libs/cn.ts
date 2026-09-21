import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** clsx + tailwind-merge, so later Tailwind classes win over earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
