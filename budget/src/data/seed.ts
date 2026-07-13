import type { Budget, Category, Loan, Settings } from '@/domain/types'
import { newId } from './store'

/**
 * First-run starter data. Categories only — no invented amounts.
 * The two loans below are the confirmed mortgage records supplied for V1
 * and are fully editable in the app.
 */

export const DEFAULT_SETTINGS: Settings = {
  defaultPeriod: 'monthly',
  currency: 'NZD',
  includeOneOffs: true,
  preferredTheme: 'light',
}

interface CategorySeed {
  name: string
  itemType: 'income' | 'expense'
  isFinancing?: boolean
}

const PERSONAL_INCOME: CategorySeed[] = [
  { name: 'Salary', itemType: 'income' },
  { name: 'Partner income', itemType: 'income' },
  { name: 'Allowances', itemType: 'income' },
  { name: 'Investment income', itemType: 'income' },
  { name: 'Other income', itemType: 'income' },
]

const PERSONAL_EXPENSES: CategorySeed[] = [
  'Groceries', 'Childcare', 'Utilities', 'Insurance', 'Vehicles', 'Fuel',
  'Subscriptions', 'Health', 'Clothing', 'Family', 'Travel',
  'Personal spending', 'Savings', 'Tax', 'Other',
].map((name) => ({ name, itemType: 'expense' as const }))

const PROPERTY_INCOME: CategorySeed[] = [
  { name: 'Rent', itemType: 'income' },
  { name: 'Recoveries or contributions', itemType: 'income' },
  { name: 'Other property income', itemType: 'income' },
]

const PROPERTY_EXPENSES: CategorySeed[] = [
  'Mortgage', 'Rates', 'Insurance', 'Property management',
  'Repairs and maintenance', 'Accounting', 'Compliance', 'Utilities',
  'Vacancy allowance', 'Capital expenditure', 'Tax provision', 'Other',
].map((name) => ({ name, itemType: 'expense' as const }))

const TACEDGE_INCOME: CategorySeed[] = [
  { name: 'Pilot revenue', itemType: 'income' },
  { name: 'Subscription revenue', itemType: 'income' },
  { name: 'Project revenue', itemType: 'income' },
  { name: 'Consulting revenue', itemType: 'income' },
  { name: 'Grants', itemType: 'income' },
  { name: 'Investment or financing inflows', itemType: 'income', isFinancing: true },
  { name: 'Other income', itemType: 'income' },
]

const TACEDGE_EXPENSES: CategorySeed[] = [
  'Product development', 'Contractors', 'Hosting and infrastructure',
  'Software subscriptions', 'Legal', 'Accounting', 'Insurance', 'Marketing',
  'Travel', 'Equipment', 'Research and development', 'Founder costs',
  'GST provision', 'Tax provision', 'Other',
].map((name) => ({ name, itemType: 'expense' as const }))

export interface SeedData {
  budgets: Budget[]
  categories: Category[]
  loans: Loan[]
  settings: Settings
}

export function buildSeedData(): SeedData {
  const personal: Budget = {
    id: newId(), name: 'Personal', slug: 'personal',
    displayOrder: 0, icon: 'wallet', active: true, cashBalanceCents: null,
  }
  const property: Budget = {
    id: newId(), name: 'Property', slug: 'property',
    displayOrder: 1, icon: 'home', active: true, cashBalanceCents: null,
  }
  const tacedge: Budget = {
    id: newId(), name: 'TacEdge', slug: 'tacedge',
    displayOrder: 2, icon: 'mountain', active: true, cashBalanceCents: null,
  }

  const categories: Category[] = []
  const addCategories = (budgetId: string, seeds: CategorySeed[]) => {
    seeds.forEach((seed, index) => {
      categories.push({
        id: newId(),
        budgetId,
        name: seed.name,
        itemType: seed.itemType,
        icon: null,
        displayOrder: index,
        active: true,
        isFinancing: seed.isFinancing ?? false,
      })
    })
  }
  addCategories(personal.id, [...PERSONAL_INCOME, ...PERSONAL_EXPENSES])
  addCategories(property.id, [...PROPERTY_INCOME, ...PROPERTY_EXPENSES])
  addCategories(tacedge.id, [...TACEDGE_INCOME, ...TACEDGE_EXPENSES])

  const loans: Loan[] = [
    {
      id: newId(),
      budgetId: property.id,
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
    },
    {
      id: newId(),
      budgetId: property.id,
      name: 'Property Loan – Principal and Interest',
      currentBalanceCents: 5959606,
      originalBalanceCents: 6000000,
      annualInterestRate: 4.49,
      repaymentType: 'principal_and_interest',
      repaymentFrequency: 'fortnightly',
      scheduledRepaymentCents: 14524,
      fixedRateReviewDate: '2027-03-13',
      interestOnlyEndDate: null,
      loanTermEndDate: '2053-10-03',
      useEstimatedInterest: false,
      notes: null,
      active: true,
    },
  ]

  return {
    budgets: [personal, property, tacedge],
    categories,
    loans,
    settings: DEFAULT_SETTINGS,
  }
}
