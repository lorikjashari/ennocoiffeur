import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF'
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(time: string): string {
  return time.substring(0, 5)
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60)
  const newMinutes = totalMinutes % 60
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}
