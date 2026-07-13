import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Loan } from '@/domain/types'
import { parseDollarsToCents, centsToDollarsInput, formatCents } from '@/domain/money'
import { estimatedMonthlyInterestCents } from '@/domain/loans'
import { newId } from '@/data/store'
import { useCreateLoan, useUpdateLoan, useDeleteLoan } from '@/data/hooks'
import { useOnline } from '@/data/syncState'
import { useStore } from '@/data/AppProviders'
import { Sheet, ConfirmDialog } from '@/components/Sheet'
import { Button, CurrencyInput, Field, SelectInput, TextInput, Toggle } from '@/components/ui'
import { useToast } from '@/components/Toast'

const loanFormSchema = z.object({
  name: z.string().trim().min(1, 'Give this loan a name.'),
  currentBalance: z
    .string()
    .refine((v) => (parseDollarsToCents(v) ?? -1) >= 0, 'Enter the current balance.'),
  originalBalance: z.string(),
  annualInterestRate: z
    .string()
    .refine((v) => {
      const n = Number(v)
      return Number.isFinite(n) && n >= 0 && n < 100
    }, 'Enter the rate as a percentage, e.g. 6.45'),
  repaymentType: z.enum(['interest_only', 'principal_and_interest']),
  repaymentFrequency: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annual']),
  scheduledRepayment: z.string(),
  useEstimatedInterest: z.boolean(),
  fixedRateReviewDate: z.string(),
  interestOnlyEndDate: z.string(),
  loanTermEndDate: z.string(),
  notes: z.string(),
  active: z.boolean(),
})

type LoanFormValues = z.infer<typeof loanFormSchema>

