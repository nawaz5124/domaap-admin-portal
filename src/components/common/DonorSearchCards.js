// ===================================================================
// 🔍 Donor Search Cards - Reusable Component
// ===================================================================
// Location: src/components/common/DonorSearchCards.js
// Updated:  1 Mar 2026 - Compact variant + mobile landscape overflow fix
// Usage: Used in Donor Bank, Donor Profile, and Reports pages
// Description: 3-card search UI for non-technical users
// ===================================================================
// VARIANTS:
//   'default'  - Full size (used in standalone pages)
//   'compact'  - Shorter cards (used in Donor Bank, Reports)
// ===================================================================
// FIX: max-width:100% + overflow:hidden on grid (prevents landscape cutoff)
//      min-width:0 on cards + inputs (prevents grid blowout)
//      Same pattern used in Reports page .searchGrid
// STYLE: Portal Inline Style (inline styles + minimal styled-jsx for responsive)
// ===================================================================

import { useState } from 'react';

export default function DonorSearchCards({ 
  onSearch, 
  loading = false,
  variant = 'default' 
}) {
  const [searchCFT, setSearchCFT] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchContact, setSearchContact] = useState('');

  const handleSearchCFT = () => {
    if (searchCFT.trim() && onSearch) {
      onSearch({ type: 'cft', value: searchCFT.trim() });
    }
  };

  const handleSearchName = () => {
    if (searchName.trim() && onSearch) {
      onSearch({ type: 'name', value: searchName.trim() });
    }
  };

  const handleSearchContact = () => {
    if (searchContact.trim() && onSearch) {
      onSearch({ type: 'contact', value: searchContact.trim() });
    }
  };

  const handleKeyPress = (e, searchType) => {
    if (e.key === 'Enter') {
      if (searchType === 'cft') handleSearchCFT();
      else if (searchType === 'name') handleSearchName();
      else if (searchType === 'contact') handleSearchContact();
    }
  };

  const handleClearAll = () => {
    setSearchCFT('');
    setSearchName('');
    setSearchContact('');
    if (onSearch) {
      onSearch({ type: 'clear', value: '' });
    }
  };

  const isCompact = variant === 'compact';

  const cards = [
    {
      id: 'cft',
      title: 'Search by CFT No',
      subtitle: "Enter donor's unique ID",
      placeholder: 'e.g. 001, 002...',
      iconBg: '#eff6ff',
      iconContent: '\u{1F522}',
      iconColor: '#3b82f6',
      borderColor: '#3b82f6',
      buttonColor: '#3b82f6',
      value: searchCFT,
      onChange: setSearchCFT,
      onSearch: handleSearchCFT
    },
    {
      id: 'name',
      title: 'Search by Name',
      subtitle: 'Enter first or last name',
      placeholder: 'e.g. Nawaz, Ahmed...',
      iconBg: '#f0fdf4',
      iconContent: '\u{1F464}',
      iconColor: '#22c55e',
      borderColor: '#22c55e',
      buttonColor: '#22c55e',
      value: searchName,
      onChange: setSearchName,
      onSearch: handleSearchName
    },
    {
      id: 'contact',
      title: 'Search by Email/Phone',
      subtitle: 'Enter email or mobile',
      placeholder: 'e.g. @gmail, 0787...',
      iconBg: '#fff7ed',
      iconContent: '\u2709\uFE0F',
      iconColor: '#f59e0b',
      borderColor: '#f59e0b',
      buttonColor: '#f59e0b',
      value: searchContact,
      onChange: setSearchContact,
      onSearch: handleSearchContact
    }
  ];

  return (
    <div className={isCompact ? 'dsc-grid dsc-compact' : 'dsc-grid'}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="dsc-card"
          style={{
            backgroundColor: 'white',
            borderRadius: isCompact ? '10px' : '12px',
            border: '2px solid ' + card.borderColor,
            padding: isCompact ? '14px 16px' : '20px',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'default',
            boxSizing: 'border-box',
            minWidth: 0,
            overflow: 'hidden',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px ' + card.borderColor + '30';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Card Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isCompact ? '10px' : '12px',
            marginBottom: isCompact ? '10px' : '16px',
          }}>
            <div style={{
              width: isCompact ? '32px' : '36px',
              height: isCompact ? '32px' : '36px',
              minWidth: isCompact ? '32px' : '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isCompact ? '16px' : '18px',
              backgroundColor: card.iconBg,
              color: card.iconColor,
            }}>
              {card.iconContent}
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                fontWeight: '600',
                fontSize: isCompact ? '14px' : '15px',
                color: '#1e3a5f',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {card.title}
              </div>
              <div style={{
                fontSize: isCompact ? '11px' : '12px',
                color: '#6b7280',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {card.subtitle}
              </div>
            </div>
          </div>

          {/* Separator line — compact only */}
          {isCompact && (
            <div style={{
              height: '1px',
              backgroundColor: '#e5e7eb',
              margin: '0 0 10px 0',
            }} />
          )}

          {/* Search Input & Button */}
          <div style={{ display: 'flex', gap: '8px', minWidth: 0 }}>
            <input
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              data-lpignore="true"
              type="text"
              placeholder={card.placeholder}
              value={card.value}
              onChange={(e) => card.onChange(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, card.id)}
              disabled={loading}
              style={{
                flex: 1,
                padding: isCompact ? '8px 12px' : '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: isCompact ? '13px' : '14px',
                color: '#374151',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: loading ? '#f9fafb' : 'white',
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = card.borderColor; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; }}
            />
            <button
              onClick={card.onSearch}
              disabled={loading || !card.value.trim()}
              style={{
                padding: isCompact ? '8px 12px' : '10px 16px',
                fontSize: isCompact ? '12px' : '13px',
                backgroundColor: card.value.trim() && !loading ? card.buttonColor : '#d1d5db',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: card.value.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              {'\u{1F50D}'} <span className="dsc-btn-text">{loading ? '...' : 'Search'}</span>
            </button>
          </div>
        </div>
      ))}

      {/* ==================== RESPONSIVE STYLES ==================== */}
      {/* Only media queries here — all visual styles are inline above */}
      <style jsx>{`
        /* =========================================================== */
        /* === DESKTOP (default) — 3 columns, no overflow           === */
        /* =========================================================== */
        .dsc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        .dsc-grid.dsc-compact {
          gap: 14px;
          margin-bottom: 20px;
        }

        /* =========================================================== */
        /* === TABLET (640px - 1024px) — 3 cols tighter             === */
        /* =========================================================== */
        @media (max-width: 1024px) {
          .dsc-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }
          .dsc-grid.dsc-compact {
            gap: 8px;
          }
          .dsc-btn-text {
            display: none;
          }
        }

        /* =========================================================== */
        /* === MOBILE (< 640px) — 1 column stacked                 === */
        /* =========================================================== */
        @media (max-width: 640px) {
          .dsc-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 16px;
          }
          .dsc-btn-text {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}