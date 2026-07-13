import { RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from './ui'

export function ScreenLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[40dvh] flex-col items-center justify-center gap-3 text-moss"
    >
      <RefreshCw aria-hidden className="size-6 animate-spin" strokeWidth={1.5} />
      <p className="text-[14px] font-light">{label}</p>
    </div>
  )
}

export function ScreenError({
  title,
  body,
  onRetry,
}: {
  title: string
  body: string
  onRetry?: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[40dvh] max-w-sm flex-col items-center justify-center gap-3 text-center">
      <AlertTriangle aria-hidden className="size-6 text-ochre" strokeWidth={1.5} />
      <h2 className="text-[18px]">{title}</h2>
      <p className="text-[14px] font-light text-moss">{body}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
