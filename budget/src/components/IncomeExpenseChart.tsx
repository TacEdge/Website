import { formatCentsWhole } from '@/domain/money'

interface ChartRow {
  label: string
  incomeCents: number
  expenseCents: number
}

/**
 * The one principal chart: a restrained horizontal income-vs-expenses
 * comparison per budget area. Income = forest, expenses = moss; every bar
 * carries a direct value label so colour is never the only signal, and the
 * same data is available as figures elsewhere on the screen.
 */
export function IncomeExpenseChart({ rows }: { rows: ChartRow[] }) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.incomeCents, r.expenseCents]))
  const width = (cents: number) => Math.max(cents > 0 ? 2 : 0, (cents / max) * 100)

  return (
    <div>
      <div className="flex items-center gap-4 pb-3" aria-hidden>
        <LegendSwatch colour="bg-forest" label="Income" />
        <LegendSwatch colour="bg-moss" label="Expenses" />
      </div>
      <dl className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="pb-1 text-[12px] font-medium text-moss">{row.label}</dt>
            <dd className="m-0 flex flex-col gap-[3px]">
              <Bar
                widthPercent={width(row.incomeCents)}
                colour="bg-forest"
                label={`Income ${formatCentsWhole(row.incomeCents)}`}
                value={formatCentsWhole(row.incomeCents)}
              />
              <Bar
                widthPercent={width(row.expenseCents)}
                colour="bg-moss"
                label={`Expenses ${formatCentsWhole(row.expenseCents)}`}
                value={formatCentsWhole(row.expenseCents)}
              />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function LegendSwatch({ colour, label }: { colour: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-normal text-ink">
      <span className={`inline-block h-2.5 w-2.5 rounded-[3px] ${colour}`} />
      {label}
    </span>
  )
}

function Bar({
  widthPercent,
  colour,
  label,
  value,
}: {
  widthPercent: number
  colour: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={label}>
      <div className="h-[14px] flex-1">
        <div
          className={`h-full rounded-r-[4px] ${colour}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <span className="figure w-24 shrink-0 text-right text-[12px] text-ink">
        {value}
      </span>
    </div>
  )
}
