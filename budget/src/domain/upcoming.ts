import { addMonths, isAfter, isBefore, parseISO } from 'date-fns'
import type { Budget, BudgetItem, Loan } from './types'
import { formatCents } from './money'

export interface UpcomingEvent {
  id: string
  date: string
  title: string
  detail: string
  budgetName: string
  kind: 'one_off' | 'rate_review' | 'interest_only_end' | 'item_end' | 'reminder'
  amountCents: number | null
}

/**
 * Forward-looking dates worth seeing on the Overview: one-off items,
 * fixed-rate reviews, interest-only end dates, item end dates and
 * reminders — within the next `monthsAhead` months.
 */
export function upcomingEvents(
  budgets: Budget[],
  items: BudgetItem[],
  loans: Loan[],
  today: Date,
  monthsAhead = 6,
): UpcomingEvent[] {
  const horizon = addMonths(today, monthsAhead)
  const events: UpcomingEvent[] = []
  const budgetName = (id: string) => budgets.find((b) => b.id === id)?.name ?? ''
  const inWindow = (iso: string) => {
    const date = parseISO(iso)
    return !isBefore(date, today) && !isAfter(date, horizon)
  }

  for (const item of items) {
    if (!item.active) continue
    if (item.frequency === 'one_off' && item.oneOffDate && inWindow(item.oneOffDate)) {
      events.push({
        id: `oneoff-${item.id}`,
        date: item.oneOffDate,
        title: item.name,
        detail: `One-off ${item.itemType} · ${formatCents(item.amountCents)}`,
        budgetName: budgetName(item.budgetId),
        kind: 'one_off',
        amountCents: item.amountCents,
      })
    }
    if (item.endDate && inWindow(item.endDate)) {
      events.push({
        id: `end-${item.id}`,
        date: item.endDate,
        title: `${item.name} ends`,
        detail: `Recurring ${item.itemType} finishes`,
        budgetName: budgetName(item.budgetId),
        kind: 'item_end',
        amountCents: null,
      })
    }
    if (item.reminderDate && inWindow(item.reminderDate)) {
      events.push({
        id: `reminder-${item.id}`,
        date: item.reminderDate,
        title: `Review ${item.name}`,
        detail: 'Reminder',
        budgetName: budgetName(item.budgetId),
        kind: 'reminder',
        amountCents: null,
      })
    }
  }

  for (const loan of loans) {
    if (!loan.active) continue
    if (loan.fixedRateReviewDate && inWindow(loan.fixedRateReviewDate)) {
      events.push({
        id: `review-${loan.id}`,
        date: loan.fixedRateReviewDate,
        title: `${loan.name} — fixed-rate review`,
        detail: `Currently ${loan.annualInterestRate.toFixed(2)}% p.a.`,
        budgetName: budgetName(loan.budgetId),
        kind: 'rate_review',
        amountCents: null,
      })
    }
    if (loan.interestOnlyEndDate && inWindow(loan.interestOnlyEndDate)) {
      events.push({
        id: `ioend-${loan.id}`,
        date: loan.interestOnlyEndDate,
        title: `${loan.name} — interest-only period ends`,
        detail: 'Repayments will change',
        budgetName: budgetName(loan.budgetId),
        kind: 'interest_only_end',
        amountCents: null,
      })
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date))
}
