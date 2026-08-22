# Pak Profit Hub

Premium Pakistani daily earning / investment platform built with **Next.js (App Router) + Supabase**. Fixed-value plans, wallet management, referrals, deposits/withdrawals with manual admin approval, and a full role-based admin panel.

## Stack

- **Next.js 16** (React 19, TypeScript, App Router, Server Actions)
- **Supabase** (Auth, Postgres, Storage for payment proofs)
- **Tailwind CSS 4 + custom CSS design system**
- **Sonner** (toasts) & **lucide-react** (icons)

## Features

- Email/password auth (Supabase Auth) with email verification
- Welcome bonus + referral bonus engine (triggered after first approved deposit)
- Fixed-value earning plans with 24h collection cycles
- Manual deposit approval (proof screenshot upload to Supabase Storage)
- Withdrawal requests with admin approval / rejection (auto refund)
- Wallet, transactions, notifications, leaderboard, support pages
- Role-based admin panel (`user`, `staff_admin`, `super_admin`)
  - Super admin: branding, plans, platform settings, payment methods, FBR tax receipt URL
- Marketing landing page with maintenance-mode support

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials
npm run dev
```

Open http://localhost:3000

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, admin operations) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (email redirects + referral links) |

## Database setup

Run [`supabase/schema.sql`](supabase/schema.sql) in the **Supabase SQL Editor** before first use. It creates all tables, indexes, row-level security policies, the `payment-proofs` storage bucket, and seeds default brand/platform settings plus 3 starter plans.

To create the first admin, update the user's role in the `profiles` table:

```sql
update profiles set role = 'super_admin' where email = 'you@example.com';
```

## Deployment (Vercel)

### Quick deploy (recommended)

The repo includes a one-shot deploy script that applies the Supabase schema AND
deploys to Vercel production in one go:

**macOS / Linux / Git Bash:**
```bash
export SUPABASE_PERSONAL_ACCESS_TOKEN="sbp_..."
export VERCEL_TOKEN="vcp_..."
export NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
export NEXT_PUBLIC_SITE_URL="https://pak-profit-hub.vercel.app"
bash scripts/deploy.sh
```

**Windows PowerShell:**
```powershell
$env:SUPABASE_PERSONAL_ACCESS_TOKEN = "sbp_..."
$env:VERCEL_TOKEN                   = "vcp_..."
$env:NEXT_PUBLIC_SUPABASE_URL       = "https://xxxx.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY  = "eyJ..."
$env:SUPABASE_SERVICE_ROLE_KEY      = "eyJ..."
$env:NEXT_PUBLIC_SITE_URL           = "https://pak-profit-hub.vercel.app"
.\scripts\deploy.ps1
```

The script: (1) runs [`supabase/schema.sql`](supabase/schema.sql) through the
Supabase Management API, (2) deploys to Vercel with all env vars, and (3) prints
the live URL.

### Manual deploy

1. Run [`supabase/schema.sql`](supabase/schema.sql) in the **Supabase SQL Editor** (or via the script above).
2. On Vercel: New Project → import this repo (Next.js preset).
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy.

### Make yourself admin (after first signup)

```sql
update profiles set role = 'super_admin' where email = 'you@example.com';
```

Note: Poppins is self-hosted (`app/fonts/`), so builds never depend on Google Fonts availability.

## Project structure

```
app/                  # routes (pages) + server actions
components/           # shared UI components
lib/                  # types, utils, supabase clients, auth helpers
supabase/schema.sql   # full database setup script
public/               # static assets
```
