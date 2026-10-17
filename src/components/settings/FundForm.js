// ===================================================================
// 🎁 FundForm — inline Add / Edit for a donation type
// ===================================================================
// Location: src/components/settings/FundForm.js
// Created:  23 September 2026 — FUND-P4 slice 2
//
// The rules live in the API (fund_service.py). This form previews the
// code, counts the tagline, asks before turning a type off, and shows
// the API's field errors inline on the right field.
// No Delete control — funds are turned off, never removed.
// ===================================================================

import { useState } from 'react';
import { createFund, updateFund, previewCode } from '@/services/fundService';


const EMOJI_CHOICES = [
    '🤲', '🕌', '🕋', '🌙', '⭐', '🌟', '📿', '🧕',
    '💧', '🍞', '🍚', '🥘', '📚', '🎓', '🏫', '✏️',
    '🏠', '🩺', '💊', '⛑️', '👶', '👨‍👩‍👧', '👵', '🧑‍🦽',   
    '🐄', '🐐', '🌾', '🌱', '☀️', '❤️', '🤝', '🎁',
  ];

const TAGLINE_MAX = 60;
const HEX = /^#[0-9a-f]{6}$/i;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// API field -> form field, for inline placement of server errors
const API_FIELDS = { name: 'name', tagline: 'tagline', colour: 'colour', emoji: 'emoji', is_active: 'isActive' };

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function normaliseColour(value) {
  const v = (value || '').trim();
  if (!v) return '';
  return (/^[0-9a-f]{6}$/i.test(v) ? `#${v}` : v).toLowerCase();
}

