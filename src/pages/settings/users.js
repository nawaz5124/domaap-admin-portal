// ===================================================================
// settings/users.js — [LOGIN-V2] Phase 2b slice 1: User Management
// -------------------------------------------------------------------
// Settings → User Management. Lists portal users and lets an Owner add
// one with a one-time temporary password. The password is shown ONCE,
// here, and never again — the backend only returns it in the 201 body.
// Roles are Owner / Admin / Viewer (Django groups; flags alongside).
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getAllUsers, createUser, ROLES, roleLabel } from '@/services/userService';

const COLUMNS = 'minmax(0, 1fr) 220px 100px 110px 130px';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const EMPTY_FORM = { username: '', email: '', firstName: '', lastName: '', role: 'viewer' };

export default function UserSettings() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);   // { user, tempPassword } — shown once
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getAllUsers();
    if (result.success) setUsers(result.data);
    else setError(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const openAdd = () => { setForm(EMPTY_FORM); setFieldErrors({}); setFormError(null); setCreated(null); setAdding(true); };
  const closeForm = () => { setAdding(false); setFieldErrors({}); setFormError(null); };
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    setFormError(null);
    const result = await createUser(form);
    setSaving(false);
    if (!result.success) {
      setFieldErrors(result.fieldErrors || {});
      setFormError(result.error);
      return;
    }
    setUsers((prev) => [...prev, result.data].sort((a, b) => a.username.localeCompare(b.username)));
    setCreated({ user: result.data, tempPassword: result.tempPassword });
    setAdding(false);
    setToast(`${result.data.username} added as ${roleLabel(result.data.role)}`);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(created.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

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
    sectionHead: {
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: '16px', padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
    },
    sectionTitle: {
      fontSize: '17px', fontWeight: '600', color: '#1e3a5f', margin: 0,
      display: 'flex', alignItems: 'center', gap: '10px',
    },
    sectionHint: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' },
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
    avatar: (role) => ({
      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', fontWeight: '700', color: 'white',
      backgroundColor: role === 'owner' ? '#1e3a5f' : role === 'admin' ? '#8b5cf6' : '#9ca3af',
    }),
    nameBlock: { minWidth: 0 },
    name: { fontSize: '15px', fontWeight: '600', color: '#1e3a5f', margin: 0 },
    sub: {
      fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0',
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    },
    badge: (on, onBg, onFg) => ({
      display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
      fontWeight: '600', whiteSpace: 'nowrap',
      backgroundColor: on ? onBg : '#f3f4f6', color: on ? onFg : '#6b7280',
    }),
    muted: { fontSize: '13px', color: '#6b7280' },
    disabled: { opacity: 0.45, cursor: 'not-allowed' },
    skeleton: (w) => ({ height: '12px', width: w, borderRadius: '6px', backgroundColor: '#f3f4f6' }),
    state: { padding: '40px 24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' },
    retryBtn: {
      fontSize: '13px', fontWeight: '600', color: '#1e3a5f', background: 'white',
      border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
    },
    toast: {
      position: 'fixed', right: '24px', bottom: '24px', zIndex: 50,
      backgroundColor: '#166534', color: 'white', fontSize: '14px', fontWeight: '600',
      padding: '12px 18px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    },
    warn: {
      margin: '16px 24px 0', padding: '12px 16px', borderRadius: '8px',
      backgroundColor: '#fef3c7', color: '#92400e', fontSize: '13px',
    },

    // inline add form
    form: { padding: '20px 24px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px 20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#374151' },
    input: {
      fontSize: '14px', padding: '9px 12px', borderRadius: '8px',
      border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#1e3a5f',
    },
    fieldErr: { fontSize: '12px', color: '#b91c1c' },
    roleHint: { fontSize: '12px', color: '#6b7280' },
    formFoot: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', alignItems: 'center' },
    formErr: { fontSize: '13px', color: '#b91c1c', marginRight: 'auto' },
    cancelBtn: {
      fontSize: '13px', fontWeight: '600', color: '#1e3a5f', background: 'white',
      border: '1px solid #e5e7eb', borderRadius: '8px', padding: '9px 14px', cursor: 'pointer',
    },

    // one-time password panel
    secret: { margin: '16px 24px', padding: '16px 20px', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' },
    secretTitle: { fontSize: '14px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 6px 0' },
    secretText: { fontSize: '13px', color: '#374151', margin: '0 0 12px 0' },
    secretRow: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
    secretCode: {
      fontFamily: 'monospace', fontSize: '18px', letterSpacing: '0.08em', color: '#1e3a5f',
      backgroundColor: 'white', padding: '8px 14px', borderRadius: '8px', border: '1px solid #bfdbfe',
    },
    copyBtn: {
      fontSize: '13px', fontWeight: '600', color: 'white', backgroundColor: '#1e3a5f',
      border: 'none', borderRadius: '8px', padding: '9px 14px', cursor: 'pointer',
    },
    dismissBtn: {
      fontSize: '13px', fontWeight: '600', color: '#6b7280', background: 'none',
      border: 'none', cursor: 'pointer', marginLeft: 'auto',
    },
  };

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backLink} onClick={() => router.push('/settings')}>
          ← Back to Settings
        </button>
        <h1 style={styles.pageTitle}><span>👥</span> User Management</h1>
        <p style={styles.subtitle}>Who can sign in to the admin portal, and what they can do</p>
      </div>

      <section style={styles.panel}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.sectionTitle}>Admin Users</h2>
            <p style={styles.sectionHint}>Owners can add users. New users sign in with a temporary password and set up two-step on first login.</p>
          </div>
          <button
            style={{ ...styles.addBtn, ...(adding || isLoading ? styles.disabled : {}) }}
            disabled={adding || isLoading}
            onClick={openAdd}
          >
            + Add user
          </button>
        </div>

        {adding && (
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <input style={styles.input} value={form.username} onChange={setField('username')} autoComplete="off" required />
                {fieldErrors.username && <span style={styles.fieldErr}>{fieldErrors.username[0]}</span>}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email (used to sign in)</label>
                <input style={styles.input} type="email" value={form.email} onChange={setField('email')} autoComplete="off" required />
                {fieldErrors.email && <span style={styles.fieldErr}>{fieldErrors.email[0]}</span>}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>First name</label>
                <input style={styles.input} value={form.firstName} onChange={setField('firstName')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Last name</label>
                <input style={styles.input} value={form.lastName} onChange={setField('lastName')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Role</label>
                <select style={styles.input} value={form.role} onChange={setField('role')}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <span style={styles.roleHint}>{ROLES.find((r) => r.value === form.role)?.hint}</span>
                {fieldErrors.role && <span style={styles.fieldErr}>{fieldErrors.role[0]}</span>}
              </div>
            </div>
            <div style={styles.formFoot}>
              {formError && <span style={styles.formErr}>{formError}</span>}
              <button type="button" style={styles.cancelBtn} onClick={closeForm} disabled={saving}>Cancel</button>
              <button type="submit" style={{ ...styles.addBtn, ...(saving ? styles.disabled : {}) }} disabled={saving}>
                {saving ? 'Adding…' : 'Add user'}
              </button>
            </div>
          </form>
        )}

        {created && (
          <div style={styles.secret}>
            <p style={styles.secretTitle}>Temporary password for {created.user.username}</p>
            <p style={styles.secretText}>
              Share this with them securely. It is shown <strong>once</strong> — once you leave this page it cannot be recovered.
              They sign in with <strong>{created.user.email}</strong> and this password, then set up two-step.
            </p>
            <div style={styles.secretRow}>
              <code style={styles.secretCode}>{created.tempPassword}</code>
              <button style={styles.copyBtn} onClick={copyPassword}>{copied ? 'Copied ✓' : 'Copy'}</button>
              <button style={styles.dismissBtn} onClick={() => setCreated(null)}>I've saved it — dismiss</button>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.warn}>
            {error} <button style={{ ...styles.retryBtn, marginLeft: '12px' }} onClick={load}>Retry</button>
          </div>
        )}

        <div style={styles.tableHead}>
          <span>User</span><span>Email</span><span>Role</span><span>Two-step</span><span>Last login</span>
        </div>

        {isLoading ? (
          [0, 1, 2].map((i) => (
            <div key={i} style={styles.row(true)}>
              <div style={styles.nameCell}>
                <span style={styles.avatar(null)} />
                <span style={styles.skeleton('120px')} />
              </div>
              <span style={styles.skeleton('160px')} />
              <span style={styles.skeleton('60px')} />
              <span style={styles.skeleton('60px')} />
              <span style={styles.skeleton('80px')} />
            </div>
          ))
        ) : users.length === 0 && !error ? (
          <div style={styles.state}>No portal users yet.</div>
        ) : (
          users.map((u) => (
            <div key={u.id} style={styles.row(u.isActive)}>
              <div style={styles.nameCell}>
                <span style={styles.avatar(u.role)}>{(u.fullName || u.username).charAt(0).toUpperCase()}</span>
                <div style={styles.nameBlock}>
                  <p style={styles.name}>{u.fullName}</p>
                  <p style={styles.sub}>@{u.username}{!u.isActive && ' · inactive'}</p>
                </div>
              </div>
              <span style={{ ...styles.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
              <span style={styles.badge(true, u.role === 'owner' ? '#eff6ff' : u.role === 'admin' ? '#f5f3ff' : '#f3f4f6', u.role === 'owner' ? '#1e3a5f' : u.role === 'admin' ? '#6d28d9' : '#6b7280')}>
                {roleLabel(u.role)}
              </span>
              <span style={styles.badge(u.hasTwoStep, '#f0fdf4', '#166534')}>{u.hasTwoStep ? 'Enrolled' : 'Not set up'}</span>
              <span style={styles.muted}>{formatDate(u.lastLogin)}</span>
            </div>
          ))
        )}
      </section>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}