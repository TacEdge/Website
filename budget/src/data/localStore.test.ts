import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStore } from './localStore'

const STORAGE_KEY = 'tacedge-budget-demo-v1'

function storeWithBudgetName(name: string): LocalStore {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      budgets: [
        { id: 'b1', name, slug: 'tacedge', displayOrder: 2, icon: null, active: true, cashBalanceCents: null },
      ],
      categories: [],
      items: [],
      transfers: [],
      loans: [],
      settings: { defaultPeriod: 'monthly', currency: 'NZD', includeOneOffs: true, preferredTheme: 'light' },
    }),
  )
  return new LocalStore()
}

describe('LocalStore legacy budget names', () => {
  beforeEach(() => localStorage.clear())

  it('renames the untouched TacEdge default to TAC-EDGE', async () => {
    const store = storeWithBudgetName('TacEdge')
    expect(await store.seedIfNeeded()).toBe(false)
    expect((await store.listBudgets())[0]?.name).toBe('TAC-EDGE')
    expect(new LocalStore().snapshot().budgets[0]?.name).toBe('TAC-EDGE')
  })

  it('leaves a user-chosen name alone', async () => {
    const store = storeWithBudgetName('My Company')
    await store.seedIfNeeded()
    expect((await store.listBudgets())[0]?.name).toBe('My Company')
  })
})
