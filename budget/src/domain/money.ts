/**
 * Money helpers. Amounts are stored as integer cents; intermediate
 * calculations may carry fractional cents and are rounded once, here,
 * at the display boundary.
 */

const nzd = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const nzdWhole = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Round fractional cents to whole cents. Ties round away from zero. */
export function roundCents(exactCents: number): number {
  return Math.sign(exactCents) * Math.round(Math.abs(exactCents))
}

/** Format cents (possibly fractional) as NZD: $1,250.00 / -$425.50 */
export function formatCents(exactCents: number): string {
  const cents = roundCents(exactCents)
  return nzd.format(cents / 100)
}

/** Format without decimals for large summary figures: $1,250 / -$426 */
export function formatCentsWhole(exactCents: number): string {
  const cents = roundCents(exactCents)
  return nzdWhole.format(Math.round(cents / 100))
}

/** Signed formatting with an explicit plus for surpluses: +$120.00 */
export function formatCentsSigned(exactCents: number): string {
  const formatted = formatCents(exactCents)
  return exactCents > 0 ? `+${formatted}` : formatted
}

/**
 * Parse a user-entered dollar amount ("1,250.50", "$80") into integer cents.
 * Returns null when the input is not a usable amount.
 */
export function parseDollarsToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, '')
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null
  if (!/^-?\d*(\.\d*)?$/.test(cleaned)) return null
  const value = Number(cleaned)
  if (!Number.isFinite(value)) return null
  return roundCents(value * 100)
}

/** Cents → editable dollars string, e.g. 125000 → "1250.00" */
export function centsToDollarsInput(cents: number): string {
  return (cents / 100).toFixed(2)
}
