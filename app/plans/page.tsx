import { AppShell } from '@/components/app-shell';
import { buyPlanAction } from '@/app/actions';
import { getPlatformSettings, getSessionWithProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';

export default async function PlansPage() {
  const { profile } = await getSessionWithProfile();
  const settings = await getPlatformSettings();
  const admin = createAdminClient();
  const { data: plans } = await admin.from('plans').select('*').eq('is_active', true).order('sort_order');

  return (
    <AppShell profile={profile!} brandName={settings?.default_brand_name || 'Pak Profit Hub'}>
      <div className="stack">
        <div className="feature-card" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <p className="section-label">Plans</p>
            <h2 style={{ marginTop: 4, marginBottom: 0 }}>Choose your earning package</h2>
            <p className="muted small" style={{ marginTop: 4 }}>Fixed-value plans • Daily collection • Premium returns</p>
          </div>
          <div className="notice" style={{ minWidth: 240, textAlign: 'center' }}>
            Wallet balance<br />
            <strong style={{ fontSize: 21, color: 'var(--emerald-light)' }}>{formatCurrency(profile!.wallet_balance)}</strong>
          </div>
        </div>
        <div className="grid-3">
          {(plans || []).map((plan) => {
            const canBuy = profile!.wallet_balance >= plan.investment_amount;
            return (
              <div className="plan-card" key={plan.id}>
                <div className="plan-topbar" />
                <span className="badge">{plan.badge || 'Available'}</span>
                <h3 style={{ marginTop: 18 }}>{plan.name}</h3>
                <div className="plan-price">{formatCurrency(plan.investment_amount)}</div>
                <div className="plan-meta">
                  <div className="meta-row"><span>Daily earning</span><strong>{formatCurrency(plan.daily_earning)}</strong></div>
                  <div className="meta-row"><span>Duration</span><strong>{plan.duration_days} days</strong></div>
                  <div className="meta-row"><span>Total payout</span><strong>{formatCurrency(plan.total_payout)}</strong></div>
                </div>
                <form action={buyPlanAction}>
                  <input type="hidden" name="planId" value={plan.id} />
                  <button className={`btn ${canBuy ? 'btn-primary' : 'btn-ghost'} btn-block`} type="submit" disabled={!canBuy}>
                    {canBuy ? 'Activate package' : `Need ${formatCurrency(plan.investment_amount - profile!.wallet_balance)} more`}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
