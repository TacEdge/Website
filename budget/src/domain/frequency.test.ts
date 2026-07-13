import { describe, expect, it } from 'vitest'
import { annualiseCents, annualToPeriodCents, perPeriodCents } from './frequency'

describe('annualisation', () => {
  it('annualises weekly amounts ×52', () => {
    expect(annualiseCents(35000, 'weekly')).toBe(35000 * 52)
  })
  it('annualises fortnightly amounts ×26', () => {
    expect(annualiseCents(14524, 'fortnightly')).toBe(14524 * 26)
  })
  it('annualises monthly amounts ×12', () => {
    expect(annualiseCents(200000, 'monthly')).toBe(2400000)
  })
  it('annualises quarterly amounts ×4', () => {
    expect(annualiseCents(50000, 'quarterly')).toBe(200000)
  })
  it('keeps annual amounts ×1', () => {
    expect(annualiseCents(120000, 'annual')).toBe(120000)
  })
  it('excludes one-off items from the recurring baseline', () => {
    expect(annualiseCents(99900, 'one_off')).toBe(0)
  })
})

describe('conversion into the selected period', () => {
  it('divides annual by 52 for weekly', () => {
    expect(annualToPeriodCents(5200000, 'weekly')).toBe(100000)
  })
  it('divides annual by 26 for fortnightly', () => {
    expect(annualToPeriodCents(5200000, 'fortnightly')).toBe(200000)
  })
  it('divides annual by 12 for monthly', () => {
    expect(annualToPeriodCents(5200000, 'monthly')).toBeCloseTo(433333.333, 2)
  })
  it('returns annual unchanged for annual', () => {
    expect(annualToPeriodCents(5200000, 'annual')).toBe(5200000)
  })
  it('keeps full precision internally (no premature rounding)', () => {
    // $350/week → annual $18,200 → monthly $1,516.666…
    const monthly = perPeriodCents(35000, 'weekly', 'monthly')
    expect(monthly).toBeCloseTo(151666.6667, 3)
    expect(Number.isInteger(monthly)).toBe(false)
  })
})
