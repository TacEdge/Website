import { useState } from 'react'
import { getSupabase } from '@/data/supabaseStore'
import { Button, Field, TextInput } from '@/components/ui'

type Phase =
  | { kind: 'form' }
  | { kind: 'sending' }
  | { kind: 'link_sent'; email: string }
  | { kind: 'error'; message: string }

/**
 * Private sign-in: email + password, or an email magic link.
 * No social login; public sign-up should be disabled in Supabase.
 */
export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'form' })
  const busy = phase.kind === 'sending'

  async function signInWithPassword() {
    const supabase = getSupabase()
    if (!supabase) return
    setPhase({ kind: 'sending' })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setPhase({
        kind: 'error',
        message:
          error.message === 'Invalid login credentials'
            ? 'That email and password don’t match. Try again, or use a sign-in link.'
            : error.message,
      })
    }
    // On success the auth listener takes over.
  }

  async function sendMagicLink() {
    const supabase = getSupabase()
    if (!supabase) return
    setPhase({ kind: 'sending' })
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) setPhase({ kind: 'error', message: error.message })
    else setPhase({ kind: 'link_sent', email })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <header className="on-dark bg-blackwood pt-safe">
        <div className="mx-auto flex min-h-16 w-full max-w-md items-center gap-2.5 px-6">
          <img src="/brand/tacedge-lockup-cream.svg" alt="TacEdge" className="h-[22px] w-auto" />
          <span aria-hidden className="h-4 w-px bg-sage/40" />
          <span className="text-[13px] font-light tracking-wide text-sage">Budget</span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-10">
        <div>
          <h1 className="text-[26px]">Sign in</h1>
          <p className="mt-1.5 text-[14px] font-light text-moss">
            This is a private budgeting tool. Sign in with your approved account.
          </p>
        </div>

        {phase.kind === 'link_sent' ? (
          <div className="rounded-lg border border-line bg-card p-5">
            <h2 className="text-[17px]">Check your email</h2>
            <p className="mt-2 text-[14px] font-light text-ink">
              We've sent a sign-in link to {phase.email}. Open it on this device
              to continue.
            </p>
            <Button
              variant="ghost"
              className="mt-3"
              onClick={() => setPhase({ kind: 'form' })}
            >
              Use a different method
            </Button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (password) void signInWithPassword()
              else void sendMagicLink()
            }}
          >
            <Field label="Email" htmlFor="signin-email">
              <TextInput
                id="signin-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field
              label="Password"
              htmlFor="signin-password"
              hint="Leave blank to get a sign-in link by email instead."
            >
              <TextInput
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {phase.kind === 'error' && (
              <p role="alert" className="rounded-md bg-bricktint px-3.5 py-2.5 text-[13px] font-normal text-brick">
                {phase.message}
              </p>
            )}
            <Button type="submit" variant="primary" disabled={busy || email.trim() === ''}>
              {busy ? 'Signing in…' : password ? 'Sign in' : 'Email me a sign-in link'}
            </Button>
          </form>
        )}
      </main>
    </div>
  )
}

/** Shown when Supabase environment variables are missing. */
export function SetupNeeded({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-6 py-10">
      <h1 className="text-[24px]">Almost ready</h1>
      <p className="text-[14px] font-light text-ink">
        This app stores your budgets securely in Supabase, but it hasn't been
        connected yet. Copy <code className="font-medium">.env.example</code> to{' '}
        <code className="font-medium">.env</code> and add your Supabase URL and
        anon key, then rebuild. The README has step-by-step instructions.
      </p>
      <div className="rounded-lg border border-line bg-card p-5">
        <h2 className="text-[16px]">Preview without an account</h2>
        <p className="mt-1.5 text-[13px] font-light text-moss">
          You can explore the app in demo mode. Demo data is stored only in this
          browser and is not synced or backed up.
        </p>
        <Button variant="secondary" className="mt-3" onClick={onDemo}>
          Continue in demo mode
        </Button>
      </div>
    </div>
  )
}
