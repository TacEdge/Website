import type { Loan, Period } from './types'
import { ANNUAL_MULTIPLIER, annualToPeriodCents } from './frequency'
import { daysInMonthOf } from './dates'

/**
 * Estimated interest for a given month:
 *   balance × annual rate ÷ 365 × number of days in the month
 * Returned in exact (possibly fractional) cents.
 */
export function estimatedMonthlyInterestCents(
  balanceCents: number,
  annualRatePercent: number,
  monthOf: Date,
): number {
  return ((balanceCents * annualRatePercent) / 100 / 365) * daysInMonthOf(monthOf)
}

/**
 * Whether this loan's cost is an estimate (interest-only with no actual
 * repayment override) rather than a confirmed bank repayment.
 */
export function loanCostIsEstimated(loan: Loan): boolean {
  return loan.useEstimatedInterest || loan.scheduledRepaymentCents == null
}

/**
 * The annualised cash cost of a loan, in exact cents.
 * - With an actual scheduled repayment: repayment × repayment frequency.
 * - Otherwise (estimate): balance × annual rate (a 365-day year of daily interest).
 */
export function loanAnnualCostCents(loan: Loan): number {
  if (!loanCostIsEstimated(loan) && loan.scheduledRepaymentCents != null) {
    return loan.scheduledRepaymentCents * ANNUAL_MULTIPLIER[loan.repaymentFrequency]
  }
  return (loan.currentBalanceCents * loan.annualInterestRate) / 100
}

/** Loan cost expressed in the selected reporting period (exact cents). */
export function loanPerPeriodCents(loan: Loan, period: Period): number {
  return annualToPeriodCents(loanAnnualCostCents(loan), period)
}
