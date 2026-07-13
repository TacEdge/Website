import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  CloudOff,
  Home,
  LayoutGrid,
  RefreshCw,
  Settings as SettingsIcon,
  Wallet,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { useSyncState, useOnline } from '@/data/syncState'
import { useAppState } from '@/data/AppProviders'
import { safeStorage } from '@/data/safeStorage'
import lockupCream from '@/assets/tacedge-lockup-cream.svg'

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/b/personal', label: 'Personal', icon: Wallet, end: false },
  { to: '/b/property', label: 'Property', icon: Home, end: false },
  { to: '/b/tacedge', label: 'TacEdge', icon: Briefcase, end: false },
]

/** Plain-language sync state for the top bar. */
export function SyncStatus() {
  const sync = useSyncState()
  const online = useOnline()

  let icon = <Check aria-hidden className="size-3.5" />
  let label = 'Synced'
  let tone = 'text-sage'
  if (!online) {
    icon = <CloudOff aria-hidden className="size-3.5" />
    label = 'Offline'
    tone = 'text-ochre'
  } else if (sync.pending > 0) {
    icon = <RefreshCw aria-hidden className="size-3.5 animate-spin" />
    label = 'Saving…'
    tone = 'text-sage'
  } else if (sync.lastError) {
    icon = <AlertTriangle aria-hidden className="size-3.5" />
    label = 'Sync failed'
    tone = 'text-ochre'
  }

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 text-[12px] font-normal ${tone}`}
    >
      {icon}
      {label}
    </span>
  )
}

export function DemoBanner() {
  const { mode } = useAppState()
  if (mode.kind !== 'ready' || mode.store.mode !== 'local') return null
  if (!safeStorage.persistent) {
    // Sandboxed hosting (e.g. an embedded preview) blocks browser storage:
    // nothing survives closing the page. Say so plainly.
    return (
      <div
        role="alert"
        className="bg-bricktint px-4 py-2 text-center text-[12px] font-normal text-brick"
      >
        Preview only — this page cannot keep your data after you close it.
        Export a backup from Settings before leaving.
      </div>
    )
  }
  return (
    <div className="bg-ochretint px-4 py-2 text-center text-[12px] font-normal text-ochre">
      Demo mode — data is stored on this device only and is not synced.
    </div>
  )
}

export function OfflineBanner() {
  const online = useOnline()
  if (online) return null
  return (
    <div
      role="status"
      className="bg-ochretint px-4 py-2 text-center text-[12px] font-normal text-ochre"
    >
      You're offline. Figures shown may be out of date; editing needs a connection.
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* iPad / desktop: slim left navigation rail */}
      <nav
        aria-label="Primary"
        className="on-dark sticky top-0 z-40 hidden h-dvh w-56 shrink-0 flex-col bg-blackwood pt-safe md:flex"
      >
        <div className="flex items-center gap-2.5 px-5 pb-8 pt-6">
          <BrandLockup failed={logoFailed} onError={() => setLogoFailed(true)} />
        </div>
        <div className="flex flex-col gap-1 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-md px-3 text-[14px] transition-colors ${
                  isActive
                    ? 'bg-forest font-medium text-cream'
                    : 'font-normal text-sage hover:bg-white/5 hover:text-cream'
                }`
              }
            >
              <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between px-5 pb-6">
          <SyncStatus />
          <button
            aria-label="Settings"
            onClick={() => navigate('/settings')}
            className="inline-flex size-11 items-center justify-center rounded-md text-sage hover:bg-white/5 hover:text-cream"
          >
            <SettingsIcon className="size-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phone: app-like top bar */}
        <header className="on-dark sticky top-0 z-40 bg-blackwood pt-safe md:hidden">
          <div className="flex min-h-14 items-center justify-between gap-3 px-4">
            <BrandLockup failed={logoFailed} onError={() => setLogoFailed(true)} />
            <div className="flex items-center gap-1">
              <SyncStatus />
              <button
                aria-label="Settings"
                onClick={() => navigate('/settings')}
                className="inline-flex size-11 items-center justify-center rounded-md text-sage hover:text-cream"
              >
                <SettingsIcon className="size-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </header>

        <DemoBanner />
        <OfflineBanner />

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pt-8 lg:max-w-4xl">
          {children}
        </main>

        {/* Phone: fixed bottom navigation with safe-area inset */}
        <nav
          aria-label="Primary"
          className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-blackwood pb-safe md:hidden"
        >
          <div className="flex">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] ${
                    isActive ? 'font-medium text-cream' : 'font-normal text-sage'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-7 w-12 items-center justify-center rounded-full ${
                        isActive ? 'bg-forest' : ''
                      }`}
                    >
                      <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

/**
 * Masterbrand lockup with the quiet product descriptor:
 * TacEdge (approved asset) | Budget. Falls back to text-only if the
 * asset fails to load — never a redrawn mark.
 */
function BrandLockup({ failed, onError }: { failed: boolean; onError: () => void }) {
  return (
    <span className="flex items-center gap-2.5">
      {failed ? (
        <span className="font-display text-[17px] text-cream">TacEdge</span>
      ) : (
        <img
          src={lockupCream}
          alt="TacEdge"
          className="h-[22px] w-auto"
          onError={onError}
        />
      )}
      <span aria-hidden className="h-4 w-px bg-sage/40" />
      <span className="text-[13px] font-light tracking-wide text-sage">Budget</span>
    </span>
  )
}
