// ===================================================================
// 🎁 Donation Types — Settings
// ===================================================================
// Location: src/pages/settings/donation-types.js
// Route: /settings/donation-types
// Created: 31 August 2026 — FUND-P3
//
// READ-ONLY list of the central Fund table. Add/edit lands at P4.
// Styling follows settings/index.js (16px radius cards, gradient
// headers) — NOT the older 8px "Portal Inline Style" guide.
// ===================================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllFunds } from '@/services/fundService';

export default function DonationTypes() {
  const router = useRouter();
  const [funds, setFunds] = useState([]);
  const [source, setSource] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const result = await getAllFunds();
      if (!alive) return;

      if (result.success) {
        setFunds(result.data);
        setSource(result.source);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  const styles = {
    header: { marginBottom: '32px' },
    backLink: {
      fontSize: '13px', color: '#6b7280', background: 'none', border: 'none',
      padding: 0, cursor: 'pointer', marginBottom: '12px', display: 'block',
    },
    pageTitle: {
      fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f',
      margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px',
    },
    subtitle: { fontSize: '14px', color: '#6b7280', margin: 0 },
    panel: {
      backgroundColor: 'white', borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden',
    },
    row: {
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '18px 24px', borderBottom: '1px solid #f3f4f6',
    },
    swatch: (colour) => ({
      width: '10px', alignSelf: 'stretch', borderRadius: '4px',
      backgroundColor: colour, flexShrink: 0,
    }),
    emoji: { fontSize: '28px', width: '36px', textAlign: 'center' },
    nameBlock: { flex: 1, minWidth: 0 },
    name: { fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: 0 },
    tagline: { fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' },
    code: {
      fontSize: '12px', fontFamily: 'monospace', color: '#6b7280',
      backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '6px',
    },
    badge: (active) => ({
      padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
      fontWeight: '600', whiteSpace: 'nowrap',
      backgroundColor: active ? '#f0fdf4' : '#f3f4f6',
      color: active ? '#166534' : '#6b7280',
    }),
    state: { padding: '48px 24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' },
    warn: {
      margin: '0 0 16px 0', padding: '12px 16px', borderRadius: '8px',
      backgroundColor: '#fef3c7', color: '#92400e', fontSize: '13px',
    },
  };

  return (
    <>
      <div style={styles.header}>
        <button style={styles.backLink} onClick={() => router.push('/settings')}>
          ← Back to Settings
        </button>
        <h1 style={styles.pageTitle}>
          <span>🎁</span>
          Donation Types
        </h1>
        <p style={styles.subtitle}>
          The funds donors can give to. Editing arrives in a later release.
        </p>
      </div>

      {source === 'fallback' && (
        <div style={styles.warn}>
          ⚠️ Showing built-in defaults — the fund list came back empty from the server.
        </div>
      )}

      <div style={styles.panel}>
        {isLoading ? (
          <div style={styles.state}>Loading funds…</div>
        ) : error ? (
          <div style={{ ...styles.state, color: '#dc2626' }}>
            Could not load funds: {error}
          </div>
        ) : (
          funds.map((fund) => (
            <div key={fund.code} style={styles.row}>
              <span style={styles.swatch(fund.colour)} />
              <span style={styles.emoji}>{fund.emoji}</span>
              <div style={styles.nameBlock}>
                <p style={styles.name}>{fund.name}</p>
                <p style={styles.tagline}>{fund.tagline || '—'}</p>
              </div>
              <span style={styles.code}>{fund.code}</span>
              <span style={styles.badge(fund.isActive)}>
                {fund.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}