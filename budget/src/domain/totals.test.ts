import { describe, expect, it } from 'vitest'
import type { Budget, BudgetItem, Loan, Transfer } from './types'
import { budgetTotals, consolidatedTotals, itemContributionCents } from './totals'
import { runwaySummary } from './runway'
import { estimatedMonthlyInterestCents, loanAnnualCostCents } from './loans'

const today = new Date(2026, 6, 13) // 13 July 2026

function makeItem(partial: Partial<BudgetItem>): BudgetItem {
  return {
    id: 'i1',
    budgetId: 'b1',
    categoryId: null,
    name: 'Item',
    itemType: 'expense',
    amountCents: 10000,
    frequency: 'weekly',
    startDate: null,
    endDate: null,
    oneOffDate: null,
    includeInBaseline: true,
    active: true,
    notes: null,
    payeeSource: null,
    gstNote: null,
    reminderDate: null,
    tags: [],
    displayOrder: 0,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...partial,
  }
}

const budgets: Budget[] = [
  { id: 'b1', name: 'Personal', slug: 'personal', displayOrder: 0, icon: null, active: true, cashBalanceCents: null },
  { id: 'b2', name: 'TacEdge', slug: 'tacedge', displayOrder: 1, icon: null, active: true, cashBalanceCents: null },
]

const options = { period: 'monthly' as const, includeOneOffs: true, today }

describe('one-off handling', () => {
  it('includes a one-off dated inside the current month', () => {
    const item = makeItem({ frequency: 'one_off', oneOffDate: '2026-07-20', amountCents: 50000 })
    expect(itemContributionCents(item, options)).toBe(50000)
  })
  it('excludes a one-off dated outside the current month', () => {
    const item = makeItem({ frequency: 'one_off', oneOffDate: '2026-09-20', amountCents: 50000 })
    expect(itemContributionCents(item, options)).toBe(0)
  })
  it('never spreads one-offs across periods when the toggle is off', () => {
    const item = makeItem({ frequency: 'one_off', oneOffDate: '2026-07-20', amountCents: 50000 })
    expect(itemContributionCents(item, { ...options, includeOneOffs: false })).toBe(0)
  })
  it('includes a one-off in the annual view for the current year', () => {
    const item = makeItem({ frequency: 'one_off', oneOffDate: '2026-11-01', amountCents: 50000 })
    expect(itemContributionCents(item, { ...options, period: 'annual' })).toBe(50000)
  })
})

describe('transfers', () => {
  const transfer: Transfer = {
    id: 't1',
    name: 'Founder contribution',
    sourceBudgetId: 'b1',
    destinationBudgetId: 'b2',
    amountCents: 200000,
    frequency: 'monthly',
    startDate: null,
    endDate: null,
    oneOffDate: null,
    notes: null,
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }
  const income = makeItem({ id: 'i1', budgetId: 'b1', itemType: 'income', amountCents: 500000, frequency: 'monthly' })

  it('shows the outflow in the source budget and inflow in the destination', () => {
    const source = budgetTotals('b1', [income], [transfer], [], options)
    const destination = budgetTotals('b2', [income], [transfer], [], options)
    expect(source.transfersOutCents).toBe(200000)
    expect(source.netCents).toBe(300000)
    expect(destination.transfersInCents).toBe(200000)
    expect(destination.netCents).toBe(200000)
  })

  it('excludes transfers from consolidated income and expenses (net effect $0)', () => {
    const consolidated = consolidatedTotals(budgets, [income], [transfer], [], options)
    expect(consolidated.incomeCents).toBe(500000)
    expect(consolidated.expenseCents).toBe(0)
    expect(consolidated.netCents).toBe(500000)
    // Sum of budget nets equals the consolidated net: transfers cancel out.
    const netSum = [...consolidated.perBudget.values()].reduce((s, t) => s + t.netCents, 0)
    expect(netSum).toBe(consolidated.netCents)
  })
})

