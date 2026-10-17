/**
 * Login V2 — second step: 6-digit authenticator code (or an 8-digit recovery code).
 * Rendered by pages/login in place of the credentials form once allauth reports mfa_authenticate pending.
 */
export default function TwoStepForm({ code, setCode, onSubmit, onBack, isLoading }) {
  const label = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' };
  const input = { width: '100%', padding: '12px 14px', fontSize: '20px', letterSpacing: '6px', textAlign: 'center',
                  border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' };
  return (
    <form onSubmit={onSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label style={label}>Authenticator code</label>
        <input
          style={input}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={8}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="123456"
        />
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
          Open your authenticator app and enter the 6-digit code for Camel Foundation Admin. A recovery code works here too.
        </p>
      </div>
      <button type="submit" disabled={isLoading || code.length < 6}
        style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: '600', color: '#fff',
                 background: '#1e3a5f', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>
        {isLoading ? 'Checking…' : 'Verify'}
      </button>
      <button type="button" onClick={onBack} disabled={isLoading}
        style={{ width: '100%', marginTop: '10px', padding: '10px', fontSize: '14px', color: '#374151',
                 background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
        Back to sign in
      </button>
    </form>
  );
}
