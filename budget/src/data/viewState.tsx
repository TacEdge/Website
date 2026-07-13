import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Period, SortMode } from '@/domain/types'
import { useSettings } from './hooks'

/**
 * Session view preferences: the selected reporting period applies
 * consistently across the whole app; sort mode is remembered per device.
 */

interface ViewState {
  period: Period
  setPeriod: (period: Period) => void
  includeOneOffs: boolean
  setIncludeOneOffs: (include: boolean) => void
  sortMode: SortMode
  setSortMode: (mode: SortMode) => void
}

const ViewContext = createContext<ViewState | null>(null)

const PERIOD_KEY = 'tacedge-budget-period'
const SORT_KEY = 'tacedge-budget-sort'

export function ViewStateProvider({ children }: { children: ReactNode }) {
  const { data: settings } = useSettings()
  const [period, setPeriodState] = useState<Period | null>(() => {
    const saved = localStorage.getItem(PERIOD_KEY)
    return saved === 'weekly' || saved === 'fortnightly' || saved === 'monthly' || saved === 'annual'
      ? saved
      : null
  })
  const [includeOneOffs, setIncludeOneOffsState] = useState<boolean | null>(null)
  const [sortMode, setSortModeState] = useState<SortMode>(() => {
    const saved = localStorage.getItem(SORT_KEY)
    return (saved as SortMode) || 'custom'
  })

  // Adopt defaults from settings once loaded, unless the user already chose.
  useEffect(() => {
    if (settings && includeOneOffs === null) {
      setIncludeOneOffsState(settings.includeOneOffs)
    }
  }, [settings, includeOneOffs])

  const value = useMemo<ViewState>(
    () => ({
      period: period ?? settings?.defaultPeriod ?? 'monthly',
      setPeriod: (next) => {
        localStorage.setItem(PERIOD_KEY, next)
        setPeriodState(next)
      },
      includeOneOffs: includeOneOffs ?? settings?.includeOneOffs ?? true,
      setIncludeOneOffs: setIncludeOneOffsState,
      sortMode,
      setSortMode: (mode) => {
        localStorage.setItem(SORT_KEY, mode)
        setSortModeState(mode)
      },
    }),
    [period, includeOneOffs, sortMode, settings],
  )

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>
}

export function useViewState(): ViewState {
  const context = useContext(ViewContext)
  if (!context) throw new Error('useViewState must be used inside ViewStateProvider')
  return context
}
