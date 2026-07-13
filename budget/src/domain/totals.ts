import type {
  Budget,
  BudgetItem,
  Loan,
  Period,
  Transfer,
} from './types'
import { annualiseCents, annualToPeriodCents, perPeriodCents } from './frequency'
import { currentWindow, isoDateInWindow } from './dates'
import { loanPerPeriodCents } from './loans'

export interface TotalsOptions {
  period: Period
  includeOneOffs: boolean
  /** Reference date used to place one-off items into the current window. */
  today: Date
}

/** An item is part of the recurring baseline for totals. */
export function isBaselineItem(item: BudgetItem): boolean {
  return item.active && item.frequency !== 'one_off' && item.includeInBaseline
}

/** Active one-off item whose date falls inside the current reporting window. */
export function isOneOffInWindow(item: BudgetItem, options: TotalsOptions): boolean {
  if (!item.active || item.frequency !== 'one_off' || !item.oneOffDate) return false
  return isoDateInWindow(item.oneOffDate, currentWindow(options.period, options.today))
}

/** Per-period exact cents an item contributes to totals (0 when excluded). */
export function itemContributionCents(
  item: BudgetItem,
  options: TotalsOptions,
): number {
  if (isBaselineItem(item)) {
    return perPeriodCents(item.amountCents, item.frequency, options.period)
  }
  if (options.includeOneOffs && isOneOffInWindow(item, options)) {
    return item.amountCents
  }
  return 0
}

/** Recurring transfer flow per period; one-off transfers follow one-off rules. */
export function transferContributionCents(
  transfer: Transfer,
  options: TotalsOptions,
): number {
  if (!transfer.active) return 0
  if (transfer.frequency === 'one_off') {
    if (!options.includeOneOffs || !transfer.oneOffDate) return 0
    return isoDateInWindow(
      transfer.oneOffDate,
      currentWindow(options.period, options.today),
    )
      ? transfer.amountCents
      : 0
  }
  return perPeriodCents(transfer.amountCents, transfer.frequency, options.period)
}

export interface BudgetTotals {
  incomeCents: number
  expenseCents: number
  transfersInCents: number
  transfersOutCents: number
  loanCostCents: number
  /** income + transfers in − expenses − loan costs − transfers out */
  netCents: number
  /** income − expenses − loan costs, ignoring transfers (operating position) */
  operatingNetCents: number
  oneOffIncluded: boolean
}

/**
 * Totals for a single budget. Transfers appear in the budget's own cash
 * position (in/out); loans contribute their repayment or estimated interest
 * to the expense side via `loanCostCents`.
 */
export function budgetTotals(
  budgetId: string,
  items: BudgetItem[],
  transfers: Transfer[],
  loans: Loan[],
  options: TotalsOptions,
): BudgetTotals {
  let incomeCents = 0
  let expenseCents = 0
  for (const item of items) {
    if (item.budgetId !== budgetId) continue
    const contribution = itemContributionCents(item, options)
    if (item.itemType === 'income') incomeCents += contribution
    else expenseCents += contribution
  }
  let transfersInCents = 0
  let transfersOutCents = 0
  for (const transfer of transfers) {
    const flow = transferContributionCents(transfer, options)
    if (transfer.destinationBudgetId === budgetId) transfersInCents += flow
    if (transfer.sourceBudgetId === budgetId) transfersOutCents += flow
  }
  let loanCostCents = 0
  for (const loan of loans) {
    if (loan.budgetId !== budgetId || !loan.active) continue
    loanCostCents += loanPerPeriodCents(loan, options.period)
  }
  const operatingNetCents = incomeCents - expenseCents - loanCostCents
  return {
    incomeCents,
    expenseCents,
    transfersInCents,
    transfersOutCents,
    loanCostCents,
    netCents: operatingNetCents + transfersInCents - transfersOutCents,
    operatingNetCents,
    oneOffIncluded: options.includeOneOffs,
  }
}

export interface ConsolidatedTotals {
  incomeCents: number
  expenseCents: number
  netCents: number
  perBudget: Map<string, BudgetTotals>
}

/**
 * Consolidated position across all budgets. Transfers between budgets are
 * excluded from consolidated income and expenses so money moved between
 * areas is never double-counted; their net effect is $0 by construction.
 */
export function consolidatedTotals(
  budgets: Budget[],
  items: BudgetItem[],
  transfers: Transfer[],
  loans: Loan[],
  options: TotalsOptions,
): ConsolidatedTotals {
  const perBudget = new Map<string, BudgetTotals>()
  let incomeCents = 0
  let expenseCents = 0
  for (const budget of budgets) {
    const totals = budgetTotals(budget.id, items, transfers, loans, options)
    perBudget.set(budget.id, totals)
    incomeCents += totals.incomeCents
    expenseCents += totals.expenseCents + totals.loanCostCents
  }
  return {
    incomeCents,
    expenseCents,
    netCents: incomeCents - expenseCents,
    perBudget,
  }
}

export interface KeyDriver {
  item: BudgetItem
  perPeriodCents: number
}

/** Largest recurring income and expense items across all budgets. */
export function keyDrivers(
  items: BudgetItem[],
  options: TotalsOptions,
  limit = 3,
): { income: KeyDriver[]; expenses: KeyDriver[] } {
  const scored = items
    .filter(isBaselineItem)
    .map((item) => ({
      item,
      perPeriodCents: perPeriodCents(item.amountCents, item.frequency, options.period),
    }))
    .sort((a, b) => b.perPeriodCents - a.perPeriodCents)
  return {
    income: scored.filter((d) => d.item.itemType === 'income').slice(0, limit),
    expenses: scored.filter((d) => d.item.itemType === 'expense').slice(0, limit),
  }
}

/** Annualised value of an item as entered (0 for one-off items). */
export function itemAnnualCents(item: BudgetItem): number {
  return annualiseCents(item.amountCents, item.frequency)
}

export { annualToPeriodCents }
