import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowDown, ArrowUp, ListFilter, Plus } from 'lucide-react'
import type { BudgetItem, Category, SortMode, Transfer } from '@/domain/types'
import {
  useBudgets,
  useCategories,
  useItems,
  useLoans,
  useTransfers,
  useUpdateItem,
  useUpdateBudget,
} from '@/data/hooks'
import { useViewState } from '@/data/viewState'
import { budgetTotals, isOneOffInWindow } from '@/domain/totals'
import { runwaySummary } from '@/domain/runway'
import { PERIOD_LABEL, PERIOD_NOUN } from '@/domain/frequency'
import { formatCents, parseDollarsToCents, centsToDollarsInput } from '@/domain/money'
import {
  Segmented,
  SearchField,
  FilterChip,
  EmptyState,
  Button,
  InfoDisclosure,
  CurrencyInput,
  Field,
} from '@/components/ui'
import { SummaryFigure, ItemRow, TransferCard, LoanCard } from '@/components/financial'
import { ScreenLoading, ScreenError } from '@/components/states'
import { ItemSheet } from '@/forms/ItemSheet'
import { LoanSheet } from '@/forms/LoanSheet'
import { Sheet } from '@/components/Sheet'
import { useToast } from '@/components/Toast'
import type { Loan } from '@/domain/types'

type TypeFilter = 'all' | 'income' | 'expense' | 'transfer'
type ActiveFilter = 'active' | 'archived' | 'all'
type RecurrenceFilter = 'all' | 'recurring' | 'one_off'

const SORT_LABEL: Record<SortMode, string> = {
  custom: 'Custom order',
  largest: 'Largest amount',
  smallest: 'Smallest amount',
  alphabetical: 'Alphabetical',
  next_due: 'Next due',
  recently_edited: 'Recently edited',
}

