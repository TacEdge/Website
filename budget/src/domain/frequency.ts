import type { Frequency, Period } from './types'

/** Occurrences per year for each recurring frequency. */
export const ANNUAL_MULTIPLIER: Record<Exclude<Frequency, 'one_off'>, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  quarterly: 4,
  annual: 1,
}

/** Periods per year for each reporting period. */
export const PERIOD_DIVISOR: Record<Period, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  annual: 1,
}

export const PERIOD_LABEL: Record<Period, string> = {
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
  annual: 'Annual',
}

export const PERIOD_NOUN: Record<Period, string> = {
  weekly: 'week',
  fortnightly: 'fortnight',
  monthly: 'month',
  annual: 'year',
}

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
  one_off: 'One-off',
}

export const FREQUENCY_SUFFIX: Record<Frequency, string> = {
  weekly: '/ week',
  fortnightly: '/ fortnight',
  monthly: '/ month',
  quarterly: '/ quarter',
  annual: '/ year',
  one_off: 'one-off',
}

/**
 * Annualise a recurring amount. One-off items are not part of the recurring
 * baseline and return 0 here — they are handled by the one-off pathway.
 */
export function annualiseCents(amountCents: number, frequency: Frequency): number {
  if (frequency === 'one_off') return 0
  return amountCents * ANNUAL_MULTIPLIER[frequency]
}

/**
 * Convert an annualised amount into the selected reporting period.
 * Result may carry fractional cents; round only at display.
 */
export function annualToPeriodCents(annualCents: number, period: Period): number {
  return annualCents / PERIOD_DIVISOR[period]
}

/** Recurring amount → amount per selected reporting period (exact cents). */
export function perPeriodCents(
  amountCents: number,
  frequency: Frequency,
  period: Period,
): number {
  return annualToPeriodCents(annualiseCents(amountCents, frequency), period)
}
