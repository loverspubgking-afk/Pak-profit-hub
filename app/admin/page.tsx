import Link from 'next/link';
import { AuthSubmitButton } from '@/components/auth-submit-button';
import {
  approveDepositAction,
  approveWithdrawalAction,
  createOrUpdatePaymentMethodAction,
  createOrUpdatePlanAction,
  deletePaymentMethodAction,
  rejectDepositAction,
  rejectWithdrawalAction,
  updateBrandSettingsAction,
  updatePlatformSettingsAction
} from '@/app/actions';
import { getPlatformSettings, requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency, formatDateTime, getDisplayName } from '@/lib/utils';

const tabs = ['overview', 'deposits', 'withdrawals', 'plans', 'branding', 'settings', 'payment-methods', 'users'] as const;

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const actor = await requireRole(['super_admin', 'staff_admin']);
  const admin = createAdminClient();
  const platform = await getPlatformSettings();

  const { data: paymentMethods } = await admin
    .from('payment_methods')
    .select('*')
    .order('sort_order');
  const params = await searchParams;
  const rawTab = typeof params.tab === 'string' ? params.tab : '';
  const currentTab = tabs.includes(rawTab as (typeof tabs)[number]) ? (rawTab as (typeof tabs)[number]) : 'overview';
  const success = typeof params.success === 'string' ? params.success : null;
  const error = typeof params.error === 'string' ? params.error : null;

  const [
    { data: brand },
    { data: users },
    { data: plans },
    { data: deposits },
    { data: withdrawals },
    { data: transactions }
  ] = await Promise.all([
    admin.from('brand_settings').select('*').eq('id', 1).maybeSingle(),
    admin.from('profiles').select('*').order('created_at', { ascending: false }).limit(20),
    admin.from('plans').select('*').order('sort_order'),
    admin.from('deposits').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(20),
    admin.from('withdrawals').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(20),
    admin.from('transactions').select('*')
  ]);

  const totalUsers = users?.length || 0;
  const totalDeposits = (transactions || []).filter((item) => item.transaction_type === 'deposit').reduce((sum, item) => sum + Number(item.amount), 0);
  const totalWithdrawals = (transactions || []).filter((item) => item.transaction_type === 'withdrawal').reduce((sum, item) => sum + Number(item.amount), 0);
  const pendingDeposits = (deposits || []).filter((item) => item.status === 'pending').length;
  const pendingWithdrawals = (withdrawals || []).filter((item) => item.status === 'pending').length;
  const isSuper = actor.role === 'super_admin';

  return (
    <div style={{ minHeight: '100vh', padding: 18 }}>
      <div className="feature-card" style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <p className="section-label">Admin panel</p>
          <h1 style={{ marginTop: 4 }}>{brand?.site_name || platform?.default_brand_name || 'Pak Profit Hub'}</h1>
          <p className="muted small">Logged in as {actor.role.replace('_', ' ')}</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline">Back to user area</Link>
      </div>

      {success && <div className="notice success" style={{ marginBottom: 16 }}>{decodeURIComponent(success)}</div>}
      {error && <div className="notice error" style={{ marginBottom: 16 }}>{decodeURIComponent(error)}</div>}

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <Link key={tab} className={`admin-tab ${currentTab === tab ? 'active' : ''}`} href={`/admin?tab=${tab}`}>
            {tab}
          </Link>
        ))}
      </div>

      {currentTab === 'overview' && (
        <div className="stack">
          <section className="dashboard-grid">
            <div className="dash-card"><span className="muted small">Total users</span><strong>{totalUsers}</strong></div>
            <div className="dash-card"><span className="muted small">Approved deposits</span><strong>{formatCurrency(totalDeposits)}</strong></div>
            <div className="dash-card"><span className="muted small">Approved withdrawals</span><strong>{formatCurrency(totalWithdrawals)}</strong></div>
            <div className="dash-card"><span className="muted small">Pending cases</span><strong>{pendingDeposits + pendingWithdrawals}</strong></div>
          </section>
          <section className="table-card">
            <div style={{ padding: 20 }}><h3 style={{ margin: 0 }}>Latest users</h3></div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>User</th><th>Role</th><th>Balance</th><th>Status</th><th>Joined</th></tr></thead>
                <tbody>
                  {(users || []).slice(0, 10).map((user) => (
                    <tr key={user.id}>
                      <td>{getDisplayName(user)}</td>
                      <td>{user.role}</td>
                      <td>{formatCurrency(user.wallet_balance)}</td>
                      <td><span className={`status-pill ${user.status}`}>{user.status}</span></td>
                      <td>{formatDateTime(user.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {currentTab === 'deposits' && (
        <section className="table-card">
          <div style={{ padding: 20 }}><h3 style={{ margin: 0 }}>Deposit approvals</h3></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>User</th><th>Amount</th><th>Method</th><th>Reference</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {(deposits || []).map((deposit) => (
                  <tr key={deposit.id}>
                    <td>{getDisplayName(deposit.profiles)}</td>
                    <td>{formatCurrency(deposit.amount)}</td>
                    <td>{deposit.payment_method}</td>
                    <td>{deposit.reference_number}</td>
                    <td><span className={`status-pill ${deposit.status}`}>{deposit.status}</span></td>
                    <td>
                      {deposit.status === 'pending' ? (
                        <div className="inline-form">
                          <form action={approveDepositAction}><input type="hidden" name="depositId" value={deposit.id} /><button className="btn btn-primary" type="submit">Approve</button></form>
                          <form action={rejectDepositAction}>
                            <input type="hidden" name="depositId" value={deposit.id} />
                            <input className="input" type="text" name="note" placeholder="Reason" style={{ maxWidth: 160 }} />
                            <button className="btn btn-ghost" type="submit">Reject</button>
                          </form>
                        </div>
                      ) : 'Reviewed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {currentTab === 'withdrawals' && (
        <section className="table-card">
          <div style={{ padding: 20 }}><h3 style={{ margin: 0 }}>Withdrawal approvals</h3></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>User</th><th>Amount</th><th>Method</th><th>Account</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {(withdrawals || []).map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>{getDisplayName(withdrawal.profiles)}</td>
                    <td>{formatCurrency(withdrawal.amount)}</td>
                    <td>{withdrawal.payment_method}</td>
                    <td>{withdrawal.account_title} • {withdrawal.account_number}</td>
                    <td><span className={`status-pill ${withdrawal.status}`}>{withdrawal.status}</span></td>
                    <td>
                      {withdrawal.status === 'pending' ? (
                        <div className="inline-form">
                          <form action={approveWithdrawalAction}><input type="hidden" name="withdrawalId" value={withdrawal.id} /><button className="btn btn-primary" type="submit">Approve</button></form>
                          <form action={rejectWithdrawalAction}>
                            <input type="hidden" name="withdrawalId" value={withdrawal.id} />
                            <input className="input" type="text" name="note" placeholder="Reason" style={{ maxWidth: 160 }} />
                            <button className="btn btn-ghost" type="submit">Reject</button>
                          </form>
                        </div>
                      ) : 'Reviewed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {currentTab === 'plans' && (
        <div className="stack">
          <section className="form-card">
            <h3>{isSuper ? 'Create or update plan' : 'Plan list (view only)'}</h3>
            {isSuper && (
              <form action={createOrUpdatePlanAction} className="stack" style={{ marginTop: 18 }}>
                <div className="form-grid">
                  <div className="input-group"><label>Name</label><input className="input" name="name" required /></div>
                  <div className="input-group"><label>Slug</label><input className="input" name="slug" required /></div>
                  <div className="input-group"><label>Investment amount</label><input className="input" type="number" name="investmentAmount" required /></div>
                  <div className="input-group"><label>Daily earning</label><input className="input" type="number" name="dailyEarning" required /></div>
                  <div className="input-group"><label>Duration days</label><input className="input" type="number" name="durationDays" required defaultValue={10} /></div>
                  <div className="input-group"><label>Total payout</label><input className="input" type="number" name="totalPayout" required /></div>
                  <div className="input-group"><label>Badge</label><input className="input" name="badge" /></div>
                  <div className="input-group"><label>Sort order</label><input className="input" type="number" name="sortOrder" defaultValue={0} /></div>
                </div>
                <div className="input-group"><label><input type="checkbox" name="isActive" defaultChecked /> Active</label></div>
                <AuthSubmitButton idle="Save plan" loading="Saving..." />
              </form>
            )}
          </section>
          <section className="table-card">
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Investment</th><th>Daily</th><th>Duration</th><th>Total payout</th><th>Status</th></tr></thead>
                <tbody>
                  {(plans || []).map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.name}</td>
                      <td>{formatCurrency(plan.investment_amount)}</td>
                      <td>{formatCurrency(plan.daily_earning)}</td>
                      <td>{plan.duration_days} days</td>
                      <td>{formatCurrency(plan.total_payout)}</td>
                      <td><span className={`status-pill ${plan.is_active ? 'active' : 'blocked'}`}>{plan.is_active ? 'active' : 'disabled'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {currentTab === 'branding' && (
        <section className="form-card">
          <h3>Brand settings</h3>
          {isSuper ? (
            <form action={updateBrandSettingsAction} className="stack" style={{ marginTop: 18 }}>
              <div className="form-grid">
                <div className="input-group"><label>Site name</label><input className="input" name="siteName" defaultValue={brand?.site_name || 'Pak Profit Hub'} required /></div>
                <div className="input-group"><label>Tagline</label><input className="input" name="siteTagline" defaultValue={brand?.site_tagline || 'Premium daily earning platform'} required /></div>
                <div className="input-group"><label>Hero title</label><input className="input" name="heroTitle" defaultValue={brand?.hero_title || 'Grow with disciplined daily earning'} required /></div>
                <div className="input-group"><label>Hero subtitle</label><input className="input" name="heroSubtitle" defaultValue={brand?.hero_subtitle || 'Premium fixed-value package experience'} required /></div>
                <div className="input-group"><label>Primary color</label><input className="input" name="primaryColor" defaultValue={brand?.primary_color || '#10B981'} /></div>
                <div className="input-group"><label>Accent color</label><input className="input" name="accentColor" defaultValue={brand?.accent_color || '#FFD700'} /></div>
              </div>
              <AuthSubmitButton idle="Save branding" loading="Saving..." />
            </form>
          ) : <div className="notice">Staff admin cannot change branding.</div>}
        </section>
      )}

      {currentTab === 'settings' && (
        <section className="form-card">
          <h3>Platform settings</h3>
          {isSuper ? (
            <form action={updatePlatformSettingsAction} className="stack" style={{ marginTop: 18 }}>
              <div className="form-grid">
                <div className="input-group"><label>Support email</label><input className="input" name="supportEmail" defaultValue={platform?.support_email || ''} /></div>
                <div className="input-group"><label>Support WhatsApp</label><input className="input" name="supportWhatsApp" defaultValue={platform?.support_whatsapp || ''} /></div>
                <div className="input-group"><label>Telegram URL</label><input className="input" name="telegramUrl" defaultValue={platform?.telegram_url || ''} /></div>
                <div className="input-group"><label>Default brand name</label><input className="input" name="defaultBrandName" defaultValue={platform?.default_brand_name || 'Pak Profit Hub'} /></div>
                <div className="input-group"><label>Minimum deposit</label><input className="input" type="number" name="minimumDeposit" defaultValue={platform?.minimum_deposit || 280} /></div>
                <div className="input-group"><label>Minimum withdrawal</label><input className="input" type="number" name="minimumWithdrawal" defaultValue={platform?.minimum_withdrawal || 500} /></div>
                <div className="input-group"><label>Referral bonus</label><input className="input" type="number" name="referralBonus" defaultValue={platform?.referral_bonus || 100} /></div>
                <div className="input-group"><label>Welcome bonus</label><input className="input" type="number" name="welcomeBonus" defaultValue={platform?.welcome_bonus || 25} /></div>
              </div>

              {/* FBR TAX RECEIPT — Super Admin Editable */}
              <div className="input-group">
                <label>FBR Tax Receipt Image URL (visible to all users)</label>
                <input 
                  className="input" 
                  name="fbrTaxReceiptUrl" 
                  defaultValue={platform?.fbr_tax_receipt_url || ''} 
                  placeholder="https://example.com/fbr-receipt.png" 
                />
                <p className="muted small" style={{ marginTop: 6 }}>Paste a direct image URL. This will appear in the Profile page for every user.</p>
              </div>

              <div className="input-group"><label>Announcement text</label><textarea className="textarea" name="announcementText" defaultValue={platform?.announcement_text || ''} /></div>
              <div className="input-group"><label>Maintenance message</label><textarea className="textarea" name="maintenanceMessage" defaultValue={platform?.maintenance_message || ''} /></div>
              <div className="inline-form">
                <label><input type="checkbox" name="announcementActive" defaultChecked={platform?.announcement_active} /> Announcement active</label>
                <label><input type="checkbox" name="maintenanceMode" defaultChecked={platform?.maintenance_mode} /> Maintenance mode</label>
              </div>
              <AuthSubmitButton idle="Save settings" loading="Saving..." />
            </form>
          ) : <div className="notice">Staff admin cannot update system settings.</div>}
        </section>
      )}

      {currentTab === 'payment-methods' && (
        <div className="stack">
          <section className="form-card">
            <h3>Payment Methods <span className="muted small">(Live Preview)</span></h3>
            <p className="muted">These appear on the Deposit page. Only super admins can manage.</p>

            {isSuper ? (
              <>
                <form action={createOrUpdatePaymentMethodAction} className="stack" style={{ marginTop: 20 }}>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Label (e.g. EasyPaisa)</label>
                      <input className="input" name="label" required placeholder="EasyPaisa" />
                    </div>
                    <div className="input-group">
                      <label>Public Details (account / number)</label>
                      <input className="input" name="publicDetails" required placeholder="0300-1234567" />
                    </div>
                    <div className="input-group">
                      <label>Sort Order</label>
                      <input className="input" type="number" name="sortOrder" defaultValue={0} />
                    </div>
                    <div className="input-group">
                      <label><input type="checkbox" name="isActive" defaultChecked /> Active</label>
                    </div>
                  </div>
                  <AuthSubmitButton idle="Save Payment Method" loading="Saving..." />
                </form>

                {/* LIVE PREVIEW */}
                <div style={{ marginTop: 24 }}>
                  <div className="section-label">LIVE PREVIEW (updates as you type in real form)</div>
                  <div className="feature-card" style={{ 
                    padding: 20, 
                    border: '2px dashed var(--emerald)', 
                    maxWidth: 380,
                    background: 'var(--bg-elevated)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 48, height: 48, borderRadius: 'var(--radius)', 
                        background: 'var(--emerald-gradient)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 18 
                      }}>P</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 17 }}>EasyPaisa / JazzCash / Bank</div>
                        <div className="muted small" style={{ marginTop: 2 }}>0300-XXXXXXX (preview)</div>
                      </div>
                    </div>
                    <div className="muted small" style={{ marginTop: 16 }}>Users will see this exact card on deposit page.</div>
                  </div>
                </div>
              </>
            ) : <div className="notice">Only super admins can manage payment methods.</div>}
          </section>

          {/* Existing Payment Methods List */}
          <section className="table-card">
            <div style={{ padding: 20 }}><h3 style={{ margin: 0 }}>Current Payment Methods</h3></div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Label</th><th>Details</th><th>Active</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {(paymentMethods || []).length === 0 && (
                    <tr><td colSpan={4} className="muted">No payment methods yet.</td></tr>
                  )}
                  {(paymentMethods || []).map((pm: { id: string; label: string; public_details: string | null; is_active: boolean }) => (
                    <tr key={pm.id}>
                      <td><strong>{pm.label}</strong></td>
                      <td>{pm.public_details}</td>
                      <td><span className={`status-pill ${pm.is_active ? 'active' : 'blocked'}`}>{pm.is_active ? 'Active' : 'Disabled'}</span></td>
                      <td>
                        {isSuper && (
                          <form action={deletePaymentMethodAction} style={{ display: 'inline' }}>
                            <input type="hidden" name="id" value={pm.id} />
                            <button type="submit" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }}>Delete</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {currentTab === 'users' && (
        <section className="table-card">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Balance</th><th>Status</th></tr></thead>
              <tbody>
                {(users || []).map((user) => (
                  <tr key={user.id}>
                    <td>{getDisplayName(user)}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{formatCurrency(user.wallet_balance)}</td>
                    <td><span className={`status-pill ${user.status}`}>{user.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
