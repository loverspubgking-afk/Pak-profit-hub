import Link from 'next/link';
import { AuthSubmitButton } from '@/components/auth-submit-button';
import { BrandLogo } from '@/components/brand-logo';
import { signInAction } from '@/app/actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === 'string' ? params.error : null;
  const blocked = params.blocked === '1';

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div style={{ maxWidth: 460 }}>
          <BrandLogo height={60} brandName="Pak Profit Hub" />
          <h2 className="section-title" style={{ marginTop: 24 }}>Welcome back to your premium earning workspace</h2>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.55, maxWidth: 400 }}>
            Login to manage plans, deposits, withdrawals, wallet balance, and referral rewards.
          </p>
          <div style={{ marginTop: 42, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="notice" style={{ padding: '8px 16px', fontSize: 13 }}>Manual verification</div>
            <div className="notice" style={{ padding: '8px 16px', fontSize: 13 }}>24h collection cycles</div>
          </div>
        </div>
      </div>
      <div className="auth-card-wrap">
        <div className="auth-card shell-card">
          <h1 style={{ marginTop: 0 }}>Login</h1>
          <p className="muted">Access your dashboard securely.</p>
          {blocked && <div className="notice error">Your account is blocked. Contact support for review.</div>}
          {error && <div className="notice error" style={{ marginTop: 14 }}>{decodeURIComponent(error)}</div>}
          <form action={signInAction} style={{ marginTop: 20 }}>
            <div className="input-group">
              <label>Email</label>
              <input className="input" type="email" name="email" required placeholder="you@example.com" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input className="input" type="password" name="password" required placeholder="Enter your password" />
            </div>
            <AuthSubmitButton idle="Login" loading="Logging in..." />
          </form>
          <div className="auth-meta muted small">
            Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--emerald)' }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
