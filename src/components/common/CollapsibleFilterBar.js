// ===================================================================
// 🔍 CollapsibleFilterBar - Reusable Responsive Filter Component
// ===================================================================
// Location: src/components/common/CollapsibleFilterBar.js
// Updated:  1 Mar 2026 - Inline button styles (fixes styled-jsx scoping)
// Pattern:  Desktop → inline row | Tablet/Mobile → collapsible panel
// Used by:  Donation Book, Donor Bank, Gift Aid, Reports, etc.
// ===================================================================
// STYLE: Matched to Donor Profile → Donation History filter row
// NOTE:  Action buttons use INLINE styles to avoid styled-jsx scoping
// ===================================================================

import { useState } from 'react';

// ===================================================================
// BUTTON STYLE PRESETS (inline — bypasses styled-jsx scoping)
// ===================================================================
const BTN_STYLES = {
  navy: {
    padding: '9px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    border: 'none',
    backgroundColor: '#1e3a5f',
    color: 'white',
  },
  gold: {
    padding: '9px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    border: 'none',
    backgroundColor: '#d4a843',
    color: 'white',
  },
  clear: {
    padding: '9px 16px',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    fontSize: '13px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 16px',
    borderRadius: '8px',
    border: '1px solid #1e3a5f',
    backgroundColor: 'white',
    color: '#1e3a5f',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  toggleOpen: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 16px',
    borderRadius: '8px',
    border: '1px solid #1e3a5f',
    backgroundColor: '#1e3a5f',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

const INPUT_STYLE = {
  padding: '9px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#374151',
  backgroundColor: 'white',
  outline: 'none',
  boxSizing: 'border-box',
};

const SELECT_STYLE = {
  ...INPUT_STYLE,
  cursor: 'pointer',
  paddingRight: '32px',
  appearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236b7280' d='M5 7L1 3h8z'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
};

export default function CollapsibleFilterBar({
  filters = [],
  actions = [],
  activeCount = 0,
  hasActive = false,
  onClear,
  activeTags,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Separate date filters from dropdown filters
  const dateFilters = filters.filter(f => f.type === 'date');
  const selectFilters = filters.filter(f => f.type === 'select');

  // Render a single filter input
  const renderFilter = (filter, index, fullWidth) => {
    const style = fullWidth
      ? { ...INPUT_STYLE, width: '100%' }
      : INPUT_STYLE;

    if (filter.type === 'date') {
      return (
        <input
          key={index}
          type="date"
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          style={style}
        />
      );
    }

    if (filter.type === 'select') {
      const selStyle = fullWidth
        ? { ...SELECT_STYLE, width: '100%', minWidth: 0 }
        : SELECT_STYLE;

      return (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          style={selStyle}
        >
          <option value="">{filter.placeholder || 'All'}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return null;
  };

  // Render action buttons (inline styles — no scoping issues)
  const renderActions = () => (
    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
      {actions.map((action, index) => {
        const btnStyle = (action.variant === 'danger' || action.variant === 'gold')
          ? BTN_STYLES.gold
          : BTN_STYLES.navy;

        return (
          <button key={index} onClick={action.onClick} style={btnStyle}>
            <span>{action.icon}</span>
            <span className="cfb-btn-text">{action.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ============================== */}
      {/* DESKTOP: All inline (>1024px)  */}
      {/* ============================== */}
      <div className="cfb-desktop" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        backgroundColor: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {/* Date range group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {dateFilters.length >= 2 ? (
            <>
              {renderFilter(dateFilters[0], 'dt-0', false)}
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>to</span>
              {renderFilter(dateFilters[1], 'dt-1', false)}
            </>
          ) : (
            dateFilters.map((f, i) => renderFilter(f, `dt-${i}`, false))
          )}
        </div>

        {/* Dropdown filters group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {selectFilters.map((f, i) => renderFilter(f, `sel-${i}`, false))}
          {hasActive && onClear && (
            <button onClick={onClear} style={BTN_STYLES.clear}>{'\u2715'} Clear</button>
          )}
        </div>

        {/* Action buttons (pushed right) */}
        {renderActions()}
      </div>

      {/* ========================================= */}
      {/* TABLET/MOBILE: Collapsible (<=1024px)     */}
      {/* ========================================= */}
      <div className="cfb-mobile" style={{
        marginBottom: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Top bar: toggle + action buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          gap: '12px',
        }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={isOpen ? BTN_STYLES.toggleOpen : BTN_STYLES.toggle}
          >
            <span>{'\uD83D\uDD0D'}</span>
            <span>Filters</span>
            {activeCount > 0 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '20px',
                padding: '0 6px',
                borderRadius: '10px',
                backgroundColor: '#d4a843',
                color: 'white',
                fontSize: '11px',
                fontWeight: '700',
              }}>{activeCount}</span>
            )}
            <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '2px' }}>
              {isOpen ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {renderActions()}
        </div>

        {/* Expandable panel */}
        {isOpen && (
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '14px' }} />

            {/* Date row */}
            {dateFilters.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                {dateFilters.map((f, i) => renderFilter(f, `m-dt-${i}`, true))}
              </div>
            )}

            {/* Select row */}
            <div className="cfb-panel-selects" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              {selectFilters.map((f, i) => renderFilter(f, `m-sel-${i}`, true))}
            </div>

            {/* Clear */}
            {hasActive && onClear && (
              <button onClick={onClear} style={{
                ...BTN_STYLES.clear,
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '4px',
              }}>
                {'\u2715'} Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active filter tags (desktop only) */}
      {hasActive && activeTags && (
        <div className="cfb-tags" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          padding: '10px 16px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
        }}>
          {activeTags}
        </div>
      )}

      {/* ============================== */}
      {/* RESPONSIVE: Show/Hide rules    */}
      {/* ============================== */}
      <style jsx>{`
        /* Desktop visible, Mobile hidden */
        .cfb-desktop { display: flex; }
        .cfb-mobile { display: none !important; }
        .cfb-tags { display: flex; }

        @media (max-width: 1024px) {
          .cfb-desktop { display: none !important; }
          .cfb-mobile { display: block !important; }
          .cfb-tags { display: none !important; }
        }

        @media (max-width: 640px) {
          .cfb-btn-text { display: none; }
          .cfb-panel-selects { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}