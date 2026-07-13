import type {
  Budget,
  BudgetItem,
  Category,
  Loan,
  Settings,
  Transfer,
} from '@/domain/types'

/** Full export payload — also the JSON backup format. */
export interface ExportPayload {
  app: 'tacedge-budget'
  schemaVersion: 1
  exportedAt: string
  budgets: Budget[]
  categories: Category[]
  items: BudgetItem[]
  transfers: Transfer[]
  loans: Loan[]
  settings: Settings
}

export interface Snapshot {
  budgets: Budget[]
  categories: Category[]
  items: BudgetItem[]
  transfers: Transfer[]
  loans: Loan[]
  settings: Settings
}

/**
 * Storage abstraction. The Supabase store is the real backend; the local
 * store powers the clearly-labelled on-device demo mode and tests.
 */
export interface DataStore {
  readonly mode: 'supabase' | 'local'

  /** Idempotent: creates the default budgets, categories, loans and settings
   * on first use. Returns true when it seeded (first run). */
  seedIfNeeded(): Promise<boolean>

  listBudgets(): Promise<Budget[]>
  updateBudget(id: string, patch: Partial<Omit<Budget, 'id'>>): Promise<void>

  listCategories(): Promise<Category[]>
  createCategory(category: Category): Promise<void>
  updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>): Promise<void>
  deleteCategory(id: string): Promise<void>

  listItems(): Promise<BudgetItem[]>
  createItem(item: BudgetItem): Promise<void>
  updateItem(id: string, patch: Partial<Omit<BudgetItem, 'id'>>): Promise<void>
  deleteItem(id: string): Promise<void>

  listTransfers(): Promise<Transfer[]>
  createTransfer(transfer: Transfer): Promise<void>
  updateTransfer(id: string, patch: Partial<Omit<Transfer, 'id'>>): Promise<void>
  deleteTransfer(id: string): Promise<void>

  listLoans(): Promise<Loan[]>
  createLoan(loan: Loan): Promise<void>
  updateLoan(id: string, patch: Partial<Omit<Loan, 'id'>>): Promise<void>
  deleteLoan(id: string): Promise<void>

  getSettings(): Promise<Settings>
  updateSettings(patch: Partial<Settings>): Promise<void>

  /** Replace-or-merge restore from a validated backup payload. */
  importData(payload: ExportPayload, mode: 'merge' | 'replace'): Promise<void>
}

export function newId(): string {
  return crypto.randomUUID()
}

export function nowIso(): string {
  return new Date().toISOString()
}
