import { z } from 'zod'
import type { Budget, BudgetItem, Category, Loan, Settings, Transfer } from './types'
import type { ExportPayload } from '@/data/store'
import { annualiseCents } from './frequency'
import { formatCents } from './money'

/* ── JSON backup ─────────────────────────────────────────────────── */

export function buildExportPayload(data: {
  budgets: Budget[]
  categories: Category[]
  items: BudgetItem[]
  transfers: Transfer[]
  loans: Loan[]
  settings: Settings
}): ExportPayload {
  return {
    app: 'tacedge-budget',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    ...data,
  }
}

const frequencySchema = z.enum([
  'weekly', 'fortnightly', 'monthly', 'quarterly', 'annual', 'one_off',
])
const itemTypeSchema = z.enum(['income', 'expense'])

const budgetSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string(),
  displayOrder: z.number(),
  icon: z.string().nullable(),
  active: z.boolean(),
  cashBalanceCents: z.number().nullable(),
})

const categorySchema = z.object({
  id: z.string(),
  budgetId: z.string(),
  name: z.string().min(1),
  itemType: itemTypeSchema,
  icon: z.string().nullable(),
  displayOrder: z.number(),
  active: z.boolean(),
  isFinancing: z.boolean(),
})

const itemSchema = z.object({
  id: z.string(),
  budgetId: z.string(),
  categoryId: z.string().nullable(),
  name: z.string().min(1),
  itemType: itemTypeSchema,
  amountCents: z.number().int(),
  frequency: frequencySchema,
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  oneOffDate: z.string().nullable(),
  includeInBaseline: z.boolean(),
  active: z.boolean(),
  notes: z.string().nullable(),
  payeeSource: z.string().nullable(),
  gstNote: z.string().nullable(),
  reminderDate: z.string().nullable(),
  tags: z.array(z.string()),
  displayOrder: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const transferSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  sourceBudgetId: z.string(),
  destinationBudgetId: z.string(),
  amountCents: z.number().int(),
  frequency: frequencySchema,
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  oneOffDate: z.string().nullable(),
  notes: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const loanSchema = z.object({
  id: z.string(),
  budgetId: z.string(),
  name: z.string().min(1),
  currentBalanceCents: z.number().int(),
  originalBalanceCents: z.number().int().nullable(),
  annualInterestRate: z.number(),
  repaymentType: z.enum(['interest_only', 'principal_and_interest']),
  repaymentFrequency: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annual']),
  scheduledRepaymentCents: z.number().int().nullable(),
  fixedRateReviewDate: z.string().nullable(),
  interestOnlyEndDate: z.string().nullable(),
  loanTermEndDate: z.string().nullable(),
  useEstimatedInterest: z.boolean(),
  notes: z.string().nullable(),
  active: z.boolean(),
})

const settingsSchema = z.object({
  defaultPeriod: z.enum(['weekly', 'fortnightly', 'monthly', 'annual']),
  currency: z.string(),
  includeOneOffs: z.boolean(),
  preferredTheme: z.literal('light'),
})

export const exportPayloadSchema = z.object({
  app: z.literal('tacedge-budget'),
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  budgets: z.array(budgetSchema),
  categories: z.array(categorySchema),
  items: z.array(itemSchema),
  transfers: z.array(transferSchema),
  loans: z.array(loanSchema),
  settings: settingsSchema,
})

export interface ImportValidation {
  ok: boolean
  error?: string
  payload?: ExportPayload
  summary?: {
    budgets: number
    categories: number
    items: number
    transfers: number
    loans: number
    exportedAt: string
  }
}

export function validateImport(raw: string): ImportValidation {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' }
  }
  const result = exportPayloadSchema.safeParse(parsed)
  if (!result.success) {
    return {
      ok: false,
      error:
        'This file is not a TacEdge Budget backup, or it was made by an incompatible version.',
    }
  }
  const payload = result.data
  return {
    ok: true,
    payload,
    summary: {
      budgets: payload.budgets.length,
      categories: payload.categories.length,
      items: payload.items.length,
      transfers: payload.transfers.length,
      loans: payload.loans.length,
      exportedAt: payload.exportedAt,
    },
  }
}

/* ── CSV export ──────────────────────────────────────────────────── */

function csvEscape(value: string | number | boolean | null): string {
  if (value === null) return ''
  const text = String(value)
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`
  return text
}

export function toCsv(headers: string[], rows: (string | number | boolean | null)[][]): string {
  return [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')
}

const ITEM_HEADERS = [
  'Budget', 'Name', 'Type', 'Category', 'Entered amount', 'Frequency',
  'Annualised amount', 'Start date', 'End date', 'One-off date',
  'In baseline', 'Active', 'Payee or source', 'GST note', 'Notes',
]

export function itemsCsv(
  items: BudgetItem[],
  budgets: Budget[],
  categories: Category[],
): string {
  const rows = items.map((item) => [
    budgets.find((b) => b.id === item.budgetId)?.name ?? '',
    item.name,
    item.itemType,
    categories.find((c) => c.id === item.categoryId)?.name ?? '',
    formatCents(item.amountCents),
    item.frequency,
    item.frequency === 'one_off' ? '' : formatCents(annualiseCents(item.amountCents, item.frequency)),
    item.startDate,
    item.endDate,
    item.oneOffDate,
    item.includeInBaseline,
    item.active,
    item.payeeSource,
    item.gstNote,
    item.notes,
  ])
  return toCsv(ITEM_HEADERS, rows)
}

export function transfersCsv(transfers: Transfer[], budgets: Budget[]): string {
  const headers = [
    'Name', 'From', 'To', 'Entered amount', 'Frequency', 'Annualised amount',
    'Start date', 'End date', 'One-off date', 'Active', 'Notes',
  ]
  const rows = transfers.map((t) => [
    t.name,
    budgets.find((b) => b.id === t.sourceBudgetId)?.name ?? '',
    budgets.find((b) => b.id === t.destinationBudgetId)?.name ?? '',
    formatCents(t.amountCents),
    t.frequency,
    t.frequency === 'one_off' ? '' : formatCents(annualiseCents(t.amountCents, t.frequency)),
    t.startDate,
    t.endDate,
    t.oneOffDate,
    t.active,
    t.notes,
  ])
  return toCsv(headers, rows)
}

export function loansCsv(loans: Loan[], budgets: Budget[]): string {
  const headers = [
    'Budget', 'Name', 'Current balance', 'Original balance', 'Interest rate % p.a.',
    'Repayment type', 'Repayment frequency', 'Scheduled repayment',
    'Fixed-rate review', 'Interest-only end', 'Loan term end',
    'Uses estimated interest', 'Active', 'Notes',
  ]
  const rows = loans.map((loan) => [
    budgets.find((b) => b.id === loan.budgetId)?.name ?? '',
    loan.name,
    formatCents(loan.currentBalanceCents),
    loan.originalBalanceCents === null ? '' : formatCents(loan.originalBalanceCents),
    loan.annualInterestRate,
    loan.repaymentType,
    loan.repaymentFrequency,
    loan.scheduledRepaymentCents === null ? '' : formatCents(loan.scheduledRepaymentCents),
    loan.fixedRateReviewDate,
    loan.interestOnlyEndDate,
    loan.loanTermEndDate,
    loan.useEstimatedInterest,
    loan.active,
    loan.notes,
  ])
  return toCsv(headers, rows)
}

export function downloadFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
