#!/usr/bin/env bash
# ============================================================================
# Pak Profit Hub — one-shot deploy (macOS / Linux / Git Bash on Windows)
#
# Before running, set these env vars in your terminal:
#   export SUPABASE_PERSONAL_ACCESS_TOKEN="sbp_..."
#   export VERCEL_TOKEN="vcp_..."
#   export NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
#   export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
#   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
#   (optional) export NEXT_PUBLIC_SITE_URL="https://pak-profit-hub.vercel.app"
#
# Then run:  bash scripts/deploy.sh
# ============================================================================
set -euo pipefail

PROJECT_REF="brcuwxsqgimhzuclbich"
VERCEL_SCOPE="loverspubgking-1466"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://pak-profit-hub.vercel.app}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# --- validate required env vars ---------------------------------------------
missing=""
for v in SUPABASE_PERSONAL_ACCESS_TOKEN VERCEL_TOKEN \
         NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY \
         SUPABASE_SERVICE_ROLE_KEY; do
  if [ -z "${!v:-}" ]; then missing="$missing $v"; fi
done
if [ -n "$missing" ]; then
  echo "ERROR: missing environment variable(s):$missing"
  echo "Set them first, e.g.: export VERCEL_TOKEN=..." 
  exit 1
fi

# --- 1/2 apply Supabase schema ----------------------------------------------
echo "==> [1/2] Applying Supabase schema to project $PROJECT_REF ..."
python3 -c "import json;print(json.dumps({'query': open('$REPO_ROOT/supabase/schema.sql').read()}))" > /tmp/supabase_schema.json
curl -fsS -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
  -H "Authorization: Bearer $SUPABASE_PERSONAL_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data @/tmp/supabase_schema.json
echo "    Schema applied ✔"

# --- 2/2 deploy to Vercel production ----------------------------------------
echo "==> [2/2] Deploying to Vercel (production, scope $VERCEL_SCOPE) ..."
cd "$REPO_ROOT"
npx -y vercel@latest deploy --prod --yes --scope "$VERCEL_SCOPE" --token "$VERCEL_TOKEN" \
  --build-env "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" \
  --build-env "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-env "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY" \
  --build-env "NEXT_PUBLIC_SITE_URL=$SITE_URL" \
  --env "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" \
  --env "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --env "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY" \
  --env "NEXT_PUBLIC_SITE_URL=$SITE_URL"

echo
echo "=============================================================="
echo "  Deployed ✔   Live: $SITE_URL"
echo "=============================================================="
