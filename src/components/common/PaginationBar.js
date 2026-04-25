// ===================================================================
// 📄 PaginationBar - Reusable Responsive Pagination Component
// ===================================================================
// Location: src/components/common/PaginationBar.js
// Pattern:  Desktop → full page numbers | Tablet/Mobile → [←] 1/5 [→]
// Used by:  Donation Book, Donor Bank, Gift Aid, Reports, etc.
// ===================================================================

/**
 * PaginationBar
 * 
 * Responsive pagination with dual display modes.
 * Desktop (>1024px): Shows page number buttons with ← → navigation.
 * Tablet/Mobile (<=1024px): Shows simplified ← 1/5 → navigation.
 * 
 * @param {Object} props
 * @param {Object} props.pagination     - { page, pageSize, total, totalPages }
 * @param {Function} props.onPageChange - Handler called with new page number
 * @param {boolean} props.loading       - Disable buttons while loading
 * @param {Function} props.formatNumber - Optional number formatter (e.g. 1000 → "1,000")
 * @param {string} props.itemLabel      - Optional label (default: "items")
 */
export default function PaginationBar({
  pagination,
  onPageChange,
  loading = false,
  formatNumber = (n) => n.toLocaleString(),
  itemLabel = 'items',
}) {
  const { page, pageSize, total, totalPages } = pagination;

  // Calculate visible page numbers (max 5)
  const getVisiblePages = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  // Info text: "Showing 1-10 of 250"
  const infoText = loading
    ? 'Loading...'
    : total > 0
      ? `Showing ${((page - 1) * pageSize) + 1}-${Math.min(page * pageSize, total)} of ${formatNumber(total)}`
      : `No ${itemLabel}`;

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages || totalPages === 0;

  return (
    <>
      <div className="pgb-footer">
        {/* Info text */}
        <span className="pgb-info">{infoText}</span>

        {/* Desktop: Full page numbers */}
        <div className="pgb-buttons pgb-full">
          <button
            onClick={() => handleChange(page - 1)}
            disabled={isFirstPage || loading}
            className="pgb-btn"
          >
            {'\u2190'}
          </button>

          {getVisiblePages().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handleChange(pageNum)}
              disabled={loading}
              className={`pgb-btn ${pageNum === page ? 'pgb-btn-active' : ''}`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handleChange(page + 1)}
            disabled={isLastPage || loading}
            className="pgb-btn"
          >
            {'\u2192'}
          </button>
        </div>

        {/* Tablet/Mobile: Simplified */}
        <div className="pgb-buttons pgb-simple">
          <button
            onClick={() => handleChange(page - 1)}
            disabled={isFirstPage || loading}
            className="pgb-btn"
          >
            {'\u2190'}
          </button>
          <span className="pgb-indicator">
            {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => handleChange(page + 1)}
            disabled={isLastPage || loading}
            className="pgb-btn"
          >
            {'\u2192'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .pgb-footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        
        .pgb-info {
          color: #6b7280;
          font-size: 13px;
        }
        
        .pgb-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        /* Desktop: show full, hide simple */
        .pgb-full {
          display: flex;
        }
        
        .pgb-simple {
          display: none;
        }
        
        .pgb-btn {
          min-width: 36px;
          height: 36px;
          padding: 0 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background-color: white;
          color: #374151;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pgb-btn:hover:not(:disabled) {
          background-color: #f3f4f6;
        }
        
        .pgb-btn:disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
        
        .pgb-btn-active {
          background-color: #1e3a5f;
          color: white;
          border-color: #1e3a5f;
        }
        
        .pgb-indicator {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          padding: 0 12px;
        }
        
        /* Tablet: swap to simplified */
        @media (max-width: 1024px) {
          .pgb-full {
            display: none;
          }
          
          .pgb-simple {
            display: flex;
          }
          
          .pgb-footer {
            padding: 14px 16px;
          }
        }
        
        /* Mobile: stack vertically */
        @media (max-width: 640px) {
          .pgb-footer {
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 12px 14px;
          }
        }
        
        /* Tiny */
        @media (max-width: 380px) {
          .pgb-info {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}