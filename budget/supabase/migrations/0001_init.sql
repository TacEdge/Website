-- TacEdge Budget — initial schema
-- All monetary values are integer cents. Every user-owned table carries
-- user_id and is protected by Row Level Security (auth.uid() = user_id).

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────────────
-- Profiles (mirrors auth.users)
-- ────────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────────────
-- Budgets
-- ────────────────────────────────────────────────────────────────────
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  display_order integer not null default 0,
  icon text,
  active boolean not null default true,
  cash_balance_cents bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create index budgets_user_idx on public.budgets (user_id);

-- ────────────────────────────────────────────────────────────────────
-- Categories
-- ────────────────────────────────────────────────────────────────────
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  budget_id uuid not null references public.budgets (id) on delete cascade,
  name text not null,
  item_type text not null check (item_type in ('income', 'expense')),
  icon text,
  display_order integer not null default 0,
  active boolean not null default true,
  is_financing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_user_idx on public.categories (user_id);
create index categories_budget_idx on public.categories (budget_id);

-- ────────────────────────────────────────────────────────────────────
-- Budget items
-- ────────────────────────────────────────────────────────────────────
create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  budget_id uuid not null references public.budgets (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  item_type text not null check (item_type in ('income', 'expense')),
  amount_cents bigint not null check (amount_cents >= 0),
  frequency text not null check (
    frequency in ('weekly', 'fortnightly', 'monthly', 'quarterly', 'annual', 'one_off')
  ),
  start_date date,
  end_date date,
  one_off_date date,
  include_in_baseline boolean not null default true,
  active boolean not null default true,
  notes text,
  payee_source text,
  gst_note text,
  reminder_date date,
  tags text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint one_off_requires_date check (frequency <> 'one_off' or one_off_date is not null)
);

create index budget_items_user_idx on public.budget_items (user_id);
create index budget_items_budget_idx on public.budget_items (budget_id);
create index budget_items_category_idx on public.budget_items (category_id);

-- ────────────────────────────────────────────────────────────────────
-- Transfers between budgets
-- Held once and projected as an outflow (source) and inflow (destination),
-- so the two sides can never drift apart. Excluded from consolidated totals.
-- ────────────────────────────────────────────────────────────────────
create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  source_budget_id uuid not null references public.budgets (id) on delete cascade,
  destination_budget_id uuid not null references public.budgets (id) on delete cascade,
  -- Reserved for a future model where transfers materialise as items:
  source_item_id uuid references public.budget_items (id) on delete set null,
  destination_item_id uuid references public.budget_items (id) on delete set null,
  amount_cents bigint not null check (amount_cents >= 0),
  frequency text not null check (
    frequency in ('weekly', 'fortnightly', 'monthly', 'quarterly', 'annual', 'one_off')
  ),
  start_date date,
  end_date date,
  one_off_date date,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfer_distinct_budgets check (source_budget_id <> destination_budget_id)
);

create index transfers_user_idx on public.transfers (user_id);
create index transfers_source_idx on public.transfers (source_budget_id);
create index transfers_destination_idx on public.transfers (destination_budget_id);

-- ────────────────────────────────────────────────────────────────────
-- Loans
-- ────────────────────────────────────────────────────────────────────
create table public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  budget_id uuid not null references public.budgets (id) on delete cascade,
  name text not null,
  current_balance_cents bigint not null check (current_balance_cents >= 0),
  original_balance_cents bigint check (original_balance_cents >= 0),
  annual_interest_rate numeric(6, 3) not null check (annual_interest_rate >= 0),
  repayment_type text not null check (
    repayment_type in ('interest_only', 'principal_and_interest')
  ),
  repayment_frequency text not null check (
    repayment_frequency in ('weekly', 'fortnightly', 'monthly', 'quarterly', 'annual')
  ),
  scheduled_repayment_cents bigint check (scheduled_repayment_cents >= 0),
  fixed_rate_review_date date,
  interest_only_end_date date,
  loan_term_end_date date,
  use_estimated_interest boolean not null default false,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index loans_user_idx on public.loans (user_id);
create index loans_budget_idx on public.loans (budget_id);

-- ────────────────────────────────────────────────────────────────────
-- Settings (one row per user)
-- ────────────────────────────────────────────────────────────────────
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  default_period text not null default 'monthly' check (
    default_period in ('weekly', 'fortnightly', 'monthly', 'annual')
  ),
  currency text not null default 'NZD',
  include_one_offs boolean not null default true,
  preferred_theme text not null default 'light',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────
-- Snapshots (future budget-versus-actual / history; no UI in V1)
-- ────────────────────────────────────────────────────────────────────
create table public.budget_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  snapshot_date date not null default current_date,
  snapshot_name text,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index budget_snapshots_user_idx on public.budget_snapshots (user_id);

-- ────────────────────────────────────────────────────────────────────
-- updated_at maintenance
-- ────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'budgets', 'categories', 'budget_items', 'transfers', 'loans', 'settings'
  ] loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ────────────────────────────────────────────────────────────────────
-- Row Level Security: every row belongs to exactly one user.
-- No anonymous access of any kind.
-- ────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.categories enable row level security;
alter table public.budget_items enable row level security;
alter table public.transfers enable row level security;
alter table public.loans enable row level security;
alter table public.budget_snapshots enable row level security;
alter table public.settings enable row level security;

create policy "own profile" on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array[
    'budgets', 'categories', 'budget_items', 'transfers', 'loans',
    'settings', 'budget_snapshots'
  ] loop
    execute format(
      'create policy "own rows" on public.%I
         for all to authenticated
         using (auth.uid() = user_id)
         with check (auth.uid() = user_id)', t);
  end loop;
end;
$$;
