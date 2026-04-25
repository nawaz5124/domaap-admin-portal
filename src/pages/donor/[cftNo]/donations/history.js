// ===================================================================
// 📊 Donation History Page - View Donor's Donation Records
// ===================================================================
// Location: src/pages/donor/[cftNo]/donations/history.js
// Route: /donor/001/donations/history
// Pattern: Matching donation-book/index.js style
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { getDonorDonations, formatCurrency, formatNumber } from '../../../../services/donorProfileService';

export default function DonationHistory() {
  const router = useRouter();
  const { cftNo } = router.query;
  
  // ===================================================================
  // STATE
  // ===================================================================
  
  // Data state
  const [donor, setDonor] = useState(null);
  const [summary, setSummary] = useState(null);
  const [donations, setDonations] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  
  // Filter state
  const [fundFilter, setFundFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ===================================================================
  // DATA FETCHING
  // ===================================================================
  const fetchDonationHistory = useCallback(async () => {
    if (!cftNo) return;
    
    setLoading(true);
    setError(null);
    
    const result = await getDonorDonations(cftNo, {
      page: pagination.page,
      page_size: pagination.pageSize,
      fund: fundFilter,
      type: typeFilter,
      route: routeFilter,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    });
    
    if (result.success) {
      setDonor(result.data.donor);
      setSummary(result.data.summary);
      setDonations(result.data.donations);
      setPagination(result.data.pagination);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [cftNo, pagination.page, pagination.pageSize, fundFilter, typeFilter, routeFilter, startDate, endDate]);

  useEffect(() => {
    fetchDonationHistory();
  }, [fetchDonationHistory]);

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterChange = (filterType, value) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    switch (filterType) {
      case 'fund': setFundFilter(value); break;
      case 'type': setTypeFilter(value); break;
      case 'route': setRouteFilter(value); break;
    }
  };

  const handleDateChange = (type, value) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleClearFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    setFundFilter('all');
    setTypeFilter('all');
    setRouteFilter('all');
    setStartDate('');
    setEndDate('');
  };

  // ===================================================================
  // RENDER HELPERS
  // ===================================================================
  const getTypeBadge = (type) => {
    const badges = {
      'DD': { bg: '#dbeafe', color: '#1e40af', icon: '⭐' },
      'Prem': { bg: '#fef3c7', color: '#92400e', icon: '🌙' },
      'Reg': { bg: '#f3e8ff', color: '#7c3aed', icon: '👤' },
    };
    return badges[type] || { bg: '#f3f4f6', color: '#374151', icon: '' };
  };

  const getFundBadge = (fund) => {
    const badges = {
      'Zakat': { bg: '#dcfce7', color: '#166534' },
      'Sadaqah': { bg: '#fef3c7', color: '#92400e' },
      'Lillah': { bg: '#fce7f3', color: '#9d174d' },
    };
    return badges[fund] || { bg: '#f3f4f6', color: '#374151' };
  };

  const getRouteIcon = (route) => {
    const icons = { 'Online': '🌐', 'Bank': '🏦', 'Cash': '💵', 'S/O': '📋' };
    return icons[route] || '📄';
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const hasActiveFilters = fundFilter !== 'all' || typeFilter !== 'all' || routeFilter !== 'all' || startDate || endDate;

  // ===================================================================
  // RENDER
  // ===================================================================

  // Loading state
  if (loading && !donations.length) {
    return (
      <>
        <div className="loading-container">
          <span>⏳ Loading donation history...</span>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            color: #6b7280;
            font-size: 16px;
          }
        `}</style>
      </>
    );
  }

  // Error state
  if (error && !donations.length) {
    return (
      <>
        <div className="error-container">
          <span className="error-text">❌ {error}</span>
          <button className="btn-retry" onClick={fetchDonationHistory}>🔄 Retry</button>
          <button className="btn-back" onClick={() => router.push('/donor-bank')}>← Back to Donor Bank</button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            gap: 16px;
          }
          .error-text { color: #ef4444; font-size: 16px; }
          .btn-retry {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          }
          .btn-back {
            color: #6b7280;
            padding: 10px 16px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            background-color: white;
            cursor: pointer;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">📊 Donation History</h1>
          <span className="cft-badge">CFT {donor?.cftNo}</span>
          <span className="donor-name">{donor?.fullName}</span>
        </div>
        <button onClick={() => router.push(`/donor/${cftNo}`)} className="btn-back">
          ← Back to Profile
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-grid">
          <div className="summary-card">
            <span className="icon">💰</span>
            <div className="content">
              <div className="value">{summary.totalDonated}</div>
              <div className="label">Total Donated</div>
            </div>
          </div>

          <div className="summary-card">
            <span className="icon">📊</span>
            <div className="content">
              <div className="value blue">{summary.donationCount}</div>
              <div className="label">Total Donations</div>
            </div>
          </div>

          <div className="summary-card">
            <span className="icon">🎁</span>
            <div className="content">
              <div className="value green">{summary.giftAid}</div>
              <div className="label">Gift Aid ({summary.giftAidPercent})</div>
            </div>
          </div>

          <div className="summary-card">
            <span className="icon">⭐</span>
            <div className="content">
              <div className="value orange">{summary.activeDD}</div>
              <div className="label">Active DD</div>
            </div>
          </div>

          <div className="summary-card fund-card">
            <div className="fund-title">📊 By Fund Type</div>
            <div className="fund-breakdown">
              <div className="fund-item">
                <div className="fund-value green">{summary.byFund?.zakat || '£0'}</div>
                <div className="fund-label">Zakat</div>
              </div>
              <div className="fund-item">
                <div className="fund-value orange">{summary.byFund?.sadaqah || '£0'}</div>
                <div className="fund-label">Sadaqah</div>
              </div>
              <div className="fund-item">
                <div className="fund-value pink">{summary.byFund?.lillah || '£0'}</div>
                <div className="fund-label">Lillah</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="filter-input"
          />
          <span className="filter-sep">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <select value={typeFilter} onChange={(e) => handleFilterChange('type', e.target.value)} className="filter-select">
            <option value="all">All Types</option>
            <option value="DD">⭐ Direct Debit</option>
            <option value="Prem">🌙 Premium</option>
            <option value="Reg">👤 Regular</option>
          </select>

          <select value={fundFilter} onChange={(e) => handleFilterChange('fund', e.target.value)} className="filter-select">
            <option value="all">All Funds</option>
            <option value="zakat">Zakat</option>
            <option value="sadaqah">Sadaqah</option>
            <option value="lillah">Lillah</option>
          </select>

          <select value={routeFilter} onChange={(e) => handleFilterChange('route', e.target.value)} className="filter-select">
            <option value="all">All Routes</option>
            <option value="Online">🌐 Online</option>
            <option value="Bank">🏦 Bank</option>
            <option value="Cash">💵 Cash</option>
            <option value="S/O">📋 S/O</option>
          </select>

          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="btn-clear">✕ Clear</button>
          )}
        </div>

        <div className="filter-actions">
          <button className="btn-export" onClick={() => alert('Export CSV coming soon!')}>📊 Export</button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && donations.length > 0 && (
        <div className="updating">⏳ Updating...</div>
      )}

      {/* Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amt</th>
                <th>Type</th>
                <th>Fund</th>
                <th>G-Aid</th>
                <th>Cause</th>
                <th>Route</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <div className="empty-icon">📖</div>
                    <div className="empty-title">No donations found</div>
                    <div className="empty-subtitle">
                      {hasActiveFilters ? 'Try adjusting your filters' : 'No donations recorded yet'}
                    </div>
                    {hasActiveFilters && (
                      <button onClick={handleClearFilters} className="btn-clear-empty">Clear Filters</button>
                    )}
                  </td>
                </tr>
              ) : (
                donations.map((d) => {
                  const typeBadge = getTypeBadge(d.type);
                  const fundBadge = getFundBadge(d.fund);
                  return (
                    <tr key={d.id} className="data-row">
                      <td>{d.date}</td>
                      <td className="amount">{d.amount}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: typeBadge.bg, color: typeBadge.color }}>
                          {typeBadge.icon} {d.type}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: fundBadge.bg, color: fundBadge.color }}>
                          {d.fund}
                        </span>
                      </td>
                      <td>{d.giftAid ? <span className="yes">✅</span> : <span className="no">—</span>}</td>
                      <td>{d.cause}</td>
                      <td>{getRouteIcon(d.route)}</td>
                      <td><span className="status-done">✅ {d.status}</span></td>
                      <td>
                        <span className="receipt-icon" onClick={() => alert(`Receipt #${d.id}`)}>
                          {d.receiptGenerated ? '📄' : '🧾'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalCount > 0 && (
          <div className="pagination-footer">
            <span className="pagination-info">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1}-{Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount}
            </span>
            <div className="pagination-buttons">
              <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="page-btn">←</button>
              {renderPagination().map((pageNum) => (
                <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`page-btn ${pageNum === pagination.page ? 'active' : ''}`}>
                  {pageNum}
                </button>
              ))}
              <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="page-btn next">→</button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="legend">
        <span className="legend-title">Legend:</span>
        <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>⭐ DD</span>
        <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>🌙 Prem</span>
        <span className="badge" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>👤 Reg</span>
        <span>🌐 Online</span>
        <span>🏦 Bank</span>
        <span>💵 Cash</span>
        <span>📋 S/O</span>
      </div>

      {/* ================================================================= */}
      {/* STYLED-JSX                                                       */}
      {/* ================================================================= */}
      <style jsx>{`
        .page-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .header-left {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }
        
        .page-title {
          font-size: 24px;
          font-weight: bold;
          color: #1e3a5f;
          margin: 0;
        }
        
        .cft-badge {
          background-color: #22c55e;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .donor-name {
          color: #6b7280;
          font-size: 16px;
        }
        
        .btn-back {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #1e3a5f;
          background-color: white;
          color: #1e3a5f;
          font-weight: 600;
          cursor: pointer;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .summary-card {
          background-color: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .summary-card .icon {
          font-size: 24px;
        }
        
        .summary-card .content {
          flex: 1;
        }
        
        .summary-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #1e3a5f;
        }
        
        .summary-card .value.blue { color: #3b82f6; }
        .summary-card .value.green { color: #22c55e; }
        .summary-card .value.orange { color: #f59e0b; }
        
        .summary-card .label {
          font-size: 12px;
          color: #6b7280;
        }
        
        .fund-card {
          flex-direction: column;
          align-items: stretch;
        }
        
        .fund-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 12px;
        }
        
        .fund-breakdown {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .fund-item {
          text-align: center;
          padding: 8px 16px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        
        .fund-value {
          font-size: 18px;
          font-weight: bold;
        }
        
        .fund-value.green { color: #166534; }
        .fund-value.orange { color: #92400e; }
        .fund-value.pink { color: #9d174d; }
        
        .fund-label {
          font-size: 11px;
          color: #6b7280;
        }
        
        .filter-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
          background-color: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        
        .filter-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        
        .filter-input {
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }
        
        .filter-sep {
          color: #6b7280;
        }
        
        .filter-select {
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background-color: white;
          cursor: pointer;
        }
        
        .btn-clear {
          padding: 10px 16px;
          border: 1px solid #ef4444;
          border-radius: 8px;
          background-color: white;
          color: #ef4444;
          cursor: pointer;
        }
        
        .filter-actions {
          display: flex;
          gap: 10px;
        }
        
        .btn-export {
          padding: 10px 20px;
          border-radius: 8px;
          background-color: #3b82f6;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        
        .updating {
          text-align: center;
          padding: 10px;
          color: #6b7280;
        }
        
        .table-container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          min-width: 700px;
          border-collapse: collapse;
        }
        
        .data-table th {
          padding: 14px 12px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .data-table td {
          padding: 14px 12px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .data-row:hover {
          background-color: #f9fafb;
        }
        
        .amount {
          font-weight: 600;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .yes { color: #22c55e; }
        .no { color: #d1d5db; }
        
        .status-done {
          color: #22c55e;
          font-weight: 600;
          font-size: 13px;
        }
        
        .receipt-icon {
          cursor: pointer;
          font-size: 18px;
        }
        
        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #6b7280;
        }
        
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-title { font-size: 15px; font-weight: 500; }
        .empty-subtitle { font-size: 13px; margin-top: 6px; }
        
        .btn-clear-empty {
          margin-top: 16px;
          background-color: #3b82f6;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }
        
        .pagination-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px 16px;
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
          align-items: center;
        }
        
        .pagination-info {
          font-size: 13px;
          color: #6b7280;
        }
        
        .pagination-buttons {
          display: flex;
          gap: 6px;
        }
        
        .page-btn {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background-color: white;
          cursor: pointer;
        }
        
        .page-btn:disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
        
        .page-btn.active {
          background-color: #1e3a5f;
          color: white;
          border: none;
        }
        
        .page-btn.next {
          background-color: #22c55e;
          color: white;
          border: none;
        }
        
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          background-color: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          font-size: 13px;
          color: #6b7280;
        }
        
        .legend-title {
          font-weight: 600;
          color: #374151;
        }
        
        @media (min-width: 768px) {
          .page-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .filter-row {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
          }
          
          .filter-actions {
            margin-left: auto;
          }
          
          .pagination-footer {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        
        @media (min-width: 1024px) {
          .summary-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
    </>
  );
}