import type {
  Budget,
  BudgetItem,
  Category,
  Loan,
  Settings,
  Transfer,
} from '@/domain/types'
import type { DataStore, ExportPayload, Snapshot } from './store'
import { safeStorage } from './safeStorage'
import { buildSeedData, DEFAULT_SETTINGS } from './seed'

const STORAGE_KEY = 'tacedge-budget-demo-v1'

interface LocalState {
  budgets: Budget[]
  categories: Category[]
  items: BudgetItem[]
  transfers: Transfer[]
  loans: Loan[]
  settings: Settings
}

/**
 * On-device demo store. Used only when Supabase is not configured, and the
 * UI labels it clearly: data lives in this browser only and is not synced.
 */
export class LocalStore implements DataStore {
  readonly mode = 'local' as const
  private state: LocalState

  constructor() {
    this.state = this.load()
  }

  private load(): LocalState {
    try {
      const raw = safeStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as LocalState
    } catch {
      // fall through to empty state
    }
    return {
      budgets: [],
      categories: [],
      items: [],
      transfers: [],
      loans: [],
      settings: DEFAULT_SETTINGS,
    }
  }

  private persist(): void {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
  }

  async seedIfNeeded(): Promise<boolean> {
    if (this.state.budgets.length > 0) return false
    const seed = buildSeedData()
    this.state.budgets = seed.budgets
    this.state.categories = seed.categories
    this.state.loans = seed.loans
    this.state.settings = seed.settings
    this.persist()
    return true
  }

  async listBudgets(): Promise<Budget[]> {
    return [...this.state.budgets].sort((a, b) => a.displayOrder - b.displayOrder)
  }
  async updateBudget(id: string, patch: Partial<Omit<Budget, 'id'>>): Promise<void> {
    this.state.budgets = this.state.budgets.map((b) =>
      b.id === id ? { ...b, ...patch } : b,
    )
    this.persist()
  }

  async listCategories(): Promise<Category[]> {
    return [...this.state.categories].sort((a, b) => a.displayOrder - b.displayOrder)
  }
  async createCategory(category: Category): Promise<void> {
    this.state.categories.push(category)
    this.persist()
  }
  async updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>): Promise<void> {
    this.state.categories = this.state.categories.map((c) =>
      c.id === id ? { ...c, ...patch } : c,
    )
    this.persist()
  }
  async deleteCategory(id: string): Promise<void> {
    this.state.categories = this.state.categories.filter((c) => c.id !== id)
    this.state.items = this.state.items.map((i) =>
      i.categoryId === id ? { ...i, categoryId: null } : i,
    )
    this.persist()
  }

  async listItems(): Promise<BudgetItem[]> {
    return [...this.state.items]
  }
  async createItem(item: BudgetItem): Promise<void> {
    this.state.items.push(item)
    this.persist()
  }
  async updateItem(id: string, patch: Partial<Omit<BudgetItem, 'id'>>): Promise<void> {
    this.state.items = this.state.items.map((i) =>
      i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i,
    )
    this.persist()
  }
  async deleteItem(id: string): Promise<void> {
    this.state.items = this.state.items.filter((i) => i.id !== id)
    this.persist()
  }

  async listTransfers(): Promise<Transfer[]> {
    return [...this.state.transfers]
  }
  async createTransfer(transfer: Transfer): Promise<void> {
    this.state.transfers.push(transfer)
    this.persist()
  }
  async updateTransfer(id: string, patch: Partial<Omit<Transfer, 'id'>>): Promise<void> {
    this.state.transfers = this.state.transfers.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t,
    )
    this.persist()
  }
  async deleteTransfer(id: string): Promise<void> {
    this.state.transfers = this.state.transfers.filter((t) => t.id !== id)
    this.persist()
  }

  async listLoans(): Promise<Loan[]> {
    return [...this.state.loans]
  }
  async createLoan(loan: Loan): Promise<void> {
    this.state.loans.push(loan)
    this.persist()
  }
  async updateLoan(id: string, patch: Partial<Omit<Loan, 'id'>>): Promise<void> {
    this.state.loans = this.state.loans.map((l) =>
      l.id === id ? { ...l, ...patch } : l,
    )
    this.persist()
  }
  async deleteLoan(id: string): Promise<void> {
    this.state.loans = this.state.loans.filter((l) => l.id !== id)
    this.persist()
  }

  async getSettings(): Promise<Settings> {
    return this.state.settings
  }
  async updateSettings(patch: Partial<Settings>): Promise<void> {
    this.state.settings = { ...this.state.settings, ...patch }
    this.persist()
  }

  async importData(payload: ExportPayload, mode: 'merge' | 'replace'): Promise<void> {
    if (mode === 'replace') {
      this.state = {
        budgets: payload.budgets,
        categories: payload.categories,
        items: payload.items,
        transfers: payload.transfers,
        loans: payload.loans,
        settings: payload.settings,
      }
    } else {
      const mergeById = <T extends { id: string }>(current: T[], incoming: T[]): T[] => {
        const map = new Map(current.map((row) => [row.id, row]))
        for (const row of incoming) map.set(row.id, row)
        return [...map.values()]
      }
      this.state = {
        budgets: mergeById(this.state.budgets, payload.budgets),
        categories: mergeById(this.state.categories, payload.categories),
        items: mergeById(this.state.items, payload.items),
        transfers: mergeById(this.state.transfers, payload.transfers),
        loans: mergeById(this.state.loans, payload.loans),
        settings: payload.settings,
      }
    }
    this.persist()
  }

  /** Test/debug helper. */
  snapshot(): Snapshot {
    return { ...this.state }
  }
}
