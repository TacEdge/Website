import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import type { DataStore } from './store'
import { LocalStore } from './localStore'
import { getSupabase, supabaseConfig, SupabaseStore } from './supabaseStore'

export type AppMode =
  | { kind: 'loading' }
  /** Supabase configured, nobody signed in yet. */
  | { kind: 'signed_out' }
  /** Signed in against Supabase, or running the on-device demo. */
  | { kind: 'ready'; store: DataStore; email: string | null }
  /** No Supabase configuration present. */
  | { kind: 'unconfigured' }

interface AppState {
  mode: AppMode
  signOut: () => Promise<void>
  enterDemo: () => void
}

const AppContext = createContext<AppState | null>(null)

const DEMO_FLAG_KEY = 'tacedge-budget-demo-enabled'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const configured = supabaseConfig() != null
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [demo, setDemo] = useState(
    () => !configured && localStorage.getItem(DEMO_FLAG_KEY) === 'true',
  )

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setSessionLoaded(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionLoaded(true)
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => subscription.subscription.unsubscribe()
  }, [])

  const allowedEmail = (import.meta.env.VITE_ALLOWED_EMAIL as string | undefined)
    ?.trim()
    .toLowerCase()

  const mode: AppMode = useMemo(() => {
    if (demo) return { kind: 'ready', store: new LocalStore(), email: null }
    if (!configured) return { kind: 'unconfigured' }
    if (!sessionLoaded) return { kind: 'loading' }
    if (!session?.user) return { kind: 'signed_out' }
    const email = session.user.email ?? null
    if (allowedEmail && email?.toLowerCase() !== allowedEmail) {
      // Signed in with an account this private app does not allow.
      return { kind: 'signed_out' }
    }
    const supabase = getSupabase()
    if (!supabase) return { kind: 'unconfigured' }
    return {
      kind: 'ready',
      store: new SupabaseStore(supabase, session.user.id),
      email,
    }
  }, [configured, session, sessionLoaded, demo, allowedEmail])

  const value: AppState = useMemo(
    () => ({
      mode,
      signOut: async () => {
        if (demo) {
          localStorage.removeItem(DEMO_FLAG_KEY)
          setDemo(false)
          return
        }
        await getSupabase()?.auth.signOut()
      },
      enterDemo: () => {
        localStorage.setItem(DEMO_FLAG_KEY, 'true')
        setDemo(true)
      },
    }),
    [mode, demo],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState(): AppState {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppState must be used inside AppStateProvider')
  return context
}

/** Only valid once mode.kind === 'ready'. */
export function useStore(): DataStore {
  const { mode } = useAppState()
  if (mode.kind !== 'ready') throw new Error('Store unavailable before sign-in')
  return mode.store
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

export function AppQueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
