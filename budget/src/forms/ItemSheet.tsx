import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown } from 'lucide-react'
import type { Budget, BudgetItem, Category, Frequency, Transfer } from '@/domain/types'
import { parseDollarsToCents, centsToDollarsInput } from '@/domain/money'
import { FREQUENCY_LABEL } from '@/domain/frequency'
import { newId, nowIso } from '@/data/store'
import {
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useCreateTransfer,
  useUpdateTransfer,
  useDeleteTransfer,
} from '@/data/hooks'
import { useOnline } from '@/data/syncState'
import { useStore } from '@/data/AppProviders'
import { Sheet, ConfirmDialog } from '@/components/Sheet'
import { Button, CurrencyInput, Field, SelectInput, TextInput, Toggle } from '@/components/ui'
import { useToast } from '@/components/Toast'

const FREQUENCIES: Frequency[] = [
  'weekly', 'fortnightly', 'monthly', 'quarterly', 'annual', 'one_off',
]

const formSchema = z
  .object({
    name: z.string().trim().min(1, 'Give this item a name.'),
    budgetId: z.string().min(1, 'Choose a budget.'),
    itemType: z.enum(['income', 'expense', 'transfer']),
    destinationBudgetId: z.string(),
    amount: z
      .string()
      .refine((value) => (parseDollarsToCents(value) ?? 0) > 0, 'Enter an amount.'),
    frequency: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annual', 'one_off']),
    categoryId: z.string(),
    active: z.boolean(),
    includeInBaseline: z.boolean(),
    startDate: z.string(),
    endDate: z.string(),
    oneOffDate: z.string(),
    notes: z.string(),
    payeeSource: z.string(),
    gstNote: z.string(),
    reminderDate: z.string(),
    tags: z.string(),
  })
  .refine((data) => data.frequency !== 'one_off' || data.oneOffDate !== '', {
    message: 'A one-off item needs a date.',
    path: ['oneOffDate'],
  })
  .refine(
    (data) =>
      data.itemType !== 'transfer' ||
      (data.destinationBudgetId !== '' && data.destinationBudgetId !== data.budgetId),
    { message: 'Choose a different destination budget.', path: ['destinationBudgetId'] },
  )

type FormValues = z.infer<typeof formSchema>

export interface ItemSheetProps {
  open: boolean
  onClose: () => void
  budgets: Budget[]
  categories: Category[]
  /** Editing an existing item (null for new). */
  item?: BudgetItem | null
  /** Editing an existing transfer (null for new). */
  transfer?: Transfer | null
  /** Defaults for a new entry. */
  defaultBudgetId?: string
  defaultType?: 'income' | 'expense' | 'transfer'
}

