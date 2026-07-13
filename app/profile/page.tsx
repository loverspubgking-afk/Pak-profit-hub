import { AppShell } from '@/components/app-shell';
import { AuthSubmitButton } from '@/components/auth-submit-button';
import { updateProfileAction } from '@/app/actions';
import { getPlatformSettings, getSessionWithProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';

export default async function ProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { profile } = await getSessionWithProfile();
  const settings = await getPlatformSettings();
  const admin = createAdminClient();
  const { data: plans } = await admin.from('user_plans').select('id').eq('user_id', profile!.id).eq('status', 'active');
  const { data: referrals } = await admin.from('profiles').select('id').eq('referred_by', profile!.id);
  // FBR Tax Receipt (from platform settings — super admin editable)
  const { data: fbrReceipt } = await admin
    .from('platform_settings')
    .select('fbr_tax_receipt_url')
    .eq('id', 1)
    .maybeSingle();

  const fbrTaxReceiptUrl = fbrReceipt?.fbr_tax_receipt_url || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800'; // Premium default placeholder (can be replaced)

  return (
    <AppShell profile={profile!} brandName={settings?.default_brand_name || 'Pak Profit Hub'}>
      <div className="stack">
        {/* Premium Profile Header */}
        <div className="feature-card profile-header" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="avatar-badge" style={{ width: 84, height: 84, fontSize: 28 }}>{(profile?.full_name || profile?.email || 'P')[0]?.toUpperCase()}</div>
          <div>
            <h2 style={{ margin: 0 }}>{profile!.full_name || profile!.email?.split('@')[0]}</h2>
            <p className="muted">{profile!.email}</p>
            <p className="muted small">Wallet: {formatCurrency(profile!.wallet_balance)} • Active plans: {plans?.length || 0} • Referrals: {referrals?.length || 0}</p>
          </div>
        </div>

        {/* FBR TAX RECEIPT — Visible to users (Premium Rich Design) */}
        <div className="feature-card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <p className="section-label">OFFICIAL DOCUMENTS</p>
              <h3 style={{ margin: '4px 0 0' }}>FBR Tax Receipt</h3>
              <p className="muted small">Download this receipt for your annual tax filing with Federal Board of Revenue (Pakistan).</p>
            </div>
            <div className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald)', borderColor: 'rgba(16,185,129,0.3)' }}>
              TAX COMPLIANT
            </div>
          </div>

          <div style={{ 
            background: 'var(--bg-elevated)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 20, 
            border: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 24,
            alignItems: 'center'
          }}>
            {/* Receipt Preview */}
            <div>
              <div style={{ 
                borderRadius: 'var(--radius)', 
                overflow: 'hidden', 
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--card-shadow)'
              }}>
                <img 
                  src={fbrTaxReceiptUrl} 
                  alt="FBR Tax Receipt" 
                  style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                />
              </div>
              <p className="muted small" style={{ marginTop: 10, textAlign: 'center' }}>
                This official receipt is issued for all approved earnings on Pak Profit Hub.
              </p>
            </div>

            {/* Details + Actions */}
            <div className="stack" style={{ gap: 16 }}>
              <div>
                <div className="muted small">Document Type</div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>FBR Income Tax Receipt</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div className="muted small">Tax Year</div>
                  <div style={{ fontWeight: 600 }}>2025-26</div>
                </div>
                <div>
                  <div className="muted small">Status</div>
                  <div style={{ fontWeight: 600, color: 'var(--emerald)' }}>Verified</div>
                </div>
              </div>

              <a 
                href={fbrTaxReceiptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary btn-block"
                download
                style={{ marginTop: 8 }}
              >
                Download PDF / Image
              </a>

              <p className="muted small" style={{ textAlign: 'center' }}>
                Keep this receipt for your records. It is auto-generated for tax compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="form-card">
          <h3>Edit profile</h3>
          <form action={updateProfileAction} className="stack" style={{ marginTop: 16 }}>
            <div className="input-group">
              <label>Full name</label>
              <input className="input" type="text" name="fullName" defaultValue={profile!.full_name || ''} required />
            </div>
            <AuthSubmitButton idle="Save profile" loading="Saving..." />
          </form>
        </div>
      </div>
    </AppShell>
  );
}
