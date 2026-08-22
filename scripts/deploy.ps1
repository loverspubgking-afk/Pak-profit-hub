# ============================================================================
# Pak Profit Hub — one-shot deploy (Windows PowerShell)
#
# Before running, set these env vars in the SAME PowerShell window:
#   $env:SUPABASE_PERSONAL_ACCESS_TOKEN = "sbp_..."
#   $env:VERCEL_TOKEN                   = "vcp_..."
#   $env:NEXT_PUBLIC_SUPABASE_URL       = "https://xxxx.supabase.co"
#   $env:NEXT_PUBLIC_SUPABASE_ANON_KEY  = "eyJ..."
#   $env:SUPABASE_SERVICE_ROLE_KEY      = "eyJ..."
#   (optional) $env:NEXT_PUBLIC_SITE_URL = "https://pak-profit-hub.vercel.app"
#
# Then run:  .\scripts\deploy.ps1
# ============================================================================
$ErrorActionPreference = "Stop"

$ProjectRef   = "brcuwxsqgimhzuclbich"
$VercelScope  = "loverspubgking-1466"
$SiteUrl      = if ($env:NEXT_PUBLIC_SITE_URL) { $env:NEXT_PUBLIC_SITE_URL } else { "https://pak-profit-hub.vercel.app" }
$RepoRoot     = Join-Path $PSScriptRoot ".."

# --- validate required env vars ---------------------------------------------
$required = @(
  "SUPABASE_PERSONAL_ACCESS_TOKEN",
  "VERCEL_TOKEN",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
)
$missing = $required | Where-Object { [string]::IsNullOrEmpty([Environment]::GetEnvironmentVariable($_)) }
if ($missing) {
  Write-Error "Missing environment variable(s): $($missing -join ', ')"
  Write-Host "Set them first, e.g.: `$env:VERCEL_TOKEN = `"vcp_...`""
  exit 1
}

# --- 1/2 apply Supabase schema ----------------------------------------------
Write-Host "==> [1/2] Applying Supabase schema to project $ProjectRef ..."
$sql = Get-Content -Raw (Join-Path $RepoRoot "supabase\schema.sql")
$body = @{ query = $sql } | ConvertTo-Json -Compress
Invoke-RestMethod -Method Post `
  -Uri "https://api.supabase.com/v1/projects/$ProjectRef/database/query" `
  -Headers @{ Authorization = "Bearer $env:SUPABASE_PERSONAL_ACCESS_TOKEN" } `
  -ContentType "application/json" -Body $body | Out-Null
Write-Host "    Schema applied ✔"

# --- 2/2 deploy to Vercel production ----------------------------------------
Write-Host "==> [2/2] Deploying to Vercel (production, scope $VercelScope) ..."
Set-Location $RepoRoot
npx -y vercel@latest deploy --prod --yes --scope $VercelScope --token $env:VERCEL_TOKEN `
  --build-env "NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL" `
  --build-env "NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY" `
  --build-env "SUPABASE_SERVICE_ROLE_KEY=$env:SUPABASE_SERVICE_ROLE_KEY" `
  --build-env "NEXT_PUBLIC_SITE_URL=$SiteUrl" `
  --env "NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL" `
  --env "NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY" `
  --env "SUPABASE_SERVICE_ROLE_KEY=$env:SUPABASE_SERVICE_ROLE_KEY" `
  --env "NEXT_PUBLIC_SITE_URL=$SiteUrl"

Write-Host ""
Write-Host "=============================================================="
Write-Host "  Deployed ✔   Live: $SiteUrl"
Write-Host "=============================================================="