describe('net positions', () => {
  it('reports a positive net when income exceeds expenses', () => {
    const items = [
      makeItem({ id: 'a', itemType: 'income', amountCents: 100000, frequency: 'weekly' }),
      makeItem({ id: 'b', itemType: 'expense', amountCents: 60000, frequency: 'weekly' }),
    ]
    const totals = budgetTotals('b1', items, [], [], { ...options, period: 'weekly' })
    expect(totals.netCents).toBe(40000)
  })
  it('reports a negative net when expenses exceed income', () => {
    const items = [
      makeItem({ id: 'a', itemType: 'income', amountCents: 50000, frequency: 'weekly' }),
      makeItem({ id: 'b', itemType: 'expense', amountCents: 80000, frequency: 'weekly' }),
    ]
    const totals = budgetTotals('b1', items, [], [], { ...options, period: 'weekly' })
    expect(totals.netCents).toBe(-30000)
  })
  it('ignores inactive and archived items', () => {
    const items = [makeItem({ id: 'a', itemType: 'expense', active: false })]
    const totals = budgetTotals('b1', items, [], [], options)
    expect(totals.expenseCents).toBe(0)
  })
})

describe('loan interest estimate', () => {
  const loan: Loan = {
    id: 'l1',
    budgetId: 'b1',
    name: 'Property Loan – Interest Only',
    currentBalanceCents: 41828140,
    originalBalanceCents: null,
    annualInterestRate: 6.45,
    repaymentType: 'interest_only',
    repaymentFrequency: 'monthly',
    scheduledRepaymentCents: null,
    fixedRateReviewDate: '2027-09-25',
    interestOnlyEndDate: '2028-09-25',
    loanTermEndDate: '2053-09-25',
    useEstimatedInterest: true,
    notes: null,
    active: true,
  }

  it('estimates monthly interest as balance × rate ÷ 365 × days in month', () => {
    // July has 31 days: 418,281.40 × 6.45% ÷ 365 × 31 = $2,291.38 (to the cent)
    const july = estimatedMonthlyInterestCents(41828140, 6.45, new Date(2026, 6, 1))
    expect(july / 100).toBeCloseTo(2291.38, 2)
  })

  it('uses the actual scheduled repayment when provided', () => {
    const pAndI: Loan = {
      ...loan,
      repaymentType: 'principal_and_interest',
      repaymentFrequency: 'fortnightly',
      scheduledRepaymentCents: 14524,
      useEstimatedInterest: false,
    }
    expect(loanAnnualCostCents(pAndI)).toBe(14524 * 26)
  })

  it('feeds loan costs into the budget expense side', () => {
    const totals = budgetTotals('b1', [], [], [loan], options)
    expect(totals.loanCostCents).toBeGreaterThan(0)
    expect(totals.netCents).toBeLessThan(0)
  })
})

describe('runway', () => {
  const expense = makeItem({ id: 'e', budgetId: 'b2', itemType: 'expense', amountCents: 100000, frequency: 'monthly' })
  const revenue = makeItem({ id: 'r', budgetId: 'b2', itemType: 'income', amountCents: 40000, frequency: 'monthly' })

  it('computes runway as cash ÷ monthly net burn', () => {
    const summary = runwaySummary('b2', [expense, revenue], [], [], [], 1200000)
    expect(summary.monthlyOperatingNetCents).toBe(-60000)
    expect(summary.runwayMonths).toBeCloseTo(20, 5)
  })

  it('is unavailable when income covers expenses', () => {
    const summary = runwaySummary('b2', [revenue], [], [], [], 1200000)
    expect(summary.runwayMonths).toBeNull()
  })

  it('is unavailable without a cash balance', () => {
    const summary = runwaySummary('b2', [expense], [], [], [], null)
    expect(summary.runwayMonths).toBeNull()
  })

  it('treats financing categories and inbound transfers as non-operating', () => {
    const categories = [
      { id: 'c1', budgetId: 'b2', name: 'Investment or financing inflows', itemType: 'income' as const, icon: null, displayOrder: 0, active: true, isFinancing: true },
    ]
    const founderFunding = makeItem({ id: 'f', budgetId: 'b2', itemType: 'income', categoryId: 'c1', amountCents: 200000, frequency: 'monthly' })
    const summary = runwaySummary('b2', [expense, founderFunding], categories, [], [], 1200000)
    // Funding does not reduce burn: still $1,000/month out.
    expect(summary.monthlyOperatingIncomeCents).toBe(0)
    expect(summary.monthlyFinancingInCents).toBe(200000)
    expect(summary.runwayMonths).toBeCloseTo(12, 5)
  })
})
