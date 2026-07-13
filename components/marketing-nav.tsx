import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

export function MarketingNav({ brandName = 'Pak Profit Hub' }: { brandName?: string }) {
  return (
    <header className="marketing-nav shell-card" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="shell-container nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
        <BrandLogo brandName={brandName} />
        <nav className="nav-links" style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 500 }}>
          <a href="#home" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Home</a>
          <a href="#about" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>How it works</a>
          <a href="#plans" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Plans</a>
          <a href="#support" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Support</a>
        </nav>
        <div className="nav-actions" style={{ display: 'flex', gap: 12 }}>
          <Link className="btn btn-ghost" href="/login" style={{ padding: '10px 22px', fontSize: 14 }}>
            Login
          </Link>
          <Link className="btn btn-primary" href="/signup" style={{ padding: '10px 26px', fontSize: 14 }}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
