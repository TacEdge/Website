import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

interface ToastItem {
  id: number
  message: string
  tone: 'success' | 'error'
}

const ToastContext = createContext<(message: string, tone?: 'success' | 'error') => void>(
  () => {},
)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const push = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    const id = ++counter.current
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 3600)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-8"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="fade-enter pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-md border border-line bg-card px-4 py-3 text-[14px] font-normal text-ink shadow-[var(--shadow-raised)]"
          >
            {toast.tone === 'success' ? (
              <CheckCircle2 aria-hidden className="size-4 shrink-0 text-forest" />
            ) : (
              <AlertTriangle aria-hidden className="size-4 shrink-0 text-brick" />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