export function ItemSheet({
  open,
  onClose,
  budgets,
  categories,
  item = null,
  transfer = null,
  defaultBudgetId,
  defaultType = 'expense',
}: ItemSheetProps) {
  const editing = item != null || transfer != null
  const store = useStore()
  const online = useOnline()
  const canSave = online || store.mode === 'local'
  const toast = useToast()

  const createItem = useCreateItem()
  const updateItem = useUpdateItem()
  const deleteItem = useDeleteItem()
  const createTransfer = useCreateTransfer()
  const updateTransfer = useUpdateTransfer()
  const deleteTransfer = useDeleteTransfer()

  const [moreOpen, setMoreOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const defaults = useMemo<FormValues>(() => {
    if (item) {
      return {
        name: item.name,
        budgetId: item.budgetId,
        itemType: item.itemType,
        destinationBudgetId: '',
        amount: centsToDollarsInput(item.amountCents),
        frequency: item.frequency,
        categoryId: item.categoryId ?? '',
        active: item.active,
        includeInBaseline: item.includeInBaseline,
        startDate: item.startDate ?? '',
        endDate: item.endDate ?? '',
        oneOffDate: item.oneOffDate ?? '',
        notes: item.notes ?? '',
        payeeSource: item.payeeSource ?? '',
        gstNote: item.gstNote ?? '',
        reminderDate: item.reminderDate ?? '',
        tags: item.tags.join(', '),
      }
    }
    if (transfer) {
      return {
        name: transfer.name,
        budgetId: transfer.sourceBudgetId,
        itemType: 'transfer',
        destinationBudgetId: transfer.destinationBudgetId,
        amount: centsToDollarsInput(transfer.amountCents),
        frequency: transfer.frequency,
        categoryId: '',
        active: transfer.active,
        includeInBaseline: true,
        startDate: transfer.startDate ?? '',
        endDate: transfer.endDate ?? '',
        oneOffDate: transfer.oneOffDate ?? '',
        notes: transfer.notes ?? '',
        payeeSource: '',
        gstNote: '',
        reminderDate: '',
        tags: '',
      }
    }
    return {
      name: '',
      budgetId: defaultBudgetId ?? budgets[0]?.id ?? '',
      itemType: defaultType,
      destinationBudgetId: '',
      amount: '',
      frequency: 'monthly',
      categoryId: '',
      active: true,
      includeInBaseline: true,
      startDate: '',
      endDate: '',
      oneOffDate: '',
      notes: '',
      payeeSource: '',
      gstNote: '',
      reminderDate: '',
      tags: '',
    }
  }, [item, transfer, defaultBudgetId, defaultType, budgets])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: defaults })

  useEffect(() => {
    if (open) {
      reset(defaults)
      setMoreOpen(false)
    }
  }, [open, defaults, reset])

  const itemType = watch('itemType')
  const budgetId = watch('budgetId')
  const frequency = watch('frequency')
  const active = watch('active')
  const includeInBaseline = watch('includeInBaseline')

  const budgetCategories = categories.filter(
    (c) =>
      c.budgetId === budgetId &&
      c.active &&
      (itemType === 'transfer' || c.itemType === itemType),
  )

  async function persist(values: FormValues): Promise<void> {
    const amountCents = parseDollarsToCents(values.amount) ?? 0
    if (values.itemType === 'transfer') {
      const payload = {
        name: values.name.trim(),
        sourceBudgetId: values.budgetId,
        destinationBudgetId: values.destinationBudgetId,
        amountCents,
        frequency: values.frequency,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        oneOffDate: values.oneOffDate || null,
        notes: values.notes.trim() || null,
        active: values.active,
      }
      if (transfer) {
        await updateTransfer.mutateAsync({ id: transfer.id, patch: payload })
      } else {
        await createTransfer.mutateAsync({
          ...payload,
          id: newId(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        })
      }
      return
    }
    const payload = {
      name: values.name.trim(),
      budgetId: values.budgetId,
      categoryId: values.categoryId || null,
      itemType: values.itemType,
      amountCents,
      frequency: values.frequency,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      oneOffDate: values.frequency === 'one_off' ? values.oneOffDate || null : null,
      includeInBaseline: values.includeInBaseline,
      active: values.active,
      notes: values.notes.trim() || null,
      payeeSource: values.payeeSource.trim() || null,
      gstNote: values.gstNote.trim() || null,
      reminderDate: values.reminderDate || null,
      tags: values.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    if (item) {
      await updateItem.mutateAsync({ id: item.id, patch: payload })
    } else {
      await createItem.mutateAsync({
        ...payload,
        id: newId(),
        displayOrder: Date.now() % 100000,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      })
    }
  }

  const save = (andAddAnother: boolean) =>
    handleSubmit(async (values) => {
      try {
        await persist(values)
        toast('Saved')
        if (andAddAnother) {
          reset({ ...defaults, budgetId: values.budgetId, itemType: values.itemType })
        } else {
          onClose()
        }
      } catch {
        toast('Unable to save this change. Your previous information is still available — check your connection and try again.', 'error')
      }
    })

  async function duplicate() {
    if (!item) return
    try {
      await createItem.mutateAsync({
        ...item,
        id: newId(),
        name: `${item.name} (copy)`,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      })
      toast('Duplicated')
      onClose()
    } catch {
      toast('Unable to duplicate this item.', 'error')
    }
  }

  async function remove() {
    try {
      if (item) await deleteItem.mutateAsync(item.id)
      if (transfer) await deleteTransfer.mutateAsync(transfer.id)
      toast('Deleted')
      onClose()
    } catch {
      toast('Unable to delete. Check your connection and try again.', 'error')
    }
  }

  const title = editing
    ? transfer || itemType === 'transfer'
      ? 'Edit transfer'
      : 'Edit item'
    : 'Add item'

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        title={title}
        footer={
          <div className="flex flex-col gap-2">
            {!canSave && (
              <p className="text-center text-[12px] font-normal text-ochre">
                You're offline — editing needs a connection.
              </p>
            )}
            <div className="flex gap-2.5">
              <Button
                variant="primary"
                className="flex-1"
                disabled={isSubmitting || !canSave}
                onClick={save(false)}
              >
                Save
              </Button>
              {!editing && (
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled={isSubmitting || !canSave}
                  onClick={save(true)}
                >
                  Save and add another
                </Button>
              )}
            </div>
          </div>
        }
      >
        <form className="flex flex-col gap-4 pb-2" onSubmit={(e) => e.preventDefault()}>
          <Field label="Name" htmlFor="item-name" error={errors.name?.message}>
            <TextInput
              id="item-name"
              placeholder="e.g. Groceries"
              autoComplete="off"
              {...register('name')}
            />
          </Field>

          <Field label="Type" htmlFor="item-type">
            <SelectInput
              id="item-type"
              {...register('itemType')}
              disabled={editing}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer between budgets</option>
            </SelectInput>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={itemType === 'transfer' ? 'From budget' : 'Budget'}
              htmlFor="item-budget"
              error={errors.budgetId?.message}
            >
              <SelectInput id="item-budget" {...register('budgetId')}>
                {budgets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            {itemType === 'transfer' ? (
              <Field
                label="To budget"
                htmlFor="item-destination"
                error={errors.destinationBudgetId?.message}
              >
                <SelectInput id="item-destination" {...register('destinationBudgetId')}>
                  <option value="">Choose…</option>
                  {budgets
                    .filter((b) => b.id !== budgetId)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                </SelectInput>
              </Field>
            ) : (
              <Field label="Category" htmlFor="item-category">
                <SelectInput id="item-category" {...register('categoryId')}>
                  <option value="">Uncategorised</option>
                  {budgetCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount" htmlFor="item-amount" error={errors.amount?.message}>
              <CurrencyInput id="item-amount" placeholder="0.00" {...register('amount')} />
            </Field>
            <Field label="Frequency" htmlFor="item-frequency">
              <SelectInput id="item-frequency" {...register('frequency')}>
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {FREQUENCY_LABEL[f]}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          {frequency === 'one_off' && (
            <Field label="Date" htmlFor="item-oneoff" error={errors.oneOffDate?.message}>
              <TextInput id="item-oneoff" type="date" {...register('oneOffDate')} />
            </Field>
          )}

          {itemType === 'transfer' && (
            <p className="rounded-md bg-sagetint px-3.5 py-2.5 text-[12px] font-light leading-relaxed text-forest">
              A transfer shows as money out of the source budget and money into
              the destination budget. It is excluded from your consolidated
              totals, so it is never double-counted.
            </p>
          )}

          <Toggle
            label="Active"
            description="Inactive items are archived and left out of totals"
            checked={active}
            onChange={(checked) => setValue('active', checked)}
          />

          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((o) => !o)}
            className="flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-forest"
          >
            <ChevronDown
              aria-hidden
              className={`size-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
            />
            More options
          </button>

          {moreOpen && (
            <div className="flex flex-col gap-4">
              {itemType !== 'transfer' && frequency !== 'one_off' && (
                <Toggle
                  label="Include in baseline"
                  description="Counts towards recurring totals"
                  checked={includeInBaseline}
                  onChange={(checked) => setValue('includeInBaseline', checked)}
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date" htmlFor="item-start">
                  <TextInput id="item-start" type="date" {...register('startDate')} />
                </Field>
                <Field label="End date" htmlFor="item-end">
                  <TextInput id="item-end" type="date" {...register('endDate')} />
                </Field>
              </div>
              {itemType !== 'transfer' && (
                <>
                  <Field label="Payee or source" htmlFor="item-payee">
                    <TextInput id="item-payee" autoComplete="off" {...register('payeeSource')} />
                  </Field>
                  <Field label="Tax or GST note" htmlFor="item-gst">
                    <TextInput id="item-gst" autoComplete="off" {...register('gstNote')} />
                  </Field>
                  <Field label="Reminder date" htmlFor="item-reminder">
                    <TextInput id="item-reminder" type="date" {...register('reminderDate')} />
                  </Field>
                  <Field label="Tags" hint="Separate with commas" htmlFor="item-tags">
                    <TextInput id="item-tags" autoComplete="off" {...register('tags')} />
                  </Field>
                </>
              )}
              <Field label="Notes" htmlFor="item-notes">
                <textarea
                  id="item-notes"
                  rows={3}
                  {...register('notes')}
                  className="w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-[16px] font-normal text-ink placeholder:text-sage focus:border-forest"
                />
              </Field>
            </div>
          )}

          {editing && (
            <div className="flex flex-wrap gap-2.5 border-t border-line pt-4">
              {item && (
                <Button variant="secondary" disabled={!canSave} onClick={duplicate}>
                  Duplicate
                </Button>
              )}
              <Button
                variant="secondary"
                disabled={!canSave}
                onClick={async () => {
                  try {
                    if (item) {
                      await updateItem.mutateAsync({ id: item.id, patch: { active: !item.active } })
                    }
                    if (transfer) {
                      await updateTransfer.mutateAsync({
                        id: transfer.id,
                        patch: { active: !transfer.active },
                      })
                    }
                    toast(active ? 'Archived' : 'Restored')
                    onClose()
                  } catch {
                    toast('Unable to save this change.', 'error')
                  }
                }}
              >
                {(item?.active ?? transfer?.active) ? 'Archive' : 'Restore'}
              </Button>
              <Button
                variant="danger"
                disabled={!canSave}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            </div>
          )}
        </form>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        title="Delete this entry?"
        body="This permanently removes it from your budget. If you might need it again, archive it instead."
        confirmLabel="Delete"
        destructive
      />
    </>
  )
}
