import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type {
  Budget,
  BudgetItem,
  Category,
  Loan,
  Settings,
  Transfer,
} from '@/domain/types'
import type { DataStore, ExportPayload } from './store'
import { buildSeedData, DEFAULT_SETTINGS } from './seed'

export function supabaseConfig(): { url: string; anonKey: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url || !anonKey) return null
  return { url, anonKey }
}

let client: SupabaseClient | null = null
export function getSupabase(): SupabaseClient | null {
  if (client) return client
  const config = supabaseConfig()
  if (!config) return null
  client = createClient(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
  return client
}

/* ── row mappers (snake_case ↔ domain camelCase) ─────────────────── */

type Row = Record<string, unknown>

const budgetFromRow = (r: Row): Budget => ({
  id: r.id as string,
  name: r.name as string,
  slug: r.slug as string,
  displayOrder: r.display_order as number,
  icon: (r.icon as string) ?? null,
  active: r.active as boolean,
  cashBalanceCents: (r.cash_balance_cents as number) ?? null,
})
const budgetToRow = (b: Partial<Budget>): Row => {
  const r: Row = {}
  if (b.id !== undefined) r.id = b.id
  if (b.name !== undefined) r.name = b.name
  if (b.slug !== undefined) r.slug = b.slug
  if (b.displayOrder !== undefined) r.display_order = b.displayOrder
  if (b.icon !== undefined) r.icon = b.icon
  if (b.active !== undefined) r.active = b.active
  if (b.cashBalanceCents !== undefined) r.cash_balance_cents = b.cashBalanceCents
  return r
}

const categoryFromRow = (r: Row): Category => ({
  id: r.id as string,
  budgetId: r.budget_id as string,
  name: r.name as string,
  itemType: r.item_type as Category['itemType'],
  icon: (r.icon as string) ?? null,
  displayOrder: r.display_order as number,
  active: r.active as boolean,
  isFinancing: r.is_financing as boolean,
})
const categoryToRow = (c: Partial<Category>): Row => {
  const r: Row = {}
  if (c.id !== undefined) r.id = c.id
  if (c.budgetId !== undefined) r.budget_id = c.budgetId
  if (c.name !== undefined) r.name = c.name
  if (c.itemType !== undefined) r.item_type = c.itemType
  if (c.icon !== undefined) r.icon = c.icon
  if (c.displayOrder !== undefined) r.display_order = c.displayOrder
  if (c.active !== undefined) r.active = c.active
  if (c.isFinancing !== undefined) r.is_financing = c.isFinancing
  return r
}

const itemFromRow = (r: Row): BudgetItem => ({
  id: r.id as string,
  budgetId: r.budget_id as string,
  categoryId: (r.category_id as string) ?? null,
  name: r.name as string,
  itemType: r.item_type as BudgetItem['itemType'],
  amountCents: r.amount_cents as number,
  frequency: r.frequency as BudgetItem['frequency'],
  startDate: (r.start_date as string) ?? null,
  endDate: (r.end_date as string) ?? null,
  oneOffDate: (r.one_off_date as string) ?? null,
  includeInBaseline: r.include_in_baseline as boolean,
  active: r.active as boolean,
  notes: (r.notes as string) ?? null,
  payeeSource: (r.payee_source as string) ?? null,
  gstNote: (r.gst_note as string) ?? null,
  reminderDate: (r.reminder_date as string) ?? null,
  tags: (r.tags as string[]) ?? [],
  displayOrder: r.display_order as number,
  createdAt: r.created_at as string,
  updatedAt: r.updated_at as string,
})
const itemToRow = (i: Partial<BudgetItem>): Row => {
  const r: Row = {}
  if (i.id !== undefined) r.id = i.id
  if (i.budgetId !== undefined) r.budget_id = i.budgetId
  if (i.categoryId !== undefined) r.category_id = i.categoryId
  if (i.name !== undefined) r.name = i.name
  if (i.itemType !== undefined) r.item_type = i.itemType
  if (i.amountCents !== undefined) r.amount_cents = i.amountCents
  if (i.frequency !== undefined) r.frequency = i.frequency
  if (i.startDate !== undefined) r.start_date = i.startDate
  if (i.endDate !== undefined) r.end_date = i.endDate
  if (i.oneOffDate !== undefined) r.one_off_date = i.oneOffDate
  if (i.includeInBaseline !== undefined) r.include_in_baseline = i.includeInBaseline
  if (i.active !== undefined) r.active = i.active
  if (i.notes !== undefined) r.notes = i.notes
  if (i.payeeSource !== undefined) r.payee_source = i.payeeSource
  if (i.gstNote !== undefined) r.gst_note = i.gstNote
  if (i.reminderDate !== undefined) r.reminder_date = i.reminderDate
  if (i.tags !== undefined) r.tags = i.tags
  if (i.displayOrder !== undefined) r.display_order = i.displayOrder
  return r
}

const transferFromRow = (r: Row): Transfer => ({
  id: r.id as string,
  name: r.name as string,
  sourceBudgetId: r.source_budget_id as string,
  destinationBudgetId: r.destination_budget_id as string,
  amountCents: r.amount_cents as number,
  frequency: r.frequency as Transfer['frequency'],
  startDate: (r.start_date as string) ?? null,
  endDate: (r.end_date as string) ?? null,
  oneOffDate: (r.one_off_date as string) ?? null,
  notes: (r.notes as string) ?? null,
  active: r.active as boolean,
  createdAt: r.created_at as string,
  updatedAt: r.updated_at as string,
})
const transferToRow = (t: Partial<Transfer>): Row => {
  const r: Row = {}
  if (t.id !== undefined) r.id = t.id
  if (t.name !== undefined) r.name = t.name
  if (t.sourceBudgetId !== undefined) r.source_budget_id = t.sourceBudgetId
  if (t.destinationBudgetId !== undefined) r.destination_budget_id = t.destinationBudgetId
  if (t.amountCents !== undefined) r.amount_cents = t.amountCents
  if (t.frequency !== undefined) r.frequency = t.frequency
  if (t.startDate !== undefined) r.start_date = t.startDate
  if (t.endDate !== undefined) r.end_date = t.endDate
  if (t.oneOffDate !== undefined) r.one_off_date = t.oneOffDate
  if (t.notes !== undefined) r.notes = t.notes
  if (t.active !== undefined) r.active = t.active
  return r
}

const loanFromRow = (r: Row): Loan => ({
  id: r.id as string,
  budgetId: r.budget_id as string,
  name: r.name as string,
  currentBalanceCents: r.current_balance_cents as number,
  originalBalanceCents: (r.original_balance_cents as number) ?? null,
  annualInterestRate: Number(r.annual_interest_rate),
  repaymentType: r.repayment_type as Loan['repaymentType'],
  repaymentFrequency: r.repayment_frequency as Loan['repaymentFrequency'],
  scheduledRepaymentCents: (r.scheduled_repayment_cents as number) ?? null,
  fixedRateReviewDate: (r.fixed_rate_review_date as string) ?? null,
  interestOnlyEndDate: (r.interest_only_end_date as string) ?? null,
  loanTermEndDate: (r.loan_term_end_date as string) ?? null,
  useEstimatedInterest: r.use_estimated_interest as boolean,
  notes: (r.notes as string) ?? null,
  active: r.active as boolean,
})
const loanToRow = (l: Partial<Loan>): Row => {
  const r: Row = {}
  if (l.id !== undefined) r.id = l.id
  if (l.budgetId !== undefined) r.budget_id = l.budgetId
  if (l.name !== undefined) r.name = l.name
  if (l.currentBalanceCents !== undefined) r.current_balance_cents = l.currentBalanceCents
  if (l.originalBalanceCents !== undefined) r.original_balance_cents = l.originalBalanceCents
  if (l.annualInterestRate !== undefined) r.annual_interest_rate = l.annualInterestRate
  if (l.repaymentType !== undefined) r.repayment_type = l.repaymentType
  if (l.repaymentFrequency !== undefined) r.repayment_frequency = l.repaymentFrequency
  if (l.scheduledRepaymentCents !== undefined) r.scheduled_repayment_cents = l.scheduledRepaymentCents
  if (l.fixedRateReviewDate !== undefined) r.fixed_rate_review_date = l.fixedRateReviewDate
  if (l.interestOnlyEndDate !== undefined) r.interest_only_end_date = l.interestOnlyEndDate
  if (l.loanTermEndDate !== undefined) r.loan_term_end_date = l.loanTermEndDate
  if (l.useEstimatedInterest !== undefined) r.use_estimated_interest = l.useEstimatedInterest
  if (l.notes !== undefined) r.notes = l.notes
  if (l.active !== undefined) r.active = l.active
  return r
}

const settingsFromRow = (r: Row): Settings => ({
  defaultPeriod: r.default_period as Settings['defaultPeriod'],
  currency: r.currency as string,
  includeOneOffs: r.include_one_offs as boolean,
  preferredTheme: 'light',
})

/* ── store ────────────────────────────────────────────────────────── */

export class SupabaseStore implements DataStore {
  readonly mode = 'supabase' as const

  constructor(
    private db: SupabaseClient,
    private userId: string,
  ) {}

  private withUser(row: Row): Row {
    return { ...row, user_id: this.userId }
  }

  private async selectAll(table: string): Promise<Row[]> {
    const { data, error } = await this.db.from(table).select('*')
    if (error) throw new Error(`Could not load ${table}: ${error.message}`)
    return data as Row[]
  }

  private async insert(table: string, rows: Row[]): Promise<void> {
    if (rows.length === 0) return
    const { error } = await this.db.from(table).insert(rows.map((r) => this.withUser(r)))
    if (error) throw new Error(`Could not save to ${table}: ${error.message}`)
  }

  private async update(table: string, id: string, row: Row): Promise<void> {
    const { error } = await this.db.from(table).update(row).eq('id', id)
    if (error) throw new Error(`Could not update ${table}: ${error.message}`)
  }

  private async delete(table: string, id: string): Promise<void> {
    const { error } = await this.db.from(table).delete().eq('id', id)
    if (error) throw new Error(`Could not delete from ${table}: ${error.message}`)
  }

  async seedIfNeeded(): Promise<boolean> {
    const existing = await this.selectAll('budgets')
    if (existing.length > 0) {
      await this.ensureSettings()
      return false
    }
    const seed = buildSeedData()
    await this.insert('budgets', seed.budgets.map(budgetToRow))
    await this.insert('categories', seed.categories.map(categoryToRow))
    await this.insert('loans', seed.loans.map(loanToRow))
    await this.ensureSettings()
    return true
  }

  private async ensureSettings(): Promise<void> {
    const { error } = await this.db.from('settings').upsert(
      this.withUser({
        default_period: DEFAULT_SETTINGS.defaultPeriod,
        currency: DEFAULT_SETTINGS.currency,
        include_one_offs: DEFAULT_SETTINGS.includeOneOffs,
        preferred_theme: DEFAULT_SETTINGS.preferredTheme,
      }),
      { onConflict: 'user_id', ignoreDuplicates: true },
    )
    if (error) throw new Error(`Could not initialise settings: ${error.message}`)
  }

  async listBudgets(): Promise<Budget[]> {
    const rows = await this.selectAll('budgets')
    return rows.map(budgetFromRow).sort((a, b) => a.displayOrder - b.displayOrder)
  }
  async updateBudget(id: string, patch: Partial<Omit<Budget, 'id'>>): Promise<void> {
    await this.update('budgets', id, budgetToRow(patch))
  }

  async listCategories(): Promise<Category[]> {
    const rows = await this.selectAll('categories')
    return rows.map(categoryFromRow).sort((a, b) => a.displayOrder - b.displayOrder)
  }
  async createCategory(category: Category): Promise<void> {
    await this.insert('categories', [categoryToRow(category)])
  }
  async updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>): Promise<void> {
    await this.update('categories', id, categoryToRow(patch))
  }
  async deleteCategory(id: string): Promise<void> {
    await this.delete('categories', id)
  }

  async listItems(): Promise<BudgetItem[]> {
    const rows = await this.selectAll('budget_items')
    return rows.map(itemFromRow)
  }
  async createItem(item: BudgetItem): Promise<void> {
    await this.insert('budget_items', [itemToRow(item)])
  }
  async updateItem(id: string, patch: Partial<Omit<BudgetItem, 'id'>>): Promise<void> {
    await this.update('budget_items', id, itemToRow(patch))
  }
  async deleteItem(id: string): Promise<void> {
    await this.delete('budget_items', id)
  }

  async listTransfers(): Promise<Transfer[]> {
    const rows = await this.selectAll('transfers')
    return rows.map(transferFromRow)
  }
  async createTransfer(transfer: Transfer): Promise<void> {
    await this.insert('transfers', [transferToRow(transfer)])
  }
  async updateTransfer(id: string, patch: Partial<Omit<Transfer, 'id'>>): Promise<void> {
    await this.update('transfers', id, transferToRow(patch))
  }
  async deleteTransfer(id: string): Promise<void> {
    await this.delete('transfers', id)
  }

  async listLoans(): Promise<Loan[]> {
    const rows = await this.selectAll('loans')
    return rows.map(loanFromRow)
  }
  async createLoan(loan: Loan): Promise<void> {
    await this.insert('loans', [loanToRow(loan)])
  }
  async updateLoan(id: string, patch: Partial<Omit<Loan, 'id'>>): Promise<void> {
    await this.update('loans', id, loanToRow(patch))
  }
  async deleteLoan(id: string): Promise<void> {
    await this.delete('loans', id)
  }

  async getSettings(): Promise<Settings> {
    const { data, error } = await this.db.from('settings').select('*').maybeSingle()
    if (error) throw new Error(`Could not load settings: ${error.message}`)
    if (!data) return DEFAULT_SETTINGS
    return settingsFromRow(data as Row)
  }
  async updateSettings(patch: Partial<Settings>): Promise<void> {
    const row: Row = {}
    if (patch.defaultPeriod !== undefined) row.default_period = patch.defaultPeriod
    if (patch.currency !== undefined) row.currency = patch.currency
    if (patch.includeOneOffs !== undefined) row.include_one_offs = patch.includeOneOffs
    if (patch.preferredTheme !== undefined) row.preferred_theme = patch.preferredTheme
    const { error } = await this.db
      .from('settings')
      .upsert(this.withUser(row), { onConflict: 'user_id' })
    if (error) throw new Error(`Could not save settings: ${error.message}`)
  }

  async importData(payload: ExportPayload, mode: 'merge' | 'replace'): Promise<void> {
    if (mode === 'replace') {
      // Order matters for foreign keys: children first.
      for (const table of ['budget_items', 'transfers', 'loans', 'categories', 'budgets']) {
        const { error } = await this.db.from(table).delete().eq('user_id', this.userId)
        if (error) throw new Error(`Could not clear ${table}: ${error.message}`)
      }
    }
    const upsert = async (table: string, rows: Row[]) => {
      if (rows.length === 0) return
      const { error } = await this.db
        .from(table)
        .upsert(rows.map((r) => this.withUser(r)), { onConflict: 'id' })
      if (error) throw new Error(`Could not restore ${table}: ${error.message}`)
    }
    await upsert('budgets', payload.budgets.map(budgetToRow))
    await upsert('categories', payload.categories.map(categoryToRow))
    await upsert('budget_items', payload.items.map(itemToRow))
    await upsert('transfers', payload.transfers.map(transferToRow))
    await upsert('loans', payload.loans.map(loanToRow))
    await this.updateSettings(payload.settings)
  }
}
