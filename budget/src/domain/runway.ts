import type { BudgetItem, Category, Loan, Transfer } from './types'
import { annualiseCents } from './frequency'
import { loanAnnualCostCents } from './loans'
import { isBaselineItem } from './totals'

export interface RunwaySummary {
  /** Recurring operating revenue per month (excludes financing categories). */
  monthlyOperatingIncomeCents: number
  /** Recurring operating expenses per month. */
  monthlyOperatingExpenseCents: number
  /** Income − expenses per month. Negative = burning cash. */
  monthlyOperatingNetCents: number
  /** Recurring financing inflows per month (founder/investment funding). */
  monthlyFinancingInCents: number
  cashBalanceCents: number | null
  /** Months of runway, or null when it cannot be calculated reliably. */
  runwayMonths: number | null
}

/**
 * Operating cashflow and runway for a business budget.
 *
 * Runway = cash balance ÷ average monthly net cash burn, and is only
 * defined when monthly operating expenses exceed monthly operating income
 * and a cash balance has been entered. Financing inflows (categories marked
 * `isFinancing`, e.g. founder contributions or investment) and inbound
 * transfers are not operating revenue and do not reduce burn.
 */
export function runwaySummary(
  budgetId: string,
  items: BudgetItem[],
  categories: Category[],
  transfers: Transfer[],
  loans: Loan[],
  cashBalanceCents: number | null,
): RunwaySummary {
  const financingCategoryIds = new Set(
    categories.filter((c) => c.budgetId === budgetId && c.isFinancing).map((c) => c.id),
  )
  let annualOperatingIncome = 0
  let annualFinancingIn = 0
  let annualOperatingExpense = 0
  for (const item of items) {
    if (item.budgetId !== budgetId || !isBaselineItem(item)) continue
    const annual = annualiseCents(item.amountCents, item.frequency)
    if (item.itemType === 'income') {
      if (item.categoryId && financingCategoryIds.has(item.categoryId)) {
        annualFinancingIn += annual
      } else {
        annualOperatingIncome += annual
      }
    } else {
      annualOperatingExpense += annual
    }
  }
  for (const loan of loans) {
    if (loan.budgetId === budgetId && loan.active) {
      annualOperatingExpense += loanAnnualCostCents(loan)
    }
  }
  for (const transfer of transfers) {
    if (!transfer.active || transfer.frequency === 'one_off') continue
    if (transfer.destinationBudgetId === budgetId) {
      annualFinancingIn += annualiseCents(transfer.amountCents, transfer.frequency)
    }
  }

  const monthlyOperatingIncomeCents = annualOperatingIncome / 12
  const monthlyOperatingExpenseCents = annualOperatingExpense / 12
  const monthlyOperatingNetCents =
    monthlyOperatingIncomeCents - monthlyOperatingExpenseCents

  let runwayMonths: number | null = null
  const burn = -monthlyOperatingNetCents
  if (cashBalanceCents != null && cashBalanceCents >= 0 && burn > 0) {
    runwayMonths = cashBalanceCents / burn
  }

  return {
    monthlyOperatingIncomeCents,
    monthlyOperatingExpenseCents,
    monthlyOperatingNetCents,
    monthlyFinancingInCents: annualFinancingIn / 12,
    cashBalanceCents,
    runwayMonths,
  }
}
