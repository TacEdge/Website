import {
  startOfWeek,
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  parseISO,
  format,
} from 'date-fns'
import type { Period } from './types'

/**
 * The current reporting window for a period, anchored to `today`.
 * Weekly = the current Monday–Sunday week; fortnightly = that week plus the
 * following one; monthly = the current calendar month; annual = the calendar year.
 */
export function currentWindow(period: Period, today: Date): { start: Date; end: Date } {
  switch (period) {
    case 'weekly': {
      const start = startOfWeek(today, { weekStartsOn: 1 })
      return { start, end: endOfWeek(today, { weekStartsOn: 1 }) }
    }
    case 'fortnightly': {
      const start = startOfWeek(today, { weekStartsOn: 1 })
      return { start, end: addDays(endOfWeek(today, { weekStartsOn: 1 }), 7) }
    }
    case 'monthly':
      return { start: startOfMonth(today), end: endOfMonth(today) }
    case 'annual':
      return { start: startOfYear(today), end: endOfYear(today) }
  }
}

export function isoDateInWindow(
  isoDate: string,
  window: { start: Date; end: Date },
): boolean {
  const date = parseISO(isoDate)
  return isWithinInterval(date, window)
}

/** 2027-09-25 → "25 September 2027" (NZ style). */
export function formatDateLong(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMMM yyyy')
}

/** 2027-09-25 → "25 Sep 2027" */
export function formatDateShort(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMM yyyy')
}

export function daysInMonthOf(date: Date): number {
  return endOfMonth(date).getDate()
}
