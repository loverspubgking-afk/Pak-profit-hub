import { AppShell } from '@/components/app-shell';
import { getPlatformSettings, getSessionWithProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default async function TransactionsPage() {
  const { profile } = await getSessionWithProfile();
  const settings = await getPlatformSettings();
  const admin = createAdminClient();
  const { data: transactions } = await admin.from('transactions').select('*').eq('user_id', profile!.id).order('created_at', { ascending: false });

  return (
    <AppShell profile={profile!} brandName={settings?.default_brand_name || 'Pak Profit Hub'}>
      <div className="stack">
        <div className="transactions-header">
          <div>
            <p className="section-label">Transactions</p>
            <h2 style={{ marginTop: 4 }}>Full wallet history</h2>
            <p className="muted small">All deposits, withdrawals, earnings &amp; bonuses</p>
          </div>
          <div className="badge">{(transactions || []).length} records</div>
        </div>

        <section className="table-card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(transactions || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '46px 20px' }}>
                      <p className="muted" style={{ marginBottom: 6 }}>No transactions yet</p>
                      <p className="muted small">Make a deposit and activate a plan to see activity here.</p>
                    </td>
                  </tr>
                ) : (
                  (transactions || []).map((tx) => (
                    <tr key={tx.id}>
                      <td><strong>{tx.transaction_type.replace('_', ' ')}</strong></td>
                      <td>{tx.description}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(tx.amount)}</td>
                      <td><span className={`status-pill ${tx.status}`}>{tx.status}</span></td>
                      <td className="muted small">{formatDateTime(tx.created_at)}</td>
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
