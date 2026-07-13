import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'

/**
 * Calm first-run screen after the default budgets, categories and confirmed
 * loan records have been created. No carousel.
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate()
  const start = (path: string) => {
    onDone()
    navigate(path)
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-col justify-center gap-6 px-2 py-10">
      <div>
        <h1 className="text-[28px]">Build your financial picture</h1>
        <p className="mt-3 text-[15px] font-light leading-relaxed text-ink">
          Add your regular income and expenses across Personal, Property and
          TacEdge. Your consolidated position will update automatically.
        </p>
        <p className="mt-2 text-[13px] font-light text-moss">
          Your property loans are already set up and can be edited any time.
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <Button variant="primary" onClick={() => start('/b/personal')}>
          Start with Personal
        </Button>
        <Button variant="secondary" onClick={() => start('/b/property')}>
          Start with Property
        </Button>
        <Button variant="secondary" onClick={() => start('/b/tacedge')}>
          Start with TacEdge
        </Button>
        <Button variant="quiet" onClick={() => start('/')}>
          Go to Overview
        </Button>
      </div>
    </div>
  )
}
