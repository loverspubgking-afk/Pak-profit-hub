'use client';

import { useState } from 'react';

interface PaymentMethodPreviewProps {
  initialLabel?: string;
  initialDetails?: string;
}

export function PaymentMethodPreview({ initialLabel = 'EasyPaisa', initialDetails = '0300-1234567' }: PaymentMethodPreviewProps) {
  const [label, setLabel] = useState(initialLabel);
  const [details, setDetails] = useState(initialDetails);

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 8 }}>LIVE PREVIEW</div>
      
      <div className="feature-card" style={{ 
        background: 'var(--bg-elevated)', 
        padding: 20, 
        border: '2px dashed var(--emerald)',
        maxWidth: 380
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 48, height: 48, 
            borderRadius: 'var(--radius)', 
            background: 'var(--emerald-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 18
          }}>
            {label.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{label || 'Payment Method'}</div>
            <div className="muted small" style={{ marginTop: 2 }}>{details || 'Account / Number details'}</div>
          </div>
        </div>
        <div className="muted small" style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
          This is exactly how users will see it on the deposit page.
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
        <strong>Live editing:</strong> Changes here reflect instantly in preview.
      </div>
    </div>
  );
}
