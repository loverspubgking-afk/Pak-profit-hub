-- ============================================================================
-- Pak Profit Hub — Supabase schema (run this in the Supabase SQL Editor)
-- Includes: tables, indexes, RLS policies, storage bucket, seed data
-- ============================================================================

create extension if not exists pgcrypto;

-- ────────────────────────────────────────────────────────────────────────────
-- PROFILES (1:1 with auth.users)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'user' check (role in ('user', 'staff_admin', 'super_admin')),
  status text not null default 'active' check (status in ('active', 'blocked')),
  wallet_balance numeric(14,2) not null default 0,
  total_earned numeric(14,2) not null default 0,
  referral_code text unique,
  referred_by uuid references public.profiles(id) on delete set null,
  avatar_url text,
  welcome_bonus_granted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_referred_by on public.profiles (referred_by);
create index if not exists idx_profiles_role on public.profiles (role);

-- ────────────────────────────────────────────────────────────────────────────
-- PLANS
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  investment_amount numeric(14,2) not null,
  daily_earning numeric(14,2) not null,
  duration_days integer not null check (duration_days > 0),
  total_payout numeric(14,2) not null,
  badge text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_plans_active on public.plans (is_active, sort_order);

-- ────────────────────────────────────────────────────────────────────────────
-- USER PLANS
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.user_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  invested_amount numeric(14,2) not null,
  daily_earning numeric(14,2) not null,
  duration_days integer not null,
  total_payout numeric(14,2) not null,
  collected_amount numeric(14,2) not null default 0,
  claimed_days integer not null default 0,
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_user_plans_user on public.user_plans (user_id, status);

-- ────────────────────────────────────────────────────────────────────────────
-- DEPOSITS
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null,
  payment_method text not null,
  reference_number text,
  screenshot_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null
);

create index if not exists idx_deposits_user on public.deposits (user_id);
create index if not exists idx_deposits_status on public.deposits (status);

-- ────────────────────────────────────────────────────────────────────────────
-- WITHDRAWALS
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null,
  payment_method text not null,
  account_title text,
  account_number text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null
);

create index if not exists idx_withdrawals_user on public.withdrawals (user_id);
create index if not exists idx_withdrawals_status on public.withdrawals (status);

-- ────────────────────────────────────────────────────────────────────────────
-- TRANSACTIONS
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  transaction_type text not null,
  amount numeric(14,2) not null,
  status text not null default 'approved',
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user on public.transactions (user_id, created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  kind text not null default 'system' check (kind in ('system', 'deposit', 'withdrawal', 'earning', 'referral', 'bonus', 'admin')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications (user_id, created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- BRAND SETTINGS (single row, id = 1)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.brand_settings (
  id integer primary key,
  site_name text not null default 'Pak Profit Hub',
  site_tagline text not null default 'Premium daily earning platform',
  logo_mark text,
  primary_color text not null default '#10B981',
  accent_color text not null default '#FFD700',
  hero_title text not null default 'Grow with disciplined daily earning',
  hero_subtitle text not null default 'Premium fixed-value package experience'
);

-- ────────────────────────────────────────────────────────────────────────────
-- PLATFORM SETTINGS (single row, id = 1)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.platform_settings (
  id integer primary key,
  support_email text not null default 'support@pakprofithub.com',
  support_whatsapp text not null default '',
  telegram_url text,
  minimum_deposit numeric(14,2) not null default 280,
  minimum_withdrawal numeric(14,2) not null default 500,
  referral_bonus numeric(14,2) not null default 100,
  welcome_bonus numeric(14,2) not null default 25,
  maintenance_mode boolean not null default false,
  maintenance_message text,
  announcement_active boolean not null default false,
  announcement_text text,
  default_brand_name text not null default 'Pak Profit Hub',
  fbr_tax_receipt_url text
);

-- ────────────────────────────────────────────────────────────────────────────
-- PAYMENT METHODS
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  public_details text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.plans           enable row level security;
alter table public.user_plans      enable row level security;
alter table public.deposits        enable row level security;
alter table public.withdrawals     enable row level security;
alter table public.transactions    enable row level security;
alter table public.notifications   enable row level security;
alter table public.brand_settings  enable row level security;
alter table public.platform_settings enable row level security;
alter table public.payment_methods enable row level security;

-- profiles: users can read/create/update only their own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- public marketing pages read these through the anon key
create policy "brand_settings_read_all" on public.brand_settings
  for select using (true);
create policy "platform_settings_read_all" on public.platform_settings
  for select using (true);
create policy "plans_read_all" on public.plans
  for select using (true);
create policy "payment_methods_read_all" on public.payment_methods
  for select using (true);

-- user_plans / deposits / withdrawals / transactions / notifications are
-- intentionally NOT exposed to clients — the app only touches them through the
-- service-role (admin) client. RLS stays enabled with no policies.

-- ────────────────────────────────────────────────────────────────────────────
-- STORAGE: payment-proofs bucket (uploaded via service role)
-- ────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────────────────────
-- SEED DATA (safe to re-run — uses ON CONFLICT DO NOTHING)
-- ────────────────────────────────────────────────────────────────────────────
insert into public.brand_settings (id, site_name, site_tagline, hero_title, hero_subtitle)
values (
  1,
  'Pak Profit Hub',
  'Premium daily earning platform',
  'Grow with disciplined daily earning',
  'Premium fixed-value plans. Manual verification. Referral rewards.'
)
on conflict (id) do nothing;

insert into public.platform_settings (id, support_email, support_whatsapp, minimum_deposit, minimum_withdrawal, referral_bonus, welcome_bonus)
values (1, 'support@pakprofithub.com', '', 280, 500, 100, 25)
on conflict (id) do nothing;

insert into public.payment_methods (label, public_details, is_active, sort_order) values
  ('EasyPaisa', '0300-1234567', true, 1),
  ('JazzCash', '0301-7654321', true, 2),
  ('Bank Transfer', 'Meezan Bank — PK00 MEZN 0000 0000 0000 0000', true, 3),
  ('USDT (TRC20)', 'TRC20 wallet address', true, 4)
on conflict do nothing;

insert into public.plans (id, name, slug, investment_amount, daily_earning, duration_days, total_payout, badge, is_active, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Starter', 'starter', 500, 12.50, 10, 125, 'Starter package', true, 1),
  ('22222222-2222-2222-2222-222222222222', 'Growth', 'growth', 2000, 55, 10, 550, 'Most popular', true, 2),
  ('33333333-3333-3333-3333-333333333333', 'Elite', 'elite', 5000, 150, 10, 1500, 'Premium package', true, 3)
on conflict (id) do nothing;

-- To make yourself the first super admin after signing up:
--   update public.profiles set role = 'super_admin' where email = 'you@example.com';
