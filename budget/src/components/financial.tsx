import type { ReactNode } from 'react'
import { ArrowRight, ChevronRight, StickyNote } from 'lucide-react'
import type { Budget, BudgetItem, Category, Loan, Period, Transfer } from '@/domain/types'
import { formatCents, formatCentsWhole } from '@/domain/money'
import {
  FREQUENCY_SUFFIX,
  PERIOD_NOUN,
  perPeriodCents,
} from '@/domain/frequency'
import { formatDateShort } from '@/domain/dates'
import { loanCostIsEstimated, loanPerPeriodCents } from '@/domain/loans'
import type { BudgetTotals } from '@/domain/totals'
import { Money, StatusPill } from './ui'

/* ── Summary figures ─────────────────────────────────────────────── */

export function SummaryFigure({
  label,
  cents,
  size = 'md',
  tone = 'neutral',
  suffix,
}: {
  label: string
  cents: number
  size?: 'md' | 'lg'
  tone?: 'neutral' | 'net'
  suffix?: ReactNode
}) {
  return (
    <div className="min-w-0">
      <p className="text-[12px] font-medium uppercase tracking-wide text-moss">{label}</p>
      <p
        className={`figure truncate ${
          size === 'lg' ? 'text-[34px] leading-tight' : 'text-[21px] leading-snug'
        } ${tone === 'net' ? (cents >= 0 ? 'text-forest' : 'text-brick') : 'text-ink'}`}
      >
        {tone === 'net' && cents > 0 && '+'}
        {formatCents(cents)}
      </p>
      {suffix}
    </div>
  )
}

/* ── Budget summary card (Overview) ──────────────────────────────── */