export function BudgetScreen() {
  const { slug } = useParams<{ slug: string }>()
  const { period, setPeriod, includeOneOffs } = useViewState()
  const budgetsQuery = useBudgets()
  const itemsQuery = useItems()
  const transfersQuery = useTransfers()
  const loansQuery = useLoans()
  const categoriesQuery = useCategories()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('active')
  const [recurrenceFilter, setRecurrenceFilter] = useState<RecurrenceFilter>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [reordering, setReordering] = useState(false)
  const { sortMode, setSortMode } = useViewState()

  const [sheet, setSheet] = useState<
    | { kind: 'closed' }
    | { kind: 'new'; type: 'income' | 'expense' | 'transfer' }
    | { kind: 'item'; item: BudgetItem }
    | { kind: 'transfer'; transfer: Transfer }
    | { kind: 'loan'; loan: Loan | null }
    | { kind: 'cash' }
  >({ kind: 'closed' })

  const today = useMemo(() => new Date(), [])

  const loading =
    budgetsQuery.isPending ||
    itemsQuery.isPending ||
    transfersQuery.isPending ||
    loansQuery.isPending ||
    categoriesQuery.isPending

  if (loading) return <ScreenLoading label="Loading budget…" />

  const budgets = budgetsQuery.data ?? []
  const budget = budgets.find((b) => b.slug === slug)
  if (!budget) {
    return (
      <ScreenError
        title="Budget not found"
        body="This budget doesn't exist. Use the navigation to pick one of your budgets."
      />
    )
  }

  const allItems = itemsQuery.data ?? []
  const allTransfers = transfersQuery.data ?? []
  const allLoans = loansQuery.data ?? []
  const categories = (categoriesQuery.data ?? []).filter((c) => c.budgetId === budget.id)

  const options = { period, includeOneOffs, today }
  const totals = budgetTotals(budget.id, allItems, allTransfers, allLoans, options)

  const budgetItems = allItems.filter((i) => i.budgetId === budget.id)
  const budgetTransfers = allTransfers.filter(
    (t) => t.sourceBudgetId === budget.id || t.destinationBudgetId === budget.id,
  )
  const budgetLoans = allLoans.filter((l) => l.budgetId === budget.id)

  /* Filtering */
  const q = search.trim().toLowerCase()
  const matchesFilters = (item: BudgetItem): boolean => {
    if (q && !item.name.toLowerCase().includes(q)) return false
    if (typeFilter === 'transfer') return false
    if (typeFilter !== 'all' && item.itemType !== typeFilter) return false
    if (categoryFilter && item.categoryId !== categoryFilter) return false
    if (activeFilter === 'active' && !item.active) return false
    if (activeFilter === 'archived' && item.active) return false
    if (recurrenceFilter === 'recurring' && item.frequency === 'one_off') return false
    if (recurrenceFilter === 'one_off' && item.frequency !== 'one_off') return false
    return true
  }
  const matchesTransferFilters = (transfer: Transfer): boolean => {
    if (q && !transfer.name.toLowerCase().includes(q)) return false
    if (typeFilter !== 'all' && typeFilter !== 'transfer') return false
    if (categoryFilter) return false
    if (activeFilter === 'active' && !transfer.active) return false
    if (activeFilter === 'archived' && transfer.active) return false
    if (recurrenceFilter === 'recurring' && transfer.frequency === 'one_off') return false
    if (recurrenceFilter === 'one_off' && transfer.frequency !== 'one_off') return false
    return true
  }

  const sortItems = (items: BudgetItem[]): BudgetItem[] => {
    const sorted = [...items]
    switch (sortMode) {
      case 'largest':
        return sorted.sort((a, b) => b.amountCents - a.amountCents)
      case 'smallest':
        return sorted.sort((a, b) => a.amountCents - b.amountCents)
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'next_due':
        return sorted.sort((a, b) =>
          (a.oneOffDate ?? a.reminderDate ?? a.endDate ?? '9999').localeCompare(
            b.oneOffDate ?? b.reminderDate ?? b.endDate ?? '9999',
          ),
        )
      case 'recently_edited':
        return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      default:
        return sorted.sort((a, b) => a.displayOrder - b.displayOrder)
    }
  }

  const recurring = (type: 'income' | 'expense') =>
    sortItems(
      budgetItems.filter((i) => i.itemType === type && i.frequency !== 'one_off' && matchesFilters(i)),
    )
  const incomeItems = recurring('income')
  const expenseItems = recurring('expense')
  const oneOffItems = sortItems(
    budgetItems.filter((i) => i.frequency === 'one_off' && matchesFilters(i)),
  ).sort((a, b) => (a.oneOffDate ?? '').localeCompare(b.oneOffDate ?? ''))
  const visibleTransfers = budgetTransfers.filter(matchesTransferFilters)

  const filtersActive =
    typeFilter !== 'all' ||
    categoryFilter !== null ||
    activeFilter !== 'active' ||
    recurrenceFilter !== 'all'
  const anyVisible =
    incomeItems.length + expenseItems.length + oneOffItems.length + visibleTransfers.length > 0
  const hasAnything = budgetItems.length + budgetTransfers.length > 0

  const isTacEdge = budget.slug === 'tacedge'
  const isProperty = budget.slug === 'property'
  const runway = isTacEdge
    ? runwaySummary(budget.id, allItems, categories, allTransfers, allLoans, budget.cashBalanceCents)
    : null

  const categoryFor = (item: BudgetItem) =>
    categories.find((c) => c.id === item.categoryId)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px]">{budget.name}</h1>
          <p className="text-[13px] font-light text-moss">
            {PERIOD_LABEL[period]} view
          </p>
        </div>
        <Button variant="primary" onClick={() => setSheet({ kind: 'new', type: 'expense' })}>
          <Plus aria-hidden className="size-4" /> Add item
        </Button>
      </header>

      <Segmented
        label="Reporting period"
        value={period}
        onChange={setPeriod}
        options={(['weekly', 'fortnightly', 'monthly', 'annual'] as const).map((p) => ({
          value: p,
          label: PERIOD_LABEL[p],
        }))}
      />

      {/* Budget summary */}
      <section
        aria-label={`${budget.name} summary`}
        className="rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
      >
        <div className="flex items-start justify-between">
          <SummaryFigure
            label={`Net position / ${PERIOD_NOUN[period]}`}
            cents={totals.netCents}
            size="lg"
            tone="net"
          />
          <InfoDisclosure label="How this is calculated">
            Income {formatCents(totals.incomeCents)} minus expenses{' '}
            {formatCents(totals.expenseCents)}
            {totals.loanCostCents > 0 && (
              <> minus loan costs {formatCents(totals.loanCostCents)}</>
            )}
            {totals.transfersInCents > 0 && (
              <>, plus transfers in {formatCents(totals.transfersInCents)}</>
            )}
            {totals.transfersOutCents > 0 && (
              <>, less transfers out {formatCents(totals.transfersOutCents)}</>
            )}
            , per {PERIOD_NOUN[period]}.{' '}
            {includeOneOffs
              ? 'One-off items dated in the current period are included.'
              : 'One-off items are excluded.'}
          </InfoDisclosure>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
          <SummaryFigure label="Income" cents={totals.incomeCents + totals.transfersInCents} />
          <SummaryFigure
            label="Expenses"
            cents={totals.expenseCents + totals.loanCostCents + totals.transfersOutCents}
          />
        </div>
      </section>

      {/* TacEdge: operating summary and runway */}
      {runway && (
        <section
          aria-label="Operating summary and runway"
          className="rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[17px]">Operating position</h2>
            <InfoDisclosure label="About runway">
              Runway is your entered cash balance divided by the average monthly
              net cash burn (recurring operating expenses minus recurring
              operating revenue). Founder or investment funding and transfers in
              are not operating revenue, so they don't reduce the burn. Runway
              only shows while expenses exceed operating income.
            </InfoDisclosure>
          </div>
          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
            <SummaryRow label="Recurring revenue / month" cents={runway.monthlyOperatingIncomeCents} />
            <SummaryRow label="Operating expenses / month" cents={runway.monthlyOperatingExpenseCents} />
            <SummaryRow label="Monthly operating result" cents={runway.monthlyOperatingNetCents} net />
            {runway.monthlyFinancingInCents > 0 && (
              <SummaryRow label="Financing in / month" cents={runway.monthlyFinancingInCents} />
            )}
          </dl>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wide text-moss">Cash balance</p>
              <p className="figure text-[21px] text-ink">
                {budget.cashBalanceCents == null ? '—' : formatCents(budget.cashBalanceCents)}
              </p>
              {budget.cashBalanceCents == null && (
                <p className="text-[12px] font-light text-moss">Enter your cash balance to see runway.</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[12px] font-medium uppercase tracking-wide text-moss">Estimated runway</p>
              {runway.runwayMonths == null ? (
                <p className="text-[15px] font-normal text-moss">Runway unavailable</p>
              ) : (
                <p className="figure text-[21px] text-ink">
                  ≈ {runway.runwayMonths.toFixed(1)} months
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={() => setSheet({ kind: 'cash' })}>
              Update cash balance
            </Button>
          </div>
          {runway.runwayMonths == null && runway.monthlyOperatingNetCents >= 0 && (
            <p className="mt-2 text-[12px] font-light text-moss">
              Operating income currently covers expenses, so there is no cash burn to measure.
            </p>
          )}
        </section>
      )}

      {/* Search, filters, sort */}
      <section aria-label="Search and filters" className="flex flex-col gap-3">
        <SearchField value={search} onChange={setSearch} placeholder="Search items" />
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <FilterChip selected={filtersOpen || filtersActive} onClick={() => setFiltersOpen(true)}>
            <ListFilter aria-hidden className="size-3.5" />
            Filters{filtersActive ? ' on' : ''}
          </FilterChip>
          {(['all', 'income', 'expense', 'transfer'] as const).map((t) => (
            <FilterChip key={t} selected={typeFilter === t} onClick={() => setTypeFilter(t)}>
              {t === 'all' ? 'All' : t[0]!.toUpperCase() + t.slice(1)}
            </FilterChip>
          ))}
          <FilterChip selected={reordering} onClick={() => setReordering((r) => !r)}>
            Reorder
          </FilterChip>
        </div>
      </section>

      {!hasAnything && (
        <EmptyState
          title={`No items in ${budget.name} yet`}
          body="Add your first income or expense to start building this budget."
          action={
            <div className="flex gap-2.5">
              <Button variant="primary" onClick={() => setSheet({ kind: 'new', type: 'income' })}>
                Add income
              </Button>
              <Button variant="secondary" onClick={() => setSheet({ kind: 'new', type: 'expense' })}>
                Add expense
              </Button>
            </div>
          }
        />
      )}

      {hasAnything && !anyVisible && (
        <EmptyState
          title="No matching items"
          body="Nothing matches your search or filters. Try clearing them."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearch('')
                setTypeFilter('all')
                setCategoryFilter(null)
                setActiveFilter('active')
                setRecurrenceFilter('all')
              }}
            >
              Clear search and filters
            </Button>
          }
        />
      )}

      {/* Income */}
      {(incomeItems.length > 0 || (hasAnything && typeFilter === 'income')) && (
        <ItemSection
          title="Income"
          items={incomeItems}
          emptyText="No income items added yet."
          period={period}
          reordering={reordering && sortMode === 'custom'}
          categoryFor={categoryFor}
          onOpen={(item) => setSheet({ kind: 'item', item })}
        />
      )}

      {/* Expenses */}
      {(expenseItems.length > 0 || (hasAnything && typeFilter === 'expense')) && (
        <ItemSection
          title="Expenses"
          items={expenseItems}
          emptyText="No expenses added yet. Add your first expense to start building this budget."
          period={period}
          reordering={reordering && sortMode === 'custom'}
          categoryFor={categoryFor}
          onOpen={(item) => setSheet({ kind: 'item', item })}
        />
      )}

      {/* Transfers */}
      {visibleTransfers.length > 0 && (
        <section aria-label="Transfers">
          <h2 className="pb-2 text-[17px]">Transfers</h2>
          <ul className="flex flex-col gap-2">
            {visibleTransfers.map((transfer) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                budgets={budgets}
                period={period}
                perspectiveBudgetId={budget.id}
                onOpen={() => setSheet({ kind: 'transfer', transfer })}
              />
            ))}
          </ul>
        </section>
      )}

      {/* One-off items */}
      {oneOffItems.length > 0 && (
        <section aria-label="One-off items">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-[17px]">One-off items</h2>
            <InfoDisclosure label="About one-off items">
              One-off items sit outside the recurring baseline. They count
              towards totals only in the period their date falls in, and only
              while “Include one-off items” is switched on (see Overview).
            </InfoDisclosure>
          </div>
          <ul className="flex flex-col rounded-lg border border-line bg-card py-1 shadow-[var(--shadow-card)]">
            {oneOffItems.map((item) => (
              <li key={item.id} className={isOneOffInWindow(item, options) ? '' : 'opacity-70'}>
                <ItemRow
                  item={item}
                  category={categoryFor(item)}
                  period={period}
                  onOpen={() => setSheet({ kind: 'item', item })}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Property: loans */}
      {isProperty && (
        <section aria-label="Loans">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-[17px]">Loans</h2>
            <Button variant="ghost" onClick={() => setSheet({ kind: 'loan', loan: null })}>
              <Plus aria-hidden className="size-4" /> Add loan
            </Button>
          </div>
          {budgetLoans.length === 0 ? (
            <EmptyState
              title="No loans recorded"
              body="Add a loan to include its repayments or estimated interest in this budget."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {budgetLoans.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  period={period}
                  onOpen={() => setSheet({ kind: 'loan', loan })}
                />
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Sheets */}
      <ItemSheet
        open={sheet.kind === 'new' || sheet.kind === 'item' || sheet.kind === 'transfer'}
        onClose={() => setSheet({ kind: 'closed' })}
        budgets={budgets}
        categories={categoriesQuery.data ?? []}
        item={sheet.kind === 'item' ? sheet.item : null}
        transfer={sheet.kind === 'transfer' ? sheet.transfer : null}
        defaultBudgetId={budget.id}
        defaultType={sheet.kind === 'new' ? sheet.type : 'expense'}
      />
      {isProperty && (
        <LoanSheet
          open={sheet.kind === 'loan'}
          onClose={() => setSheet({ kind: 'closed' })}
          budgetId={budget.id}
          loan={sheet.kind === 'loan' ? sheet.loan : null}
        />
      )}
      {isTacEdge && (
        <CashBalanceSheet
          open={sheet.kind === 'cash'}
          onClose={() => setSheet({ kind: 'closed' })}
          budgetId={budget.id}
          currentCents={budget.cashBalanceCents}
        />
      )}

      {/* Filters sheet */}
      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters and sorting">
        <div className="flex flex-col gap-5 pb-4">
          <Field label="Category" htmlFor="filter-category">
            <select
              id="filter-category"
              value={categoryFilter ?? ''}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
              className="min-h-12 w-full rounded-md border border-line bg-card px-3.5 text-[16px] font-normal text-ink"
            >
              <option value="">All categories</option>
              {categories
                .filter((c) => c.active)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Status" htmlFor="filter-status">
            <select
              id="filter-status"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
              className="min-h-12 w-full rounded-md border border-line bg-card px-3.5 text-[16px] font-normal text-ink"
            >
              <option value="active">Active only</option>
              <option value="archived">Archived only</option>
              <option value="all">Active and archived</option>
            </select>
          </Field>
          <Field label="Recurrence" htmlFor="filter-recurrence">
            <select
              id="filter-recurrence"
              value={recurrenceFilter}
              onChange={(e) => setRecurrenceFilter(e.target.value as RecurrenceFilter)}
              className="min-h-12 w-full rounded-md border border-line bg-card px-3.5 text-[16px] font-normal text-ink"
            >
              <option value="all">Recurring and one-off</option>
              <option value="recurring">Recurring only</option>
              <option value="one_off">One-off only</option>
            </select>
          </Field>
          <Field label="Sort by" htmlFor="filter-sort">
            <select
              id="filter-sort"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="min-h-12 w-full rounded-md border border-line bg-card px-3.5 text-[16px] font-normal text-ink"
            >
              {(Object.keys(SORT_LABEL) as SortMode[]).map((mode) => (
                <option key={mode} value={mode}>
                  {SORT_LABEL[mode]}
                </option>
              ))}
            </select>
          </Field>
          <Button variant="primary" onClick={() => setFiltersOpen(false)}>
            Done
          </Button>
        </div>
      </Sheet>
    </div>
  )
}

function SummaryRow({ label, cents, net = false }: { label: string; cents: number; net?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="font-light text-moss">{label}</dt>
      <dd className={`figure m-0 ${net ? (cents >= 0 ? 'text-forest' : 'text-brick') : 'text-ink'}`}>
        {net && cents > 0 && '+'}
        {formatCents(cents)}
      </dd>
    </div>
  )
}

function ItemSection({
  title,
  items,
  emptyText,
  period,
  reordering,
  categoryFor,
  onOpen,
}: {
  title: string
  items: BudgetItem[]
  emptyText: string
  period: 'weekly' | 'fortnightly' | 'monthly' | 'annual'
  reordering: boolean
  categoryFor: (item: BudgetItem) => Category | undefined
  onOpen: (item: BudgetItem) => void
}) {
  const updateItem = useUpdateItem()
  const toast = useToast()

  async function move(index: number, direction: -1 | 1) {
    const a = items[index]
    const b = items[index + direction]
    if (!a || !b) return
    try {
      await Promise.all([
        updateItem.mutateAsync({ id: a.id, patch: { displayOrder: b.displayOrder } }),
        updateItem.mutateAsync({ id: b.id, patch: { displayOrder: a.displayOrder } }),
      ])
    } catch {
      toast('Unable to reorder. Check your connection and try again.', 'error')
    }
  }

  return (
    <section aria-label={title}>
      <h2 className="pb-2 text-[17px]">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line px-4 py-5 text-center text-[13px] font-light text-moss">
          {emptyText}
        </p>
      ) : (
        <ul className="flex flex-col rounded-lg border border-line bg-card py-1 shadow-[var(--shadow-card)]">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center">
              {reordering && (
                <span className="flex flex-col pl-1.5">
                  <button
                    aria-label={`Move ${item.name} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="flex size-8 items-center justify-center text-moss disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    aria-label={`Move ${item.name} down`}
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                    className="flex size-8 items-center justify-center text-moss disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </span>
              )}
              <div className="min-w-0 flex-1">
                <ItemRow
                  item={item}
                  category={categoryFor(item)}
                  period={period}
                  onOpen={() => onOpen(item)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function CashBalanceSheet({
  open,
  onClose,
  budgetId,
  currentCents,
}: {
  open: boolean
  onClose: () => void
  budgetId: string
  currentCents: number | null
}) {
  const updateBudget = useUpdateBudget()
  const toast = useToast()
  const [value, setValue] = useState(
    currentCents == null ? '' : centsToDollarsInput(currentCents),
  )

  return (
    <Sheet open={open} onClose={onClose} title="Cash balance">
      <div className="flex flex-col gap-4 pb-4">
        <p className="text-[13px] font-light text-moss">
          Enter the TacEdge cash balance manually. It is used to estimate runway
          and is not read from your bank.
        </p>
        <Field label="Cash balance" htmlFor="cash-balance">
          <CurrencyInput
            id="cash-balance"
            value={value}
            placeholder="0.00"
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Button
          variant="primary"
          onClick={async () => {
            const cents = value.trim() === '' ? null : parseDollarsToCents(value)
            if (value.trim() !== '' && cents == null) {
              toast('Enter a valid amount, or leave blank to clear.', 'error')
              return
            }
            try {
              await updateBudget.mutateAsync({
                id: budgetId,
                patch: { cashBalanceCents: cents },
              })
              toast('Cash balance updated')
              onClose()
            } catch {
              toast('Unable to save. Check your connection and try again.', 'error')
            }
          }}
        >
          Save
        </Button>
      </div>
    </Sheet>
  )
}
