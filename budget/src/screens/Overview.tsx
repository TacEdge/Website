import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock } from 'lucide-react'
import { useBudgets, useCategories, useItems, useLoans, useTransfers } from '@/data/hooks'
import { useViewState } from '@/data/viewState'
import { consolidatedTotals, keyDrivers } from '@/domain/totals'
import { upcomingEvents } from '@/domain/upcoming'
import { PERIOD_LABEL, PERIOD_NOUN } from '@/domain/frequency'
import { formatCents } from '@/domain/money'
import { formatDateShort } from '@/domain/dates'
import { Segmented, InfoDisclosure, Money, Toggle, EmptyState } from '@/components/ui'
import { SummaryFigure, BudgetSummaryCard } from '@/components/financial'
import { IncomeExpenseChart } from '@/components/IncomeExpenseChart'
import { ScreenLoading } from '@/components/states'

export function Overview() {
  const navigate = useNavigate()
  const { period, setPeriod, includeOneOffs, setIncludeOneOffs } = useViewState()
  const budgetsQuery = useBudgets()
  const itemsQuery = useItems()
  const transfersQuery = useTransfers()
  const loansQuery = useLoans()
  const categoriesQuery = useCategories()

  const today = useMemo(() => new Date(), [])
  const options = useMemo(
    () => ({ period, includeOneOffs, today }),
    [period, includeOneOffs, today],
  )

  const loading =
    budgetsQuery.isPending ||
    itemsQuery.isPending ||
    transfersQuery.isPending ||
    loansQuery.isPending ||
    categoriesQuery.isPending

  if (loading) return <ScreenLoading label="Loading your budgets…" />

  const budgets = (budgetsQuery.data ?? []).filter((b) => b.active)
  const items = itemsQuery.data ?? []
  const transfers = transfersQuery.data ?? []
  const loans = loansQuery.data ?? []

  const consolidated = consolidatedTotals(budgets, items, transfers, loans, options)
  const drivers = keyDrivers(items, options)
  const upcoming = upcomingEvents(budgets, items, loans, today).slice(0, 6)
  const hasAnyItems = items.length > 0 || loans.length > 0

  const chartRows = budgets.map((budget) => {
    const totals = consolidated.perBudget.get(budget.id)
    return {
      label: budget.name,
      incomeCents: totals?.incomeCents ?? 0,
      expenseCents: (totals?.expenseCents ?? 0) + (totals?.loanCostCents ?? 0),
    }
  })

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[26px]">Overview</h1>
        <p className="text-[13px] font-light text-moss">
          Consolidated position across Personal, Property and TacEdge.
        </p>
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

      {/* Consolidated summary — net position leads */}
      <section
        aria-label="Consolidated summary"
        className="rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
      >
        <div className="flex items-start justify-between">
          <SummaryFigure
            label={`Net position / ${PERIOD_NOUN[period]}`}
            cents={consolidated.netCents}
            size="lg"
            tone="net"
          />
          <InfoDisclosure label="How this is calculated">
            The consolidated net position is total income minus total expenses
            (including loan repayments and estimated interest) across all three
            budgets for the selected period. Transfers between budgets are
            excluded so money moved between areas is never counted twice.
            {includeOneOffs
              ? ' One-off items dated in the current period are included.'
              : ' One-off items are currently excluded.'}
          </InfoDisclosure>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
          <SummaryFigure label="Total income" cents={consolidated.incomeCents} />
          <SummaryFigure label="Total expenses" cents={consolidated.expenseCents} />
        </div>
        <div className="mt-2 border-t border-line pt-1">
          <Toggle
            label="Include one-off items"
            description="One-offs dated in the current period"
            checked={includeOneOffs}
            onChange={setIncludeOneOffs}
          />
        </div>
      </section>

      {/* Budget cards */}
      <section aria-label="Budgets" className="flex flex-col gap-3">
        {budgets.map((budget) => {
          const totals = consolidated.perBudget.get(budget.id)
          if (!totals) return null
          return (
            <BudgetSummaryCard
              key={budget.id}
              budget={budget}
              totals={totals}
              period={period}
              onOpen={() => navigate(`/b/${budget.slug}`)}
            />
          )
        })}
      </section>

      {!hasAnyItems && (
        <EmptyState
          title="Build your financial picture"
          body="Add your regular income and expenses across Personal, Property and TacEdge. Your consolidated position will update automatically."
        />
      )}

      {/* Contribution to the overall result */}
      {hasAnyItems && (
        <section
          aria-label="Contribution by area"
          className="rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[17px]">Where the result comes from</h2>
            <InfoDisclosure label="About contribution">
              Each area's income minus its expenses for the selected period,
              before transfers between budgets. Together these add up to the
              consolidated net position.
            </InfoDisclosure>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {budgets.map((budget) => {
              const totals = consolidated.perBudget.get(budget.id)
              if (!totals) return null
              const share =
                consolidated.incomeCents > 0
                  ? Math.round((totals.incomeCents / consolidated.incomeCents) * 100)
                  : 0
              return (
                <li
                  key={budget.id}
                  className="flex items-baseline justify-between gap-3 text-[14px]"
                >
                  <span className="font-normal text-ink">{budget.name}</span>
                  <span className="flex items-baseline gap-3">
                    <span className="text-[12px] font-light text-moss">
                      {share}% of income
                    </span>
                    <Money
                      cents={totals.operatingNetCents}
                      signed
                      tone="net"
                      className="text-[14px]"
                    />
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* The one principal chart */}
      {hasAnyItems && (
        <section
          aria-label="Income versus expenses"
          className="rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <h2 className="pb-3 text-[17px]">Income versus expenses</h2>
          <IncomeExpenseChart rows={chartRows} />
        </section>
      )}

      {/* Key drivers */}
      {(drivers.income.length > 0 || drivers.expenses.length > 0) && (
        <section
          aria-label="Key drivers"
          className="rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <h2 className="text-[17px]">Key drivers</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <DriverList title="Largest income" drivers={drivers.income} period={period} />
            <DriverList title="Largest expenses" drivers={drivers.expenses} period={period} />
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section
        aria-label="Upcoming"
        className="rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
      >
        <h2 className="text-[17px]">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-[13px] font-light text-moss">
            Nothing coming up in the next six months. One-off items, fixed-rate
            reviews and end dates will appear here.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {upcoming.map((event) => (
              <li key={event.id} className="flex items-center gap-3 py-2.5">
                <CalendarClock aria-hidden className="size-4 shrink-0 text-moss" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-normal text-ink">{event.title}</p>
                  <p className="text-[12px] font-light text-moss">
                    {event.budgetName} · {event.detail}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] font-normal text-ink">
                  {formatDateShort(event.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function DriverList({
  title,
  drivers,
  period,
}: {
  title: string
  drivers: { item: { id: string; name: string }; perPeriodCents: number }[]
  period: 'weekly' | 'fortnightly' | 'monthly' | 'annual'
}) {
  return (
    <div>
      <h3 className="text-[12px] font-medium uppercase tracking-wide text-moss">{title}</h3>
      {drivers.length === 0 ? (
        <p className="mt-1.5 text-[13px] font-light text-moss">No recurring items yet.</p>
      ) : (
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {drivers.map(({ item, perPeriodCents: cents }) => (
            <li key={item.id} className="flex justify-between gap-3 text-[14px]">
              <span className="truncate font-light text-ink">{item.name}</span>
              <span className="figure shrink-0 text-ink">
                {formatCents(cents)}
                <span className="font-ui text-[11px] font-light text-moss">
                  {' '}/ {PERIOD_NOUN[period]}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
