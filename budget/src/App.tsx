import { useState } from 'react'
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import {
  AppQueryProvider,
  AppStateProvider,
  FORCE_DEMO,
  useAppState,
} from '@/data/AppProviders'
import { ViewStateProvider } from '@/data/viewState'
import { useSeed } from '@/data/hooks'
import { ToastProvider } from '@/components/Toast'
import { AppShell } from '@/components/AppShell'
import { ScreenLoading, ScreenError } from '@/components/states'
import { Overview } from '@/screens/Overview'
import { BudgetScreen } from '@/screens/BudgetScreen'
import { Settings } from '@/screens/Settings'
import { SignIn, SetupNeeded } from '@/screens/SignIn'
import { Onboarding } from '@/screens/Onboarding'

export default function App() {
  // Standalone demo builds are served from a single static file, so client
  // routing uses the hash instead of real paths.
  const Router = FORCE_DEMO ? HashRouter : BrowserRouter
  return (
    <AppQueryProvider>
      <AppStateProvider>
        <ToastProvider>
          <Router>
            <Gate />
          </Router>
        </ToastProvider>
      </AppStateProvider>
    </AppQueryProvider>
  )
}

function Gate() {
  const { mode, enterDemo } = useAppState()

  switch (mode.kind) {
    case 'loading':
      return <ScreenLoading label="Loading…" />
    case 'unconfigured':
      return <SetupNeeded onDemo={enterDemo} />
    case 'signed_out':
      return <SignIn />
    case 'ready':
      // Key on store mode so switching demo ↔ real resets query state cleanly.
      return <SeededApp key={mode.store.mode} />
  }
}

function SeededApp() {
  const seed = useSeed()
  const [onboardingDone, setOnboardingDone] = useState(false)

  if (seed.isPending) return <ScreenLoading label="Setting up your budgets…" />
  if (seed.isError) {
    return (
      <ScreenError
        title="Unable to load your data"
        body="Your information is safe, but it couldn't be loaded just now. Check your connection and try again."
        onRetry={() => void seed.refetch()}
      />
    )
  }

  return (
    <ViewStateProvider>
      <UpdatePrompt />
      <AppShell>
        {seed.data.seeded && !onboardingDone ? (
          <Onboarding onDone={() => setOnboardingDone(true)} />
        ) : (
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/b/:slug" element={<BudgetScreen />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AppShell>
    </ViewStateProvider>
  )
}

/** Quiet in-app update bar when a new deployment is available. */
function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 bg-forest px-4 py-2 text-[13px] text-cream"
    >
      A new version is available.
      <button
        onClick={() => void updateServiceWorker(true)}
        className="rounded-md bg-cream px-3 py-1 font-medium text-forest"
      >
        Refresh
      </button>
    </div>
  )
}