export function LoanSheet({
  open,
  onClose,
  budgetId,
  loan = null,
}: {
  open: boolean
  onClose: () => void
  budgetId: string
  loan?: Loan | null
}) {
  const store = useStore()
  const online = useOnline()
  const canSave = online || store.mode === 'local'
  const toast = useToast()
  const createLoan = useCreateLoan()
  const updateLoan = useUpdateLoan()
  const deleteLoan = useDeleteLoan()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const defaults = useMemo<LoanFormValues>(
    () =>
      loan
        ? {
            name: loan.name,
            currentBalance: centsToDollarsInput(loan.currentBalanceCents),
            originalBalance:
              loan.originalBalanceCents == null
                ? ''
                : centsToDollarsInput(loan.originalBalanceCents),
            annualInterestRate: String(loan.annualInterestRate),
            repaymentType: loan.repaymentType,
            repaymentFrequency: loan.repaymentFrequency,
            scheduledRepayment:
              loan.scheduledRepaymentCents == null
                ? ''
                : centsToDollarsInput(loan.scheduledRepaymentCents),
            useEstimatedInterest: loan.useEstimatedInterest,
            fixedRateReviewDate: loan.fixedRateReviewDate ?? '',
            interestOnlyEndDate: loan.interestOnlyEndDate ?? '',
            loanTermEndDate: loan.loanTermEndDate ?? '',
            notes: loan.notes ?? '',
            active: loan.active,
          }
        : {
            name: '',
            currentBalance: '',
            originalBalance: '',
            annualInterestRate: '',
            repaymentType: 'principal_and_interest',
            repaymentFrequency: 'monthly',
            scheduledRepayment: '',
            useEstimatedInterest: false,
            fixedRateReviewDate: '',
            interestOnlyEndDate: '',
            loanTermEndDate: '',
            notes: '',
            active: true,
          },
    [loan],
  )

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormValues>({ resolver: zodResolver(loanFormSchema), defaultValues: defaults })

  useEffect(() => {
    if (open) reset(defaults)
  }, [open, defaults, reset])

  const balance = parseDollarsToCents(watch('currentBalance')) ?? 0
  const rate = Number(watch('annualInterestRate')) || 0
  const useEstimate = watch('useEstimatedInterest')
  const active = watch('active')
  const estimateThisMonth = estimatedMonthlyInterestCents(balance, rate, new Date())

  const save = handleSubmit(async (values) => {
    const payload = {
      budgetId,
      name: values.name.trim(),
      currentBalanceCents: parseDollarsToCents(values.currentBalance) ?? 0,
      originalBalanceCents: parseDollarsToCents(values.originalBalance),
      annualInterestRate: Number(values.annualInterestRate),
      repaymentType: values.repaymentType,
      repaymentFrequency: values.repaymentFrequency,
      scheduledRepaymentCents: parseDollarsToCents(values.scheduledRepayment),
      fixedRateReviewDate: values.fixedRateReviewDate || null,
      interestOnlyEndDate: values.interestOnlyEndDate || null,
      loanTermEndDate: values.loanTermEndDate || null,
      useEstimatedInterest: values.useEstimatedInterest,
      notes: values.notes.trim() || null,
      active: values.active,
    }
    try {
      if (loan) {
        await updateLoan.mutateAsync({ id: loan.id, patch: payload })
      } else {
        await createLoan.mutateAsync({ ...payload, id: newId() })
      }
      toast('Saved')
      onClose()
    } catch {
      toast('Unable to save this change. Check your connection and try again.', 'error')
    }
  })

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        title={loan ? 'Edit loan' : 'Add loan'}
        footer={
          <div className="flex flex-col gap-2">
            {!canSave && (
              <p className="text-center text-[12px] font-normal text-ochre">
                You're offline — editing needs a connection.
              </p>
            )}
            <Button
              variant="primary"
              className="w-full"
              disabled={isSubmitting || !canSave}
              onClick={save}
            >
              Save
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4 pb-2" onSubmit={(e) => e.preventDefault()}>
          <Field label="Loan name" htmlFor="loan-name" error={errors.name?.message}>
            <TextInput id="loan-name" autoComplete="off" {...register('name')} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Current balance"
              htmlFor="loan-balance"
              error={errors.currentBalance?.message}
            >
              <CurrencyInput id="loan-balance" placeholder="0.00" {...register('currentBalance')} />
            </Field>
            <Field label="Original balance" htmlFor="loan-original">
              <CurrencyInput id="loan-original" placeholder="Optional" {...register('originalBalance')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Interest rate % p.a."
              htmlFor="loan-rate"
              error={errors.annualInterestRate?.message}
            >
              <TextInput
                id="loan-rate"
                inputMode="decimal"
                placeholder="6.45"
                autoComplete="off"
                {...register('annualInterestRate')}
              />
            </Field>
            <Field label="Repayment type" htmlFor="loan-type">
              <SelectInput id="loan-type" {...register('repaymentType')}>
                <option value="interest_only">Interest only</option>
                <option value="principal_and_interest">Principal and interest</option>
              </SelectInput>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Repayment frequency" htmlFor="loan-frequency">
              <SelectInput id="loan-frequency" {...register('repaymentFrequency')}>
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </SelectInput>
            </Field>
            <Field
              label="Scheduled repayment"
              htmlFor="loan-repayment"
              hint={useEstimate ? 'Not used while estimating' : undefined}
            >
              <CurrencyInput
                id="loan-repayment"
                placeholder="Optional"
                {...register('scheduledRepayment')}
              />
            </Field>
          </div>

          <Toggle
            label="Use estimated interest"
            description="Balance × rate ÷ 365 × days in the month, until you enter the actual bank repayment"
            checked={useEstimate}
            onChange={(checked) => setValue('useEstimatedInterest', checked)}
          />

          {useEstimate && balance > 0 && rate > 0 && (
            <p className="rounded-md bg-ochretint px-3.5 py-2.5 text-[13px] font-normal text-ochre">
              Estimated monthly interest: ≈ {formatCents(estimateThisMonth)}. This
              is an estimate, not a confirmed bank figure.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fixed-rate review" htmlFor="loan-review">
              <TextInput id="loan-review" type="date" {...register('fixedRateReviewDate')} />
            </Field>
            <Field label="Interest-only ends" htmlFor="loan-io-end">
              <TextInput id="loan-io-end" type="date" {...register('interestOnlyEndDate')} />
            </Field>
          </div>
          <Field label="Loan term ends" htmlFor="loan-term-end">
            <TextInput id="loan-term-end" type="date" {...register('loanTermEndDate')} />
          </Field>

          <Field label="Notes" htmlFor="loan-notes">
            <textarea
              id="loan-notes"
              rows={3}
              {...register('notes')}
              className="w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-[16px] font-normal text-ink placeholder:text-sage focus:border-forest"
            />
          </Field>

          <Toggle
            label="Active"
            description="Inactive loans are left out of totals"
            checked={active}
            onChange={(checked) => setValue('active', checked)}
          />

          {loan && (
            <div className="border-t border-line pt-4">
              <Button variant="danger" disabled={!canSave} onClick={() => setConfirmDelete(true)}>
                Delete loan
              </Button>
            </div>
          )}
        </form>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={async () => {
          if (!loan) return
          try {
            await deleteLoan.mutateAsync(loan.id)
            toast('Loan deleted')
            onClose()
          } catch {
            toast('Unable to delete. Check your connection and try again.', 'error')
          }
        }}
        title="Delete this loan?"
        body="This permanently removes the loan record and its cost from the Property budget."
        confirmLabel="Delete"
        destructive
      />
    </>
  )
}
