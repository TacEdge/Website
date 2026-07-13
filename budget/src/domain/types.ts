/**
 * Core domain types. All monetary values are integer cents unless a name
 * ends in `Exact`, in which case fractional cents are carried internally
 * and rounded only at display time.
 */

export type Period = 'weekly' | 'fortnightly' | 'monthly' | 'annual'

export type Frequency =
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'one_off'

export type ItemType = 'income' | 'expense'

export type BudgetSlug = 'personal' | 'property' | 'tacedge'

export interface Budget {
  id: string
  name: string
  slug: string
  displayOrder: number
  icon: string | null
  active: boolean
  /** Manually entered cash balance — used for the TacEdge runway view. */
  cashBalanceCents: number | null
}

export interface Category {
  id: string
  budgetId: string
  name: string
  itemType: ItemType
  icon: string | null
  displayOrder: number
  active: boolean
  /** Financing inflows (e.g. founder contributions) are excluded from operating revenue. */
  isFinancing: boolean
}

export interface BudgetItem {
  id: string
  budgetId: string
  categoryId: string | null
  name: string
  itemType: ItemType
  amountCents: number
  frequency: Frequency
  startDate: string | null
  endDate: string | null
  oneOffDate: string | null
  includeInBaseline: boolean
  active: boolean
  notes: string | null
  payeeSource: string | null
  gstNote: string | null
  reminderDate: string | null
  tags: string[]
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface Transfer {
  id: string
  name: string
  sourceBudgetId: string
  destinationBudgetId: string
  amountCents: number
  frequency: Frequency
  startDate: string | null
  endDate: string | null
  oneOffDate: string | null
  notes: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type RepaymentType = 'interest_only' | 'principal_and_interest'

export interface Loan {
  id: string
  budgetId: string
  name: string
  currentBalanceCents: number
  originalBalanceCents: number | null
  /** Annual interest rate as a percentage, e.g. 6.45 */
  annualInterestRate: number
  repaymentType: RepaymentType
  repaymentFrequency: Exclude<Frequency, 'one_off'>
  scheduledRepaymentCents: number | null
  fixedRateReviewDate: string | null
  interestOnlyEndDate: string | null
  loanTermEndDate: string | null
  useEstimatedInterest: boolean
  notes: string | null
  active: boolean
}

export interface Settings {
  defaultPeriod: Period
  currency: string
  includeOneOffs: boolean
  preferredTheme: 'light'
}

export type SortMode =
  | 'custom'
  | 'largest'
  | 'smallest'
  | 'alphabetical'
  | 'next_due'
  | 'recently_edited'
