import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal sheet: bottom sheet on phones, centred compact dialog on larger
 * screens. Traps focus, closes on Escape and backdrop tap, restores focus.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'Tab' && panel) {
        const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
        if (focusable.length === 0) return
        const firstEl = focusable[0]!
        const lastEl = focusable[focusable.length - 1]!
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      restoreRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden
        onClick={onClose}
        className="fade-enter absolute inset-0 bg-blackwood/45"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`sheet-enter relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-cream shadow-[var(--shadow-sheet)] sm:max-h-[86dvh] sm:rounded-2xl ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        }`}
      >
        {/* Grab handle, phone only */}
        <div aria-hidden className="flex justify-center pt-2.5 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>
        <header className="flex items-center justify-between gap-4 px-5 pb-2 pt-3 sm:px-6 sm:pt-5">
          <h2 className="text-[20px]">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-moss hover:bg-black/5 hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="sheet-scroll min-h-0 flex-1 overflow-y-auto px-5 pb-4 sm:px-6">
          {children}
        </div>
        {footer && (
          <footer className="border-t border-line bg-cream px-5 py-3 pb-safe sm:rounded-b-2xl sm:px-6">
            <div className="pb-2 sm:pb-0">{footer}</div>
          </footer>
        )}
        {!footer && <div className="pb-safe" />}
      </div>
    </div>,
    document.body,
  )
}

/** Small confirmation dialog built on the same primitive. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel,
  destructive = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  body: string
  confirmLabel: string
  destructive?: boolean
}) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <p className="pb-4 text-[15px] font-light text-ink">{body}</p>
      <div className="flex gap-3 pb-4">
        <button
          onClick={onClose}
          className="min-h-12 flex-1 rounded-md border border-line bg-card font-medium text-ink"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`min-h-12 flex-1 rounded-md font-medium text-cream ${
            destructive ? 'bg-brick' : 'bg-forest'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Sheet>
  )
}
