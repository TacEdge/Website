import {
  forwardRef,
  useId,
  useState,
  useRef,
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { Info, Search, X } from 'lucide-react'
import { formatCents, formatCentsSigned } from '@/domain/money'

/* ── Buttons ─────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet'

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-forest text-cream hover:bg-[#36592A] border border-transparent font-medium',
  secondary:
    'bg-card text-ink border border-line hover:border-moss font-medium',
  ghost: 'bg-transparent text-forest hover:bg-sagetint border border-transparent font-medium',
  danger:
    'bg-card text-brick border border-line hover:border-brick font-medium',
  quiet: 'bg-transparent text-moss hover:text-ink border border-transparent',
}

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[variant]} ${className}`}
    />
  )
}

export function IconButton({
  label,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={`inline-flex size-11 items-center justify-center rounded-md text-current transition-colors hover:bg-black/5 ${className}`}
    />
  )
}

/* ── Money display ───────────────────────────────────────────────── */

/**
 * Formatted NZD figure. Colour is only applied alongside the sign, never
 * as the sole indicator: surpluses show a leading +, deficits a −.
 */
export function Money({
  cents,
  signed = false,
  tone = 'neutral',
  estimated = false,
  className = '',
}: {
  cents: number
  signed?: boolean
  tone?: 'neutral' | 'net'
  estimated?: boolean
  className?: string
}) {
  let colour = 'text-ink'
  if (tone === 'net') colour = cents >= 0 ? 'text-forest' : 'text-brick'
  return (
    <span className={`figure ${colour} ${className}`}>
      {estimated && <span aria-hidden>≈ </span>}
      {signed ? formatCentsSigned(cents) : formatCents(cents)}
      {estimated && <span className="sr-only"> (estimated)</span>}
    </span>
  )
}

/* ── Form primitives ─────────────────────────────────────────────── */

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  htmlFor?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-moss">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] font-light text-moss">{hint}</p>}
      {error && (
        <p role="alert" className="text-[12px] font-normal text-brick">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'min-h-12 w-full rounded-md border border-line bg-card px-3.5 text-[16px] font-normal text-ink placeholder:text-sage focus:border-forest'

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className = '', ...props }, ref) {
    return <input ref={ref} {...props} className={`${inputClass} ${className}`} />
  },
)

export const SelectInput = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function SelectInput({ className = '', children, ...props }, ref) {
  return (
    <select ref={ref} {...props} className={`${inputClass} appearance-none ${className}`}>
      {children}
    </select>
  )
})

/** Dollar amount input: $ prefix, decimal keyboard on iOS. */
export const CurrencyInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function CurrencyInput({ className = '', ...props }, ref) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[16px] text-moss"
      >
        $
      </span>
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        {...props}
        className={`${inputClass} figure pl-8 ${className}`}
      />
    </div>
  )
})

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 py-1">
      <div>
        <label htmlFor={id} className="text-[15px] font-normal text-ink">
          {label}
        </label>
        {description && <p className="text-[12px] font-light text-moss">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full border transition-colors disabled:opacity-50 ${
          checked ? 'border-forest bg-forest' : 'border-line bg-cream-deep'
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-1 size-[22px] rounded-full bg-card shadow-sm transition-[left] ${
            checked ? 'left-[30px]' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

/* ── Segmented control (period selector) ─────────────────────────── */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex w-full rounded-md border border-line bg-cream-deep p-1"
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`min-h-10 flex-1 rounded-[8px] px-2 text-[13px] transition-colors ${
              selected
                ? 'bg-forest font-medium text-cream shadow-sm'
                : 'font-normal text-moss hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Filter chip ─────────────────────────────────────────────────── */

export function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] transition-colors ${
        selected
          ? 'border-forest bg-forest font-medium text-cream'
          : 'border-line bg-card font-normal text-ink hover:border-moss'
      }`}
    >
      {children}
    </button>
  )
}

/* ── Search field ────────────────────────────────────────────────── */

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <Search
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-4 text-moss"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${inputClass} pl-10 pr-10`}
      />
      {value && (
        <button
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-1 my-auto flex size-10 items-center justify-center text-moss hover:text-ink"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────────────────── */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-card/50 px-6 py-10 text-center">
      <p className="font-display text-[17px] text-ink">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-[36ch] text-[14px] font-light text-moss">{body}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

/* ── Info disclosure — explains how a total is calculated ────────── */

export function InfoDisclosure({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-8 items-center justify-center rounded-full text-moss hover:bg-sagetint hover:text-forest"
      >
        <Info className="size-4" />
      </button>
      {open && (
        <div
          id={panelId}
          role="note"
          className="fade-enter absolute right-0 top-9 z-30 w-72 rounded-md border border-line bg-card p-4 text-left text-[13px] font-light leading-relaxed text-ink shadow-[var(--shadow-raised)]"
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Status pill ─────────────────────────────────────────────────── */

export function StatusPill({
  tone,
  children,
}: {
  tone: 'neutral' | 'positive' | 'caution' | 'alert'
  children: ReactNode
}) {
  const tones = {
    neutral: 'bg-sagetint text-forest',
    positive: 'bg-sagetint text-forest',
    caution: 'bg-ochretint text-ochre',
    alert: 'bg-bricktint text-brick',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
