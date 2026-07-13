import { describe, expect, it } from 'vitest'
import {
  formatCents,
  formatCentsSigned,
  parseDollarsToCents,
  roundCents,
} from './money'

describe('currency rounding', () => {
  it('rounds fractional cents only at display', () => {
    expect(roundCents(151666.6667)).toBe(151667)
    expect(roundCents(151666.4)).toBe(151666)
  })
  it('rounds negative halves away from zero', () => {
    expect(roundCents(-50.5)).toBe(-51)
  })
})

describe('NZD formatting', () => {
  it('formats positive amounts as $1,250.00', () => {
    expect(formatCents(125000)).toBe('$1,250.00')
  })
  it('formats negative amounts as -$425.50', () => {
    expect(formatCents(-42550)).toBe('-$425.50')
  })
  it('marks surpluses with an explicit plus sign', () => {
    expect(formatCentsSigned(12000)).toBe('+$120.00')
    expect(formatCentsSigned(-12000)).toBe('-$120.00')
  })
})

describe('input parsing', () => {
  it('parses plain and formatted dollar inputs', () => {
    expect(parseDollarsToCents('350')).toBe(35000)
    expect(parseDollarsToCents('$1,250.00')).toBe(125000)
    expect(parseDollarsToCents('145.24')).toBe(14524)
  })
  it('rejects unusable input', () => {
    expect(parseDollarsToCents('')).toBeNull()
    expect(parseDollarsToCents('abc')).toBeNull()
    expect(parseDollarsToCents('1.2.3')).toBeNull()
  })
})
