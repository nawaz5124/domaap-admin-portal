// ===================================================================
// 🎁 Donation Settings
// ===================================================================
// Location: src/pages/settings/donations.js
// Route:    /settings/donations
// Created:  31 August 2026 — FUND-P3 (read-only list)
// Updated:  23 September 2026 — FUND-P4 slice 1: page becomes Donation
//           Settings with three sections; table gains Donations + Added;
//           Add / Edit controls rendered but inert until slice 2.
//
// Styling follows settings/index.js (16px radius cards) — NOT the
// older 8px "Portal Inline Style" guide.
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getAllFunds } from '@/services/fundService';

const COLUMNS = 'minmax(0, 1fr) 150px 110px 110px 130px 80px';

const PLACEHOLDERS = [
  { title: 'Gift Aid Rate',    hint: 'The rate applied when a donor claims Gift Aid' },
  { title: 'Receipt Settings', hint: 'Wording and branding on donor receipts' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function DonationSettings() {
  const router = useRouter();
  const [funds, setFunds] = useState([]);
  const [source, setSource] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getAllFunds();
    if (result.success) {
      setFunds(result.data);
      setSource(result.source);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '24px',
    },
    placeholder: {
      backgroundColor: 'white', borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px',
      opacity: 0.6, pointerEvents: 'none',
    },
    sectionHead: {
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: '16px', padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
    },
    sectionTitle: {
      fontSize: '17px', fontWeight: '600', color: '#1e3a5f', margin: 0,
      display: 'flex', alignItems: 'center', gap: '10px',
    },
    sectionHint: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' },
    soon: {
      fontSize: '10px', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase',
      color: '#92400e', backgroundColor: '#fef3c7', padding: '3px 8px', borderRadius: '10px',
    },
    addBtn: {
      fontSize: '13px', fontWeight: '600', color: 'white', backgroundColor: '#1e3a5f',
      border: 'none', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer',
      whiteSpace: 'nowrap', flexShrink: 0,
    },

    tableHead: {
      display: 'grid', gridTemplateColumns: COLUMNS, gap: '16px', alignItems: 'center',
      padding: '10px 24px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em',
      textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #f3f4f6',
    },
    row: (active) => ({
      display: 'grid', gridTemplateColumns: COLUMNS, gap: '16px', alignItems: 'center',
      padding: '16px 24px', borderBottom: '1px solid #f3f4f6', opacity: active ? 1 : 0.55,
    }),
    nameCell: { display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 },
    swatch: (colour) => ({
      width: '8px', height: '40px', borderRadius: '4px', backgroundColor: colour, flexShrink: 0,
    }),
    emoji: { fontSize: '26px', width: '36px', textAlign: 'center', flexShrink: 0 },
    nameBlock: { minWidth: 0 },
    name: { fontSize: '15px', fontWeight: '600', color: '#1e3a5f', margin: 0 },
    tagline: {
      fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0',
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    },
    code: {
      fontSize: '12px', fontFamily: 'monospace', color: '#6b7280',
      backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '6px',
    },
    badge: (active) => ({
      display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
      fontWeight: '600', whiteSpace: 'nowrap',
      backgroundColor: active ? '#f0fdf4' : '#f3f4f6',
      color: active ? '#166534' : '#6b7280',
    }),
    num: { fontSize: '14px', fontWeight: '600', color: '#1e3a5f', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
    muted: { fontSize: '13px', color: '#6b7280' },
    editBtn: {
      fontSize: '13px', fontWeight: '600', color: '#1e3a5f', background: 'none',
      border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
    },
    disabled: { opacity: 0.45, cursor: 'not-allowed' },

    skeleton: (w) => ({ height: '12px', width: w, borderRadius: '6px', backgroundColor: '#f3f4f6' }),
    state: { padding: '40px 24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' },
    retryBtn: {
      fontSize: '13px', fontWeight: '600', color: '#1e3a5f', background: 'white',
      border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
    },
    warn: {
      margin: '16px 24px 0', padding: '12px 16px', borderRadius: '8px',
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
          Donation Settings
        </h1>
        <p style={styles.subtitle}>Manage the donation types donors can give to</p>
      </div>

      {/* ── Section 1: Donation Types (live) ───────────────────────── */}
      <section style={styles.panel}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.sectionTitle}>Donation Types</h2>
            <p style={styles.sectionHint}>These appear on the donation form, in the order shown</p>
          </div>
          <button
            style={{ ...styles.addBtn, ...styles.disabled }}
            disabled
            title="Adding arrives in the next update"
          >
            + Add donation type
          </button>
        </div>

        {source === 'fallback' && (
          <div style={styles.warn}>
            ⚠️ Showing built-in defaults — the fund list came back empty from the server.
          </div>
        )}

        <div style={styles.tableHead}>
          <span>Name</span>
          <span>Code</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Donations</span>
          <span>Added</span>
          <span />
        </div>

        {isLoading ? (
          [0, 1, 2].map((i) => (
            <div key={i} style={styles.row(true)}>
              <div style={styles.nameCell}>
                <span style={styles.swatch('#f3f4f6')} />
                <span style={styles.emoji} />
                <div style={{ display: 'grid', gap: '8px' }}>
                  <span style={styles.skeleton('120px')} />
                  <span style={styles.skeleton('180px')} />
                </div>
              </div>
              <span style={styles.skeleton('80px')} />
              <span style={styles.skeleton('60px')} />
              <span style={{ ...styles.skeleton('40px'), marginLeft: 'auto' }} />
              <span style={styles.skeleton('90px')} />
              <span />
            </div>
          ))
        ) : error ? (
          <div style={styles.state}>
            <p style={{ color: '#dc2626', margin: '0 0 12px 0' }}>Could not load donation types.</p>
            <button style={styles.retryBtn} onClick={load}>Try again</button>
          </div>
        ) : (
          funds.map((fund) => (
            <div key={fund.code} style={styles.row(fund.isActive)}>
              <div style={styles.nameCell}>
                <span style={styles.swatch(fund.colour)} />
                <span style={styles.emoji}>{fund.emoji}</span>
                <div style={styles.nameBlock}>
                  <p style={styles.name}>{fund.name}</p>
                  <p style={styles.tagline}>{fund.tagline || '—'}</p>
                </div>
              </div>
              <span><span style={styles.code}>{fund.code}</span></span>
              <span>
                <span style={styles.badge(fund.isActive)}>
                  {fund.isActive ? '● Active' : '○ Inactive'}
                </span>
              </span>
              <span style={styles.num}>{(fund.donationCount ?? 0).toLocaleString('en-GB')}</span>
              <span style={styles.muted}>{formatDate(fund.createdAt)}</span>
              <span style={{ textAlign: 'right' }}>
                <button
                  style={{ ...styles.editBtn, ...styles.disabled }}
                  disabled
                  title="Editing arrives in the next update"
                >
                  Edit
                </button>
              </span>
            </div>
          ))
        )}
      </section>

      {/* ── Sections 2 & 3: placeholders holding their place ───────── */}
      {PLACEHOLDERS.map((p) => (
        <section key={p.title} style={styles.placeholder}>
          <div style={{ ...styles.sectionHead, borderBottom: 'none' }}>
            <div>
              <h2 style={styles.sectionTitle}>
                {p.title}
                <span style={styles.soon}>🚧 Coming soon</span>
              </h2>
              <p style={styles.sectionHint}>{p.hint}</p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}