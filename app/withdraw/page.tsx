import { AppShell } from '@/components/app-shell';
import { AuthSubmitButton } from '@/components/auth-submit-button';
import { submitWithdrawalAction } from '@/app/actions';
import { getPlatformSettings, getSessionWithProfile } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';

export default async function WithdrawPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { profile } = await getSessionWithProfile();
  const settings = await getPlatformSettings();
  const params = await searchParams;
  const message = typeof params.success === 'string' ? params.success : typeof params.error === 'string' ? params.error : null;
  const type = params.success ? 'success' : params.error ? 'error' : null;

  return (
    <AppShell profile={profile!} brandName={settings?.default_brand_name || 'Pak Profit Hub'}>
      <div className="stack">
        <div className="feature-card">
          <p className="section-label">Withdraw</p>
          <h2 style={{ marginTop: 4 }}>Request a payout</h2>
          <div style={{ marginTop: 14 }}>
            <span className="muted small">Available balance</span>
            <div className="withdraw-balance">{formatCurrency(profile!.wallet_balance)}</div>
          </div>
        </div>

        <div className="form-card">
          <h3 style={{ marginBottom: 18 }}>Withdrawal details</h3>
          <form action={submitWithdrawalAction} className="stack">
            <div className="form-grid">
              <div className="input-group">
                <label>Amount (PKR)</label>
                <input className="input" type="number" min={settings?.minimum_withdrawal || 500} max={profile!.wallet_balance} name="amount" placeholder="Minimum 500" required />
              </div>
              <div className="input-group">
                <label>Payment method</label>
                <select className="select" name="paymentMethod" required>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="USDT">USDT (TRC20)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Account title</label>
                <input className="input" type="text" name="accountTitle" placeholder="Full name as per account" required />
              </div>
              <div className="input-group">
                <label>Account number / wallet ID</label>
                <input className="input" type="text" name="accountNumber" placeholder="03xx-xxxxxxx or IBAN" required />
              </div>
            </div>
            <div className="notice" style={{ marginTop: 8, fontSize: 13 }}>
              Minimum withdrawal: {formatCurrency(settings?.minimum_withdrawal || 500)}. Processing within 24 hours.
            </div>
            <AuthSubmitButton idle="Request withdrawal" loading="Submitting..." />
          </form>
        </div>
      </div>
    </AppShell>
  );
}