const s = {
  wrap: { padding: '24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' },
  note: { fontSize: '13px', color: '#1e3a5f', backgroundColor: '#eef2ff', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px' },
  errorBanner: { fontSize: '13px', color: '#991b1b', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 },
  full: { gridColumn: '1 / -1' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: '13px', fontWeight: '600', color: '#1e3a5f' },
  req: { color: '#dc2626' },
  input: (bad) => ({
    fontSize: '14px', color: '#111827', padding: '10px 12px', borderRadius: '10px',
    border: `1px solid ${bad ? '#dc2626' : '#e5e7eb'}`, backgroundColor: 'white',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }),
  codeBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px',
    borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6',
  },
  codeText: { fontFamily: 'monospace', fontSize: '13px', color: '#374151' },
  help: { fontSize: '12px', color: '#6b7280', margin: 0 },
  error: { fontSize: '12px', color: '#dc2626', margin: 0, fontWeight: '500' },
  counter: (over) => ({ fontSize: '12px', color: over ? '#dc2626' : '#9ca3af', fontVariantNumeric: 'tabular-nums' }),
  colourRow: { display: 'flex', gap: '10px', alignItems: 'center' },
  picker: { width: '42px', height: '40px', padding: 0, border: '1px solid #e5e7eb', borderRadius: '10px', backgroundColor: 'white', cursor: 'pointer' },
  iconBox: {
    width: '64px', height: '52px', fontSize: '26px', textAlign: 'center',
    border: '1px solid #e5e7eb', borderRadius: '10px', backgroundColor: 'white',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emojiRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  clearIcon: { fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  grid: null, // placeholder so the diff below is unambiguous
  emojiGrid: {
    marginTop: '10px', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb',
    backgroundColor: 'white', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
  },
  emojiCell: (sel) => ({
    fontSize: '22px', lineHeight: 1, padding: '8px 0', borderRadius: '8px', cursor: 'pointer',
    border: sel ? '2px solid #1e3a5f' : '2px solid transparent', backgroundColor: sel ? '#eef2ff' : 'transparent',
  }),
  hint: { fontSize: '12px', color: '#6b7280', margin: '8px 0 0 0' },
  
  toggleRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  switch: (on, disabled) => ({
    width: '44px', height: '24px', borderRadius: '12px', border: 'none', padding: 0, position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer', backgroundColor: on ? '#166534' : '#d1d5db',
    opacity: disabled ? 0.5 : 1, flexShrink: 0,
  }),
  knob: (on) => ({
    position: 'absolute', top: '3px', left: on ? '23px' : '3px', width: '18px', height: '18px',
    borderRadius: '50%', backgroundColor: 'white', transition: 'left 120ms',
  }),
  toggleLabel: { fontSize: '14px', fontWeight: '600', color: '#1e3a5f' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginTop: '22px', flexWrap: 'wrap' },
  meta: { fontSize: '12px', color: '#6b7280' },
  actions: { display: 'flex', gap: '10px', marginLeft: 'auto' },
  primary: { fontSize: '13px', fontWeight: '600', color: 'white', backgroundColor: '#1e3a5f', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer' },
  secondary: { fontSize: '13px', fontWeight: '600', color: '#1e3a5f', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer' },
  danger: { fontSize: '13px', fontWeight: '600', color: 'white', backgroundColor: '#b45309', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer' },
  confirm: { marginTop: '22px', padding: '18px 20px', borderRadius: '12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' },
  confirmTitle: { fontSize: '15px', fontWeight: '700', color: '#92400e', margin: '0 0 8px 0' },
  confirmText: { fontSize: '13px', color: '#78350f', margin: '0 0 6px 0' },
};

export default function FundForm({ mode, fund = null, otherActiveCount = 0, onSaved, onCancel }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({
    name: fund?.name || '',
    tagline: fund?.tagline || '',
    emoji: fund?.emoji || '',
    colour: fund?.colour || '',
    isActive: fund ? !!fund.isActive : true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmOff, setConfirmOff] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const donations = fund?.donationCount ?? 0;
  const code = isEdit ? fund.code : previewCode(form.name);
  const mustStayActive = isEdit && fund.isActive && otherActiveCount === 0;
  const turningOff = isEdit && fund.isActive && !form.isActive;
  const pickerValue = HEX.test(normaliseColour(form.colour)) ? normaliseColour(form.colour) : '#6b7280';

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => {
      if (!prev[field] && !prev.general) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.general;
      return next;
    });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (form.tagline.length > TAGLINE_MAX) next.tagline = `Keep it to ${TAGLINE_MAX} characters.`;
    const colour = normaliseColour(form.colour);
    if (colour && !HEX.test(colour)) next.colour = 'Colour must be a hex value like #0ea5e9.';
    return next;
  };

  const save = async () => {
    const next = validate();
    if (Object.keys(next).length) { setErrors(next); return; }
    if (turningOff && !confirmOff) { setConfirmOff(true); return; }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      emoji: form.emoji.trim(),
      colour: normaliseColour(form.colour),
      isActive: form.isActive,
    };
    const result = isEdit ? await updateFund(fund.id, payload) : await createFund(payload);
    setSaving(false);

    if (result.success) { onSaved(result.data, mode); return; }

    const mapped = {};
    if (result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([apiField, msgs]) => {
        mapped[API_FIELDS[apiField] || 'general'] = [].concat(msgs)[0];
      });
    } else {
      mapped.general = result.error;
    }
    setErrors(mapped);
    setConfirmOff(false);
  };

  const codeHelp = isEdit
    ? (donations > 0
      ? `Cannot be changed — ${donations.toLocaleString('en-GB')} donations are recorded against it.`
      : 'Fixed once saved — donations are recorded against it.')
    : 'Created automatically from the name. Fixed once saved — donations are recorded against it.';

  return (
    <div style={s.wrap}>
      {isEdit && donations > 0 && (
        <div style={s.note}>📒 {donations.toLocaleString('en-GB')} donations recorded against this type</div>
      )}
      {errors.general && <div style={s.errorBanner}>{errors.general}</div>}

      <div style={s.grid}>
        <div style={s.field}>
          <label style={s.label}>Name <span style={s.req}>*</span></label>
          <input
            style={s.input(errors.name)} value={form.name} autoFocus maxLength={60}
            placeholder="e.g. Water Well" onChange={(e) => update('name', e.target.value)}
          />
          {errors.name
            ? <p style={s.error}>{errors.name}</p>
            : <p style={s.help}>{isEdit ? 'Renaming is safe. Receipts already sent keep their original wording.' : 'What donors see. You can change this later.'}</p>}
        </div>

        <div style={s.field}>
          <label style={s.label}>Code</label>
          <div style={s.codeBox}>
            <span style={s.codeText}>{code || '—'}</span>
            <span aria-hidden="true">🔒</span>
          </div>
          <p style={s.help}>{codeHelp}</p>
        </div>

        <div style={{ ...s.field, ...s.full }}>
          <div style={s.labelRow}>
            <label style={s.label}>Tagline</label>
            <span style={s.counter(form.tagline.length > TAGLINE_MAX)}>{form.tagline.length} / {TAGLINE_MAX}</span>
          </div>
          <input
            style={s.input(errors.tagline)} value={form.tagline} maxLength={TAGLINE_MAX}
            placeholder="e.g. Clean water for a village" onChange={(e) => update('tagline', e.target.value)}
          />
          {errors.tagline
            ? <p style={s.error}>{errors.tagline}</p>
            : <p style={s.help}>Optional. One short line under the name on the donation form.</p>}
        </div>

                <div style={s.field}>
          <label style={s.label}>Icon</label>
          <div style={s.emojiRow}>
            <div
              style={s.iconBox} role="button" tabIndex={0}
              onClick={() => setPickerOpen((o) => !o)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPickerOpen((o) => !o); } }}
            >
              {form.emoji || '＋'}
            </div>
            {form.emoji && (
              <button type="button" style={s.clearIcon} onClick={() => { update('emoji', ''); setPickerOpen(false); }}>
                Remove
              </button>
            )}
          </div>
          {pickerOpen && (
            <div style={s.emojiGrid}>
              {EMOJI_CHOICES.map((e) => (
                <button
                  key={e} type="button" style={s.emojiCell(form.emoji === e)}
                  onClick={() => { update('emoji', e); setPickerOpen(false); }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          {errors.emoji
            ? <p style={s.error}>{errors.emoji}</p>
            : <p style={s.hint}>Pick one, or press {navigator?.platform?.includes('Mac') ? '⌃⌘Space' : '⊞ .'} to use any emoji.</p>}
        </div>

        <div style={s.field}>
          <label style={s.label}>Colour</label>
          <div style={s.colourRow}>
            <input
              style={{ ...s.input(errors.colour), flex: 1 }} value={form.colour} maxLength={7}
              placeholder="#0ea5e9" onChange={(e) => update('colour', e.target.value)}
            />
            <input
              type="color" value={pickerValue} style={s.picker} aria-label="Pick a colour"
              onChange={(e) => update('colour', e.target.value)}
            />
          </div>
          {errors.colour ? <p style={s.error}>{errors.colour}</p> : <p style={s.help}>Optional. Leave blank for the default colour.</p>}
        </div>

        <div style={{ ...s.field, ...s.full }}>
          <div style={s.toggleRow}>
            <button
              type="button" role="switch" aria-checked={form.isActive} disabled={mustStayActive}
              style={s.switch(form.isActive, mustStayActive)}
              onClick={() => update('isActive', !form.isActive)}
            >
              <span style={s.knob(form.isActive)} />
            </button>
            <span style={s.toggleLabel}>Show on the donation form</span>
          </div>
          {errors.isActive
            ? <p style={s.error}>{errors.isActive}</p>
            : mustStayActive
              ? <p style={s.help}>At least one donation type must stay active, or donors cannot give at all.</p>
              : isEdit && !form.isActive
                ? <p style={s.help}>Currently off. Past donations still appear everywhere in the Book and Reports.</p>
                : null}
        </div>
      </div>

      {confirmOff ? (
        <div style={s.confirm}>
          <p style={s.confirmTitle}>Turn off {fund.name}?</p>
          <p style={s.confirmText}>It will stop appearing on the donation form straight away.</p>
          <p style={s.confirmText}>
            {donations > 0
              ? `The ${donations.toLocaleString('en-GB')} donations already recorded against it are not affected and will still appear in the Book and Reports.`
              : 'No donations have been recorded against it yet.'}
          </p>
          <div style={s.actions}>
            <button type="button" style={s.secondary} onClick={() => setConfirmOff(false)} disabled={saving}>Keep it on</button>
            <button type="button" style={s.danger} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Turn off'}</button>
          </div>
        </div>
      ) : (
        <div style={s.footer}>
          {isEdit
            ? <span style={s.meta}>Added {formatDate(fund.createdAt)} · Last changed {formatDate(fund.updatedAt)}</span>
            : <span />}
          <div style={s.actions}>
            <button type="button" style={s.secondary} onClick={onCancel} disabled={saving}>Cancel</button>
            <button type="button" style={s.primary} onClick={save} disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}