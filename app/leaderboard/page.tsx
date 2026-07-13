import { AppShell } from '@/components/app-shell';
import { getPlatformSettings, getSessionWithProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency, getDisplayName } from '@/lib/utils';

export default async function LeaderboardPage() {
  const { profile } = await getSessionWithProfile();
  const settings = await getPlatformSettings();
  const admin = createAdminClient();
  const { data: leaders } = await admin.from('profiles').select('id, full_name, email, total_earned').order('total_earned', { ascending: false }).limit(20);

  return (
    <AppShell profile={profile!} brandName={settings?.default_brand_name || 'Pak Profit Hub'}>
      <div className="stack">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label">Leaderboard</p>
            <h2 style={{ marginTop: 4 }}>Top earners</h2>
            <p className="muted small">Top 20 earners this period</p>
          </div>
          <div className="badge">Updated live</div>
        </div>

        <section className="table-card">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Rank</th><th>User</th><th>Total earned</th></tr></thead>
              <tbody>
                {(leaders || []).length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '36px' }} className="muted">No data yet.</td></tr>
                ) : (
                  (leaders || []).map((user, index) => (
                    <tr key={user.id} style={user.id === profile!.id ? { background: 'rgba(16,185,129,0.08)' } : undefined}>
                      <td><strong>#{index + 1}</strong></td>
                      <td>
                        {getDisplayName(user)} 
                        {user.id === profile!.id && <span className="badge" style={{ marginLeft: 8, background: 'rgba(16,185,129,0.15)', color: 'var(--emerald)' }}>You</span>}
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(user.total_earned || 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
