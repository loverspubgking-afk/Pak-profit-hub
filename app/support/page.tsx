import { AppShell } from '@/components/app-shell';
import { getPlatformSettings, getSessionWithProfile } from '@/lib/auth';

export default async function SupportPage() {
  const { profile } = await getSessionWithProfile();
  const settings = await getPlatformSettings();
  return (
    <AppShell profile={profile!} brandName={settings?.default_brand_name || 'Pak Profit Hub'}>
      <div className="stack">
        <div>
          <p className="section-label">Support</p>
          <h2 style={{ marginTop: 4 }}>Need help? Reach out directly</h2>
          <p className="muted small" style={{ marginTop: 4 }}>Our team responds within 2–6 hours during business days (Pakistan time).</p>
        </div>

        <div className="grid-3">
          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--emerald)' }}>Fastest</div>
              <h3 style={{ marginTop: 14 }}>WhatsApp</h3>
              <p className="muted">Direct chat for deposits, withdrawals and urgent queries.</p>
            </div>
            <a className="btn btn-primary btn-block" href={`https://wa.me/${(settings?.support_whatsapp || '').replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer">
              Open WhatsApp
            </a>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="badge" style={{ background: 'rgba(16,185,129,0.08)' }}>Official</div>
              <h3 style={{ marginTop: 14 }}>Email Support</h3>
              <p className="muted">For detailed account, plan, or payout issues.</p>
            </div>
            <a className="btn btn-outline btn-block" href={`mailto:${settings?.support_email || 'support@pakprofithub.com'}`}>
              {settings?.support_email || 'Email us'}
            </a>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="badge" style={{ background: 'rgba(16,185,129,0.08)' }}>Community</div>
              <h3 style={{ marginTop: 14 }}>Telegram Channel</h3>
              <p className="muted">Announcements, tips, and community updates.</p>
            </div>
            <a className="btn btn-ghost btn-block" href={settings?.telegram_url || '#'} target="_blank" rel="noopener noreferrer">
              Join Telegram
            </a>
          </div>
        </div>

        <div className="feature-card" style={{ textAlign: 'center', padding: '28px 24px', background: 'var(--bg-elevated)' }}>
          <p className="muted small" style={{ marginBottom: 6 }}>Average response time</p>
          <strong style={{ fontSize: 21, color: 'var(--emerald-light)' }}>2.4 hours</strong>
          <p className="muted small" style={{ marginTop: 8 }}>All queries are handled by our dedicated Pakistan-based support team.</p>
        </div>
      </div>
    </AppShell>
  );
}
