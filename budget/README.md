# TacEdge | Budget

A private, mobile-first budgeting PWA that brings together three connected
financial areas — **Personal**, **Property** and **TacEdge** — with a
consolidated overview, correct transfer handling, loan records and a
TacEdge cash/runway view.

Built with React, TypeScript (strict), Vite, Tailwind CSS, Supabase,
React Router, TanStack Query, React Hook Form, Zod, vite-plugin-pwa,
date-fns and Lucide icons. All money is stored as integer cents; rounding
happens only at display time.

---

## 1. Local setup

Requires Node 20+.

```bash
cd budget
npm install
cp .env.example .env    # fill in Supabase values (see below)
npm run dev             # http://localhost:5173
```

Without Supabase configured the app offers a clearly-labelled **demo mode**
(data stays in the browser only). Real use requires Supabase.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build (`dist/`) |
| `npm run preview` | Serve the production build |
| `npm test` | Vitest unit tests (frequency conversion, transfers, loans, runway, rounding, one-offs) |
| `npm run e2e` | Playwright smoke tests (critical flows, phone + desktop viewports) |
| `npm run icons` | Regenerate PWA icons from the approved brandmark |

## 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (region: Sydney
   is closest to NZ).
2. Open **SQL Editor** and run `supabase/migrations/0001_init.sql` in full.
   This creates all tables, foreign keys, indexes, `updated_at` triggers and
   **Row Level Security policies** (`auth.uid() = user_id` on every
   user-owned table — no anonymous access).
3. **Authentication → Providers → Email**: leave Email enabled. Both
   password sign-in and magic links work out of the box.
4. Create your own account: **Authentication → Users → Add user** (email +
   password, confirm email automatically).
5. Then disable public sign-ups: **Authentication → Providers → Email →
   turn off "Allow new users to sign up"**. This is the real access control
   for a private app.
6. **Project Settings → API**: copy the *Project URL* and *anon public* key
   into `.env`:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_ALLOWED_EMAIL=you@example.com   # optional belt-and-braces
   ```

The anon key is safe in the browser because RLS restricts every row to the
signed-in user. The **service-role key is never used by this app** — do not
put it in any `VITE_` variable.

On first sign-in the app seeds the three budgets, the starter categories and
the two confirmed property loan records. No invented amounts are created.

## 3. Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo.
3. Set **Root Directory** to `budget`.
4. Framework preset: **Vite** (build `npm run build`, output `dist`).
5. Add the environment variables from `.env` (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`, optionally `VITE_ALLOWED_EMAIL`,
   `VITE_APP_VERSION`).
6. Deploy. For client-side routing add a rewrite (Vercel handles SPA
   fallback automatically for Vite; if 404s appear, add `vercel.json`):

   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

7. In Supabase **Authentication → URL Configuration**, set the Site URL to
   your Vercel URL so magic links redirect correctly.

New deployments show an in-app “A new version is available — Refresh” bar.

## 4. Install on iPhone / iPad home screen

1. Open the deployed URL in **Safari**.
2. Tap the **Share** button.
3. Tap **Add to Home Screen**, then **Add**.
4. Launch from the home-screen icon — the app opens full-screen without
   browser chrome, with the TacEdge ridge-mark icon and blackwood theme.

## 5. Export, backup and restore

In **Settings → Export and backup**:

- **Export everything (JSON backup)** — the complete dataset, restorable.
- **Consolidated CSV** — every item across all budgets (plus a transfers
  CSV when transfers exist).
- **Per-budget CSVs** and **Loans CSV**.

CSVs include the original entered amount and frequency, the normalised
annual amount, category, type, dates, notes and active status.

**Restore**: Settings → Import and restore → choose a JSON backup. The app
validates the file, shows a summary (with a duplicate warning), and asks
whether to **merge** or **replace** before anything is written. Cancel is
always available; nothing is overwritten silently.

## 6. How calculations work

- Recurring items annualise as weekly ×52, fortnightly ×26, monthly ×12,
  quarterly ×4, annual ×1, then divide into the selected period (÷52, ÷26,
  ÷12, ÷1). Full precision is kept internally; rounding is display-only.
- **One-off items** need a date, count only in the period their date falls
  in, are listed separately, and obey the “Include one-off items” toggle.
  They are never spread across periods.
- **Transfers** appear as an outflow in the source budget and an inflow in
  the destination, and are excluded from consolidated income/expenses, so
  the consolidated effect is always $0.
- **Interest-only loan**: estimated interest = balance × annual rate ÷ 365 ×
  days in the current month, labelled *estimated* (≈) until you enter the
  actual bank repayment. **P&I loan**: the scheduled repayment feeds the
  Property expense total.
- **Runway** = cash balance ÷ average monthly net burn; shown only when
  operating expenses exceed operating income (financing inflows and
  transfers in don't reduce burn). Otherwise: “Runway unavailable”.

Every total has an ⓘ action explaining exactly what's included.

## 7. Project structure

```
budget/
├── src/
│   ├── domain/        # pure financial logic + unit tests (no React)
│   ├── data/          # DataStore interface, Supabase + local demo stores,
│   │                  # TanStack Query hooks, seed data, sync state
│   ├── components/    # shell, sheets, toasts, chart, shared UI
│   ├── forms/         # item/transfer, loan, category sheets
│   └── screens/       # Overview, Budget, Settings, SignIn, Onboarding
├── supabase/migrations/0001_init.sql
├── scripts/generate-icons.mjs
└── e2e/               # Playwright smoke tests
```

## 8. Known limitations (V1)

- No bank feeds, Xero, tax filing or transaction reconciliation — this is a
  forward-looking budgeting tool by design.
- Loan interest is a simple daily-rate estimate; there is no amortisation
  engine. Update balances manually as they change.
- Offline is read-only: the shell and last-synced data load offline with a
  clear banner; editing requires a connection (no offline queue in V1).
- Single user, single currency (NZD), light theme only.
- Category icons are stored in the schema but the picker UI is deferred.
- Runway uses the current recurring baseline, not historical actuals.
- The `budget_snapshots` table exists for future budget-versus-actual work
  but has no UI yet.
