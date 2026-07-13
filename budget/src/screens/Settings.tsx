import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Upload } from 'lucide-react'
import { format } from 'date-fns'
import type { Category, ItemType, Period } from '@/domain/types'
import {
  useBudgets,
  useCategories,
  useItems,
  useLoans,
  useSettings,
  useTransfers,
  useUpdateSettings,
  useImportData,
} from '@/data/hooks'
import { useAppState, useStore } from '@/data/AppProviders'
import { useSyncState } from '@/data/syncState'
import {
  buildExportPayload,
  downloadFile,
  itemsCsv,
  loansCsv,
  transfersCsv,
  validateImport,
  type ImportValidation,
} from '@/domain/backup'
import { PERIOD_LABEL } from '@/domain/frequency'
import { Button, Field, SelectInput, Toggle } from '@/components/ui'
import { Sheet } from '@/components/Sheet'
import { useToast } from '@/components/Toast'
import { ScreenLoading } from '@/components/states'
import { CategoryManager } from '@/forms/CategoryManager'
import { ItemSheet } from '@/forms/ItemSheet'
import type { BudgetItem, Transfer } from '@/domain/types'

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '1.0.0'

export function Settings() {
  const navigate = useNavigate()
  const { mode, signOut } = useAppState()
  const store = useStore()
  const toast = useToast()
  const sync = useSyncState()

  const budgetsQuery = useBudgets()
  const categoriesQuery = useCategories()
  const itemsQuery = useItems()
  const transfersQuery = useTransfers()
  const loansQuery = useLoans()
  const settingsQuery = useSettings()
  const updateSettings = useUpdateSettings()
  const importData = useImportData()

  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const [importState, setImportState] = useState<ImportValidation | null>(null)
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge')
  const [editEntry, setEditEntry] = useState<
    { item: BudgetItem } | { transfer: Transfer } | null
  >(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const loading =
    budgetsQuery.isPending ||
    categoriesQuery.isPending ||
    itemsQuery.isPending ||
    transfersQuery.isPending ||
    loansQuery.isPending ||
    settingsQuery.isPending
  if (loading) return <ScreenLoading label="Loading settings…" />

  const budgets = budgetsQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const items = itemsQuery.data ?? []
  const transfers = transfersQuery.data ?? []
  const loans = loansQuery.data ?? []
  const settings = settingsQuery.data!

  const archivedItems = items.filter((i) => !i.active)
  const archivedTransfers = transfers.filter((t) => !t.active)

  const stamp = format(new Date(), 'yyyy-MM-dd')

  function exportJson() {
    const payload = buildExportPayload({ budgets, categories, items, transfers, loans, settings })
    downloadFile(`tacedge-budget-backup-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json')
    toast('Backup downloaded')
  }

  function exportBudgetCsv(budgetId: string | null, name: string) {
    const subset = budgetId ? items.filter((i) => i.budgetId === budgetId) : items
    downloadFile(`tacedge-budget-${name}-${stamp}.csv`, itemsCsv(subset, budgets, categories), 'text/csv')
    if (!budgetId && transfers.length > 0) {
      downloadFile(`tacedge-budget-transfers-${stamp}.csv`, transfersCsv(transfers, budgets), 'text/csv')
    }
    toast('CSV downloaded')
  }

  async function onImportFile(file: File) {
    const text = await file.text()
    const result = validateImport(text)
    setImportState(result)
    setImportMode('merge')
  }

  const duplicateWarning = useMemo(() => {
    if (!importState?.ok || !importState.payload) return null
    const existingIds = new Set(items.map((i) => i.id))
    const overlap = importState.payload.items.filter((i) => existingIds.has(i.id)).length
    return overlap > 0 ? overlap : null
  }, [importState, items])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="-ml-2 inline-flex size-11 items-center justify-center rounded-md text-moss hover:bg-black/5 hover:text-ink"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-[26px]">Settings</h1>
      </header>

      {/* Preferences */}
      <Section title="Preferences">
        <Field label="Default reporting period" htmlFor="settings-period">
          <SelectInput
            id="settings-period"
            value={settings.defaultPeriod}
            onChange={async (e) => {
              try {
                await updateSettings.mutateAsync({ defaultPeriod: e.target.value as Period })
                toast('Saved')
              } catch {
                toast('Unable to save this change.', 'error')
              }
            }}
          >
            {(['weekly', 'fortnightly', 'monthly', 'annual'] as const).map((p) => (
              <option key={p} value={p}>
                {PERIOD_LABEL[p]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Currency" htmlFor="settings-currency">
          <SelectInput id="settings-currency" value={settings.currency} disabled>
            <option value="NZD">New Zealand dollar (NZD)</option>
          </SelectInput>
        </Field>
        <Toggle
          label="Include one-off items by default"
          checked={settings.includeOneOffs}
          onChange={async (checked) => {
            try {
              await updateSettings.mutateAsync({ includeOneOffs: checked })
              toast('Saved')
            } catch {
              toast('Unable to save this change.', 'error')
            }
          }}
        />
      </Section>

      {/* Manage */}
      <Section title="Manage">
        <Button variant="secondary" onClick={() => setCategoriesOpen(true)}>
          Manage categories
        </Button>
        <Button variant="secondary" onClick={() => setArchivedOpen(true)}>
          Archived items ({archivedItems.length + archivedTransfers.length})
        </Button>
      </Section>

      {/* Export and backup */}
      <Section title="Export and backup">
        <Button variant="secondary" onClick={exportJson}>
          <Download aria-hidden className="size-4" /> Export everything (JSON backup)
        </Button>
        <Button variant="secondary" onClick={() => exportBudgetCsv(null, 'consolidated')}>
          <Download aria-hidden className="size-4" /> Consolidated CSV
        </Button>
        <div className="flex flex-wrap gap-2.5">
          {budgets.map((b) => (
            <Button key={b.id} variant="secondary" onClick={() => exportBudgetCsv(b.id, b.slug)}>
              {b.name} CSV
            </Button>
          ))}
          <Button
            variant="secondary"
            onClick={() => {
              downloadFile(`tacedge-budget-loans-${stamp}.csv`, loansCsv(loans, budgets), 'text/csv')
              toast('CSV downloaded')
            }}
          >
            Loans CSV
          </Button>
        </div>
      </Section>

      {/* Import */}
      <Section title="Import and restore">
        <p className="text-[13px] font-light text-moss">
          Restore from a JSON backup made by this app. You'll see a summary and
          nothing is overwritten until you confirm.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose backup file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void onImportFile(file)
            e.target.value = ''
          }}
        />
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          <Upload aria-hidden className="size-4" /> Choose backup file…
        </Button>
      </Section>

      {/* Account */}
      <Section title="Account">
        <p className="text-[14px] font-light text-ink">
          {mode.kind === 'ready' && mode.email
            ? `Signed in as ${mode.email}`
            : store.mode === 'local'
              ? 'Demo mode — data is stored on this device only.'
              : 'Signed in'}
        </p>
        <Button
          variant="secondary"
          onClick={async () => {
            await signOut()
            navigate('/')
          }}
        >
          {store.mode === 'local' ? 'Leave demo mode' : 'Sign out'}
        </Button>
        <p className="text-[12px] font-light text-moss">
          Version {APP_VERSION}
          {sync.lastSyncedAt &&
            ` · Last synced ${format(new Date(sync.lastSyncedAt), 'd MMM yyyy, h:mm a')}`}
        </p>
      </Section>

      <CategoryManager
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        budgets={budgets}
        categories={categories}
      />

      {/* Archived items */}
      <Sheet open={archivedOpen} onClose={() => setArchivedOpen(false)} title="Archived items" wide>
        {archivedItems.length === 0 && archivedTransfers.length === 0 ? (
          <p className="pb-6 text-[14px] font-light text-moss">
            Nothing is archived. Archiving keeps an item's history without
            counting it in totals.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-line pb-4">
            {archivedItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-normal text-ink">{item.name}</p>
                  <p className="text-[12px] font-light text-moss">
                    {budgets.find((b) => b.id === item.budgetId)?.name} · {item.itemType}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setEditEntry({ item })}>
                  Open
                </Button>
              </li>
            ))}
            {archivedTransfers.map((transfer) => (
              <li key={transfer.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-normal text-ink">{transfer.name}</p>
                  <p className="text-[12px] font-light text-moss">Transfer</p>
                </div>
                <Button variant="ghost" onClick={() => setEditEntry({ transfer })}>
                  Open
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Sheet>

      {editEntry && (
        <ItemSheet
          open
          onClose={() => setEditEntry(null)}
          budgets={budgets}
          categories={categories}
          item={'item' in editEntry ? editEntry.item : null}
          transfer={'transfer' in editEntry ? editEntry.transfer : null}
        />
      )}

      {/* Import confirmation */}
      <Sheet
        open={importState != null}
        onClose={() => setImportState(null)}
        title="Restore from backup"
      >
        {importState && !importState.ok && (
          <div className="flex flex-col gap-4 pb-4">
            <p className="rounded-md bg-bricktint px-3.5 py-2.5 text-[14px] font-normal text-brick">
              {importState.error}
            </p>
            <Button variant="secondary" onClick={() => setImportState(null)}>
              Close
            </Button>
          </div>
        )}
        {importState?.ok && importState.summary && (
          <div className="flex flex-col gap-4 pb-4">
            <p className="text-[14px] font-light text-ink">
              Backup from {format(new Date(importState.summary.exportedAt), 'd MMMM yyyy, h:mm a')}:
            </p>
            <ul className="rounded-md border border-line bg-card px-4 py-3 text-[14px] font-light text-ink">
              <li>{importState.summary.budgets} budgets</li>
              <li>{importState.summary.categories} categories</li>
              <li>{importState.summary.items} budget items</li>
              <li>{importState.summary.transfers} transfers</li>
              <li>{importState.summary.loans} loans</li>
            </ul>
            {duplicateWarning && (
              <p className="rounded-md bg-ochretint px-3.5 py-2.5 text-[13px] font-normal text-ochre">
                {duplicateWarning} of these items already exist here and will be
                updated to the backup's version.
              </p>
            )}
            <Field label="How to restore" htmlFor="import-mode">
              <SelectInput
                id="import-mode"
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
              >
                <option value="merge">Merge with existing data</option>
                <option value="replace">Replace all existing data</option>
              </SelectInput>
            </Field>
            {importMode === 'replace' && (
              <p className="rounded-md bg-bricktint px-3.5 py-2.5 text-[13px] font-normal text-brick">
                Replace deletes everything currently stored before restoring the
                backup. This cannot be undone.
              </p>
            )}
            <div className="flex gap-2.5">
              <Button variant="secondary" className="flex-1" onClick={() => setImportState(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={async () => {
                  try {
                    await importData.mutateAsync({
                      payload: importState.payload!,
                      mode: importMode,
                    })
                    toast('Backup restored')
                    setImportState(null)
                  } catch {
                    toast('The restore failed and no further changes were made. Check your connection and try again.', 'error')
                  }
                }}
              >
                Restore
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-3 rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-card)]"
    >
      <h2 className="text-[17px]">{title}</h2>
      {children}
    </section>
  )
}

export type { Category, ItemType }
