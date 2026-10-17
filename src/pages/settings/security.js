/**
 * Login V2 — Security: set up (or review) the authenticator app for the signed-in user.
 * Flow: GET totp → 404 with secret/url → scan QR → POST first code → create recovery codes → show once → done.
 * Reached from finishV2 (?setup=1) when a login reply carries no mfa method, or from Settings later.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import { getTotp, activateTotp, createRecoveryCodes, getAuthenticators, fieldErrors } from '@/services/authV2';

const card  = { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', maxWidth: '560px' };
const label = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' };
const btn   = { padding: '12px 20px', fontSize: '15px', fontWeight: '600', color: '#fff', background: '#1e3a5f', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const mono  = { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '15px', letterSpacing: '1px' };

export default function Security() {
  const router = useRouter();
  const isSetup = router.query.setup === '1';
  const [stage, setStage] = useState('loading');
  const [totpUrl, setTotpUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [authenticators, setAuthenticators] = useState([]);

  useEffect(() => {
    (async () => {
      const { status, body } = await getTotp();
      if (status === 404 && body?.meta?.totp_url) {
        setTotpUrl(body.meta.totp_url); setSecret(body.meta.secret); setStage('scan');
      } else if (status === 200) {
        const list = await getAuthenticators(); setAuthenticators(list.body?.data || []); setStage('enrolled');
      } else if (status === 401) {
        router.replace('/login');
      } else {
        setError('Could not load security settings. Please try again.'); setStage('scan');
      }
    })();
  }, [router]);

  const handleActivate = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const res = await activateTotp(code.trim());
      if (res.status !== 200) { setError(fieldErrors(res.body).code || 'Incorrect code. Please try again.'); return; }
      const rc = await createRecoveryCodes();
      setCodes(rc.body?.data?.unused_codes || []);
      setStage('codes');
    } catch { setError('Network error. Please check your connection.'); }
    finally { setBusy(false); }
  };

  const copyCodes = () => navigator.clipboard?.writeText(codes.join('\n'));

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 6px' }}>🔐 Security</h1>
      <p style={{ color: '#6b7280', margin: '0 0 24px' }}>
        {isSetup ? 'One more step before you can use the portal: set up your authenticator app.' : 'Your sign-in protection.'}
      </p>

      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', maxWidth: '560px' }}>{error}</div>}

      {stage === 'loading' && <div style={card}>Loading…</div>}

      {stage === 'scan' && (
        <div style={card}>
          <h2 style={{ fontSize: '18px', margin: '0 0 12px' }}>1 · Scan this code</h2>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>Open Google Authenticator, Microsoft Authenticator or Authy and scan the square below.</p>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            {totpUrl && <QRCodeSVG value={totpUrl} size={196} includeMargin />}
          </div>
          <details style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            <summary>Can&apos;t scan? Enter this key by hand</summary>
            <div style={{ ...mono, marginTop: '8px', wordBreak: 'break-all' }}>{secret}</div>
          </details>
          <h2 style={{ fontSize: '18px', margin: '0 0 12px' }}>2 · Enter the first code the app shows</h2>
          <form onSubmit={handleActivate}>
            <label style={label}>6-digit code</label>
            <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric" autoComplete="one-time-code" autoFocus placeholder="123456"
              style={{ width: '100%', padding: '12px 14px', fontSize: '20px', letterSpacing: '6px', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '16px' }} />
            <button type="submit" style={{ ...btn, width: '100%', opacity: busy || code.length < 6 ? 0.6 : 1 }} disabled={busy || code.length < 6}>
              {busy ? 'Checking…' : 'Turn on two-step sign-in'}
            </button>
          </form>
        </div>
      )}

      {stage === 'codes' && (
        <div style={card}>
          <h2 style={{ fontSize: '18px', margin: '0 0 12px' }}>✅ Two-step sign-in is on</h2>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Save these <strong>recovery codes</strong> somewhere safe (a password manager is ideal). Each works once if you ever lose your phone. <strong>They are shown only now.</strong>
          </p>
          <div style={{ ...mono, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px 18px', columns: 2, margin: '16px 0' }}>
            {codes.map((c) => <div key={c} style={{ padding: '3px 0' }}>{c}</div>)}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={copyCodes} style={{ ...btn, background: '#fff', color: '#1e3a5f', border: '1px solid #1e3a5f' }}>Copy codes</button>
            <button type="button" onClick={() => router.push('/dashboard')} style={btn}>I&apos;ve saved them — continue</button>
          </div>
        </div>
      )}

      {stage === 'enrolled' && (
        <div style={card}>
          <h2 style={{ fontSize: '18px', margin: '0 0 12px' }}>✅ Two-step sign-in is on</h2>
          <ul style={{ color: '#4b5563', fontSize: '14px', paddingLeft: '18px' }}>
            {authenticators.map((a) => (
              <li key={a.type}>
                {a.type === 'totp' ? 'Authenticator app' : 'Recovery codes'}
                {a.type === 'recovery_codes' && ` — ${a.unused_code_count} of ${a.total_code_count} unused`}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Resetting the authenticator or viewing recovery codes arrives in a later release.</p>
        </div>
      )}
    </div>
  );
}
