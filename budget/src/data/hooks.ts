import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import type {
  Budget,
  BudgetItem,
  Category,
  Loan,
  Settings,
  Transfer,
} from '@/domain/types'
import { useStore } from './AppProviders'
import type { ExportPayload } from './store'
import { syncState } from './syncState'

export const keys = {
  budgets: ['budgets'] as const,
  categories: ['categories'] as const,
  items: ['items'] as const,
  transfers: ['transfers'] as const,
  loans: ['loans'] as const,
  settings: ['settings'] as const,
  seeded: ['seeded'] as const,
}

/** Runs the idempotent first-run seed before anything else loads. */
export function useSeed() {
  const store = useStore()
  return useQuery({
    queryKey: keys.seeded,
    queryFn: async () => {
      const seeded = await store.seedIfNeeded()
      syncState.loaded()
      return { seeded }
    },
    staleTime: Infinity,
    retry: 2,
  })
}

export function useBudgets() {
  const store = useStore()
  return useQuery({ queryKey: keys.budgets, queryFn: () => store.listBudgets() })
}

export function useCategories() {
  const store = useStore()
  return useQuery({ queryKey: keys.categories, queryFn: () => store.listCategories() })
}

export function useItems() {
  const store = useStore()
  return useQuery({ queryKey: keys.items, queryFn: () => store.listItems() })
}

export function useTransfers() {
  const store = useStore()
  return useQuery({ queryKey: keys.transfers, queryFn: () => store.listTransfers() })
}

export function useLoans() {
  const store = useStore()
  return useQuery({ queryKey: keys.loans, queryFn: () => store.listLoans() })
}

export function useSettings() {
  const store = useStore()
  return useQuery({ queryKey: keys.settings, queryFn: () => store.getSettings() })
}

type Keys = (readonly string[])[]

function useTrackedMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<void>,
  invalidates: Keys,
): UseMutationResult<void, Error, TVariables> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onMutate: () => syncState.begin(),
    onSuccess: () => syncState.success(),
    onError: (error) => syncState.failure(error.message),
    onSettled: () => {
      for (const key of invalidates) {
        void queryClient.invalidateQueries({ queryKey: key })
      }
    },
  })
}

/* Items */
export function useCreateItem() {
  const store = useStore()
  return useTrackedMutation((item: BudgetItem) => store.createItem(item), [keys.items])
}
export function useUpdateItem() {
  const store = useStore()
  return useTrackedMutation(
    ({ id, patch }: { id: string; patch: Partial<Omit<BudgetItem, 'id'>> }) =>
      store.updateItem(id, patch),
    [keys.items],
  )
}
export function useDeleteItem() {
  const store = useStore()
  return useTrackedMutation((id: string) => store.deleteItem(id), [keys.items])
}

/* Transfers */
export function useCreateTransfer() {
  const store = useStore()
  return useTrackedMutation(
    (transfer: Transfer) => store.createTransfer(transfer),
    [keys.transfers],
  )
}
export function useUpdateTransfer() {
  const store = useStore()
  return useTrackedMutation(
    ({ id, patch }: { id: string; patch: Partial<Omit<Transfer, 'id'>> }) =>
      store.updateTransfer(id, patch),
    [keys.transfers],
  )
}
export function useDeleteTransfer() {
  const store = useStore()
  return useTrackedMutation((id: string) => store.deleteTransfer(id), [keys.transfers])
}

/* Loans */
export function useCreateLoan() {
  const store = useStore()
  return useTrackedMutation((loan: Loan) => store.createLoan(loan), [keys.loans])
}
export function useUpdateLoan() {
  const store = useStore()
  return useTrackedMutation(
    ({ id, patch }: { id: string; patch: Partial<Omit<Loan, 'id'>> }) =>
      store.updateLoan(id, patch),
    [keys.loans],
  )
}
export function useDeleteLoan() {
  const store = useStore()
  return useTrackedMutation((id: string) => store.deleteLoan(id), [keys.loans])
}

/* Categories */
export function useCreateCategory() {
  const store = useStore()
  return useTrackedMutation(
    (category: Category) => store.createCategory(category),
    [keys.categories],
  )
}
export function useUpdateCategory() {
  const store = useStore()
  return useTrackedMutation(
    ({ id, patch }: { id: string; patch: Partial<Omit<Category, 'id'>> }) =>
      store.updateCategory(id, patch),
    [keys.categories],
  )
}
export function useDeleteCategory() {
  const store = useStore()
  return useTrackedMutation(
    (id: string) => store.deleteCategory(id),
    [keys.categories, keys.items],
  )
}

/* Budgets & settings */
export function useUpdateBudget() {
  const store = useStore()
  return useTrackedMutation(
    ({ id, patch }: { id: string; patch: Partial<Omit<Budget, 'id'>> }) =>
      store.updateBudget(id, patch),
    [keys.budgets],
  )
}
export function useUpdateSettings() {
  const store = useStore()
  return useTrackedMutation(
    (patch: Partial<Settings>) => store.updateSettings(patch),
    [keys.settings],
  )
}

export function useImportData() {
  const store = useStore()
  return useTrackedMutation(
    ({ payload, mode }: { payload: ExportPayload; mode: 'merge' | 'replace' }) =>
      store.importData(payload, mode),
    [keys.budgets, keys.categories, keys.items, keys.transfers, keys.loans, keys.settings],
  )
}