export function BudgetSummaryCard({
  budget,
  totals,
  period,
  onOpen,
}: {
  budget: Budget
  totals: BudgetTotals
  period: Period
  onOpen: () => void
}) {
  return (
    <button
      onClick={onOpen}
      className="group flex w-full items-stretch gap-3 rounded-lg border border-line bg-card p-4 text-left shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[17px]">{budget.name}</h3>
          <Money
            cents={totals.netCents}
            signed
            tone="net"
            className="text-[17px]"
          />
        </div>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 text-[13px]">
          <div className="flex justify-between gap-2 border-r border-line pr-4">
            <dt className="font-light text-moss">Income</dt>
            <dd className="figure m-0 text-ink">{formatCentsWhole(totals.incomeCents + totals.transfersInCents)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="font-light text-moss">Expenses</dt>
            <dd className="figure m-0 text-ink">
              {formatCentsWhole(totals.expenseCents + totals.loanCostCents + totals.transfersOutCents)}
            </dd>
          </div>
        </dl>
        <p className="mt-1 text-[11px] font-light text-moss">
          per {PERIOD_NOUN[period]}
          {totals.transfersInCents + totals.transfersOutCents > 0 && ', includes transfers'}
        </p>
      </div>
      <ChevronRight
        aria-hidden
        className="my-auto size-5 shrink-0 text-sage transition-colors group-hover:text-moss"
      />
    </button>
  )
}

/* ── Item row ────────────────────────────────────────────────────── */

export function ItemRow({
  item,
  category,
  period,
  onOpen,
}: {
  item: BudgetItem
  category: Category | undefined
  period: Period
  onOpen: () => void
}) {
  const isOneOff = item.frequency === 'one_off'
  const shown = isOneOff
    ? item.amountCents
    : perPeriodCents(item.amountCents, item.frequency, period)

  return (
    <li>
      <button
        onClick={onOpen}
        className="flex min-h-14 w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-sagetint"
      >
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-[15px] font-normal text-ink">
            {item.name}
            {item.notes && (
              <StickyNote aria-label="Has notes" className="size-3.5 shrink-0 text-sage" />
            )}
          </p>
          <p className="truncate text-[12px] font-light text-moss">
            {category?.name ?? 'Uncategorised'}
            {!item.active && ' · Archived'}
            {isOneOff && item.oneOffDate && ` · ${formatDateShort(item.oneOffDate)}`}
          </p>
        </div>
        <div className="text-right">
          <p className="figure text-[15px] text-ink">
            {item.itemType === 'expense' && shown !== 0 ? '-' : ''}
            {formatCents(shown)}
            {!isOneOff && (
              <span className="font-ui text-[11px] font-light text-moss">
                {' '}
                / {PERIOD_NOUN[period]}
              </span>
            )}
          </p>
          <p className="text-[11px] font-light text-moss">
            Entered as {formatCents(item.amountCents)} {FREQUENCY_SUFFIX[item.frequency]}
          </p>
        </div>
      </button>
    </li>
  )
}

/* ── Transfer card ───────────────────────────────────────────────── */

export function TransferCard({
  transfer,
  budgets,
  period,
  perspectiveBudgetId,
  onOpen,
}: {
  transfer: Transfer
  budgets: Budget[]
  period: Period
  perspectiveBudgetId?: string
  onOpen: () => void
}) {
  const source = budgets.find((b) => b.id === transfer.sourceBudgetId)
  const destination = budgets.find((b) => b.id === transfer.destinationBudgetId)
  const isOneOff = transfer.frequency === 'one_off'
  const shown = isOneOff
    ? transfer.amountCents
    : perPeriodCents(transfer.amountCents, transfer.frequency, period)
  const outbound = perspectiveBudgetId === transfer.sourceBudgetId

  return (
    <li>
      <button
        onClick={onOpen}
        className="flex min-h-14 w-full items-center gap-3 rounded-md border border-line bg-sagetint/60 px-3 py-2.5 text-left transition-colors hover:bg-sagetint"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-normal text-ink">{transfer.name}</p>
          <p className="flex items-center gap-1 text-[12px] font-light text-moss">
            {source?.name ?? '—'}
            <ArrowRight aria-label="to" className="size-3" />
            {destination?.name ?? '—'}
            {!transfer.active && ' · Archived'}
          </p>
        </div>
        <div className="text-right">
          <p className="figure text-[15px] text-ink">
            {perspectiveBudgetId ? (outbound ? '-' : '+') : ''}
            {formatCents(shown)}
            {!isOneOff && (
              <span className="font-ui text-[11px] font-light text-moss">
                {' '}
                / {PERIOD_NOUN[period]}
              </span>
            )}
          </p>
          <p className="text-[11px] font-light text-moss">
            Transfer · {formatCents(transfer.amountCents)} {FREQUENCY_SUFFIX[transfer.frequency]}
          </p>
        </div>
      </button>
    </li>
  )
}

/* ── Loan card ───────────────────────────────────────────────────── */

export function LoanCard({
  loan,
  period,
  onOpen,
}: {
  loan: Loan
  period: Period
  onOpen: () => void
}) {
  const estimated = loanCostIsEstimated(loan)
  const cost = loanPerPeriodCents(loan, period)

  return (
    <li>
      <button
        onClick={onOpen}
        className="w-full rounded-lg border border-line bg-card p-4 text-left shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate font-display text-[15px] text-ink">{loan.name}</h4>
            <p className="text-[12px] font-light text-moss">
              {loan.repaymentType === 'interest_only' ? 'Interest only' : 'Principal and interest'}
              {' · '}
              {loan.annualInterestRate.toFixed(2)}% p.a.
              {!loan.active && ' · Archived'}
            </p>
          </div>
          <StatusPill tone={estimated ? 'caution' : 'neutral'}>
            {estimated ? 'Estimated' : 'Scheduled'}
          </StatusPill>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
          <div className="flex justify-between gap-2">
            <dt className="font-light text-moss">Balance</dt>
            <dd className="figure m-0 text-ink">{formatCents(loan.currentBalanceCents)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="font-light text-moss">
              {estimated ? `Est. cost / ${PERIOD_NOUN[period]}` : `Repayment / ${PERIOD_NOUN[period]}`}
            </dt>
            <dd className="figure m-0 text-ink">
              {estimated && '≈ '}
              {formatCents(cost)}
            </dd>
          </div>
          {loan.fixedRateReviewDate && (
            <div className="col-span-2 flex justify-between gap-2">
              <dt className="font-light text-moss">Fixed-rate review</dt>
              <dd className="m-0 font-normal text-ink">
                {formatDateShort(loan.fixedRateReviewDate)}
              </dd>
            </div>
          )}
        </dl>
      </button>
    </li>
  )
}
