import { MarketingNav } from '@/components/marketing-nav';
import { createClient } from '@/lib/supabase/server';
import type { BrandSettings, PlatformSettings } from '@/lib/types';

export default async function AboutPage() {
  const supabase = await createClient();
  const [{ data: brand }, { data: settings }] = await Promise.all([
    supabase.from('brand_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('platform_settings').select('*').eq('id', 1).maybeSingle()
  ]);

  const brandData = brand as BrandSettings | null;
  const platform = settings as PlatformSettings | null;
  const brandName = brandData?.site_name || platform?.default_brand_name || 'Pak Profit Hub';

  return (
    <>
      <MarketingNav brandName={brandName} />
      <section className="page-section">
        <div className="shell-container stack">
          <div style={{ maxWidth: 680 }}>
            <p className="section-label">About Us</p>
            <h1 className="section-title">About {brandName}</h1>
            <p className="muted" style={{ fontSize: 18, maxWidth: 560 }}>
              A premium Pakistani fintech platform delivering fixed-value daily earning plans with professional-grade manual controls and full transparency.
            </p>
          </div>

          <div className="feature-card" style={{ padding: 32 }}>
            <h3 style={{ marginBottom: 12 }}>Our platform model</h3>
            <p className="muted" style={{ fontSize: 15, lineHeight: 1.65 }}>
              Users create verified accounts, fund wallets through manually approved channels, activate fixed-value plans, and collect earnings every 24 hours. 
              Every plan runs on its own cycle with real backend tracking and admin oversight.
            </p>
          </div>

          <div className="about-grid">
            <div className="feature-card">
              <div className="badge" style={{ marginBottom: 14 }}>Core Value</div>
              <h3>Trust &amp; Transparency</h3>
              <p className="muted">Manual approvals, role-based admin workflows, and fully server-backed records for every transaction.</p>
            </div>
            <div className="feature-card">
              <div className="badge" style={{ marginBottom: 14 }}>Core Value</div>
              <h3>Full Control</h3>
              <p className="muted">Super admins manage branding, plans, bonuses, payment methods, and platform settings in real time.</p>
            </div>
            <div className="feature-card">
              <div className="badge" style={{ marginBottom: 14 }}>Core Value</div>
              <h3>Real Growth</h3>
              <p className="muted">Users can hold multiple plans simultaneously and reinvest wallet balance for compounding returns.</p>
            </div>
          </div>

          <div className="feature-card" style={{ background: 'var(--bg-elevated)', padding: 28, marginTop: 8, borderColor: 'rgba(16,185,129,0.18)' }}>
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <div className="muted small">Founded</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--emerald-light)' }}>2025</div>
              </div>
              <div>
                <div className="muted small">Focus</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>Pakistan-first</div>
              </div>
              <div>
                <div className="muted small">Model</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>Fixed-value plans</div>
              </div>
              <div>
                <div className="muted small">Payouts</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--emerald-light)' }}>Daily</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
