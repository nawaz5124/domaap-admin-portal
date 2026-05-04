// ===================================================================
// 👥 Donor Bank Page - Using Dashboard Responsive Pattern
// ===================================================================
// Location: src/pages/donor-bank/index.js
// 
// RESPONSIVE PATTERN (5 views):
//   > 1024px      : Desktop    - Full table, sidebar visible
//   768-1024px    : Tablet LS  - Cards (2 cols), hamburger menu
//   640-768px     : Tablet PT  - Cards (2 cols), tighter spacing
//   480-640px     : Mobile LS  - Cards (2 cols), compact
//   < 480px       : Mobile PT  - Cards (1 col), stacked
// ===================================================================
// UPDATED: February 2026 - Responsive filter row + tab grid
// UPDATED: 28 Feb 2026 - Wired Add Donor buttons to /portal/donor/new
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import DonorSearchCards from '../../components/common/DonorSearchCards';
import { getDonorStats, getDonorList } from '../../services/donorService';
import { useComingSoon } from '../../context/ComingSoonContext';


export default function DonorBank() {
  const router = useRouter();
  const { showComingSoon } = useComingSoon();

  // ===================================================================
  // STATE
  // ===================================================================
  const [stats, setStats] = useState({
    total: 0, dd: 0, premium: 0, regular: 0, lapsed: 0, nonDonor: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0, page: 1, pageSize: 10, totalPages: 1
  });
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchType, setActiveSearchType] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedDonors, setSelectedDonors] = useState([]);

  // ===================================================================
  // CONFIG
  // ===================================================================
  const categoryTabs = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'dd', label: 'DD', count: stats.dd, icon: '\u2B50' },
    { id: 'premium', label: 'Premium', count: stats.premium, icon: '\uD83C\uDF19' },
    { id: 'regular', label: 'Regular', count: stats.regular },
    { id: 'lapsed', label: 'Lapsed', count: stats.lapsed },
    { id: 'non_donor', label: 'Non-Donor', count: stats.nonDonor },
  ];

  // ===================================================================
  // DATA FETCHING
  // ===================================================================
  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      const result = await getDonorStats();
      if (result.success) setStats(result.data);
      setStatsLoading(false);
    }
    fetchStats();
  }, []);

  const fetchDonors = useCallback(async () => {
    setDonorsLoading(true);
    setError(null);
    const result = await getDonorList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchQuery,
      searchType: activeSearchType,
      category: activeTab,
      type: typeFilter,
      sortBy, sortOrder,
    });
    if (result.success) {
      setDonors(result.data.donors);
      setPagination(result.data.pagination);
    } else {
      setError(result.error);
    }
    setDonorsLoading(false);
  }, [pagination.page, pagination.pageSize, searchQuery, activeSearchType, activeTab, typeFilter, sortBy, sortOrder]);

  useEffect(() => { fetchDonors(); }, [fetchDonors]);

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handleSearch = ({ type, value }) => {
    if (type === 'clear') {
      setSearchQuery('');
      setActiveSearchType(null);
    } else {
      setSearchQuery(value);
      setActiveSearchType(type);
    }
    setPagination(prev => ({ ...prev, page: 1 }));
    setSelectedDonors([]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchType(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSelectedDonors([]);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      setSelectedDonors([]);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectAll = (e) => {
    setSelectedDonors(e.target.checked ? donors.map(d => d.id) : []);
  };

  const handleSelectDonor = (id) => {
    setSelectedDonors(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleViewDonor = (cftNo) => router.push(`/donor-bank/${cftNo}`);

  const getSearchTypeLabel = (type) => {
    const labels = { cft: 'CFT No', name: 'Name', contact: 'Email/Phone' };
    return labels[type] || '';
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return <span style={{ color: '#9ca3af', marginLeft: '4px' }}>{'\u2195'}</span>;
    return <span style={{ color: '#3b82f6', marginLeft: '4px' }}>{sortOrder === 'asc' ? '\u2191' : '\u2193'}</span>;
  };

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <>
      {/* ==================== HEADER ==================== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', margin: 0 }}>
            {'\uD83D\uDC65'} Donor Bank
          </h1>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            {statsLoading ? '...' : `${stats.total.toLocaleString()} total donors`}
          </span>
        </div>
        <button
           onClick={() => router.push('/donor/new')}
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          {'\u2795'} <span className="btn-text">Add Donor</span>
        </button>
      </div>

      {/* ==================== SEARCH ==================== */}
      <DonorSearchCards onSearch={handleSearch} variant="compact" />

      {searchQuery && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          marginBottom: '16px',
          color: '#3b82f6',
          flexWrap: 'wrap',
        }}>
          {'\uD83D\uDD0D'} Searching by {getSearchTypeLabel(activeSearchType)}: <strong>{'"'}{searchQuery}{'"'}</strong>
          <button 
            onClick={handleClearSearch}
            style={{
              marginLeft: 'auto',
              background: 'white',
              border: '1px solid #3b82f6',
              color: '#3b82f6',
              padding: '4px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {'\u2715'} Clear
          </button>
        </div>
      )}

      {/* ==================== FILTERS ==================== */}
      <div className="filter-row">
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
          style={{
            padding: '12px 32px 12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <option value="all">All Types</option>
          <option value="one-off">One-off</option>
          <option value="recurring">Recurring</option>
        </select>

        {/* Spacer - only visible on desktop */}
        <div className="filter-spacer" />

        <div className="filter-buttons">
          <button className="filter-btn" style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#1e3a5f',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
          }}>
            {'\uD83D\uDCCA'} <span className="btn-text">Export</span>
          </button>
          <button className="filter-btn" style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
          }}>
            {'\u2709\uFE0F'} <span className="btn-text">Email</span>
          </button>
        </div>
      </div>

      {/* ==================== TABS ==================== */}
      <div className="tabs-row">
        {categoryTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className="tab-btn"
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: activeTab === tab.id ? 'none' : '1px solid #d1d5db',
              backgroundColor: activeTab === tab.id ? '#1e3a5f' : 'white',
              color: activeTab === tab.id ? 'white' : '#374151',
              fontWeight: '500',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label} ({statsLoading ? '...' : tab.count})
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          {'\u26A0\uFE0F'} {error}
        </div>
      )}

      {/* ==================== MOBILE/TABLET: CARDS ==================== */}
      <div className="cards-view">
        {donorsLoading ? (
          <div className="cards-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="donor-card skeleton">
                <div style={{ height: '20px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '12px' }} />
                <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '60%', marginBottom: '8px' }} />
                <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{'\uD83D\uDC65'}</div>
            <p>No donors found</p>
          </div>
        ) : (
          <>
            <div className="cards-grid">
              {donors.map(donor => (
                <div 
                  key={donor.id} 
                  className="donor-card"
                  onClick={() => handleViewDonor(donor.cftNo)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f' }}>{donor.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{donor.cftNo}</div>
                    </div>
                    <span style={{
                      backgroundColor: (donor.categoryColor || '#6b7280') + '20',
                      color: donor.categoryColor || '#6b7280',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      {donor.category === 'DD' && '\u2B50'}{donor.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: '13px', color: '#374151' }}>
                    <span>{'\uD83D\uDCE7'} {donor.email || 'No email'}</span>
                    <span>{'\uD83D\uDCB0'} {donor.totalGiven}</span>
                    <span>{'\uD83D\uDCC5'} {donor.lastDonation || 'Never'}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile Pagination */}
            <div className="mobile-pagination">
              <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>{'\u2190'}</button>
              <span>{pagination.page} / {pagination.totalPages}</span>
              <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>{'\u2192'}</button>
            </div>
          </>
        )}
      </div>

      {/* ==================== DESKTOP: TABLE ==================== */}
      <div className="table-view">
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '16px', textAlign: 'left', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={donors.length > 0 && selectedDonors.length === donors.length}
                    style={{ width: '18px', height: '18px' }}
                  />
                </th>
                <th onClick={() => handleSort('cft_no')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  CFT No {renderSortIcon('cft_no')}
                </th>
                <th onClick={() => handleSort('name')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Name {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('email')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Email {renderSortIcon('email')}
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Category</th>
                <th onClick={() => handleSort('total_given')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Total Given {renderSortIcon('total_given')}
                </th>
                <th onClick={() => handleSort('last_donation')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Last Donation {renderSortIcon('last_donation')}
                </th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donorsLoading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {[1,2,3,4,5,6,7,8].map(j => (
                      <td key={j} style={{ padding: '16px' }}>
                        <div style={{ height: '20px', backgroundColor: '#f3f4f6', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                    {'\uD83D\uDC65'} No donors found
                  </td>
                </tr>
              ) : (
                donors.map(donor => (
                  <tr 
                    key={donor.id} 
                    style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: donor.status === 'cancelled' ? '#fefce8' : 'white',
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedDonors.includes(donor.id)}
                        onChange={() => handleSelectDonor(donor.id)}
                        style={{ width: '18px', height: '18px' }}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <a 
                        onClick={() => handleViewDonor(donor.cftNo)}
                        style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '500' }}
                      >
                        {donor.cftNo}
                      </a>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#374151' }}>{donor.name}</td>
                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>{donor.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        backgroundColor: (donor.categoryColor || '#6b7280') + '15',
                        color: donor.categoryColor || '#6b7280',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {donor.category === 'DD' && '\u2B50 '}{donor.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#374151' }}>{donor.totalGiven}</td>
                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>{donor.lastDonation}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleViewDonor(donor.cftNo)}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', marginRight: '4px' }}
                      >
                        {'\uD83D\uDC41\uFE0F'}
                      </button>
                      <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer' }}>
                        {'\uD83D\uDCCB'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Desktop Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              Showing {((pagination.page-1)*pagination.pageSize)+1}-{Math.min(pagination.page*pagination.pageSize, pagination.total)} of {pagination.total}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handlePageChange(pagination.page - 1)} 
                disabled={pagination.page === 1}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', color: pagination.page === 1 ? '#d1d5db' : '#374151' }}
              >
                {'\u2190'}
              </button>
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const p = i + 1;
                return (
                  <button 
                    key={p} 
                    onClick={() => handlePageChange(p)}
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      border: pagination.page === p ? 'none' : '1px solid #d1d5db', 
                      backgroundColor: pagination.page === p ? '#1e3a5f' : 'white', 
                      color: pagination.page === p ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    {p}
                  </button>
                );
              })}
              <button 
                onClick={() => handlePageChange(pagination.page + 1)} 
                disabled={pagination.page === pagination.totalPages}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', color: pagination.page === pagination.totalPages ? '#d1d5db' : '#374151' }}
              >
                {'\u2192'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== QUICK ACTIONS ==================== */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginTop: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: 0 }}>{'\u26A1'} Quick Actions</h3>
        </div>
        <div className="quick-actions-grid">
          {[
            { label: 'Add New Donor', icon: '\u2795', color: '#22c55e', bgColor: '#f0fdf4', borderColor: '#bbf7d0', href: '/donor/new' },
            { label: 'Send Email', icon: '\u2709\uFE0F', color: '#3b82f6', bgColor: '#eff6ff', borderColor: '#bfdbfe', href: '/email' },
            { label: 'Generate Report', icon: '\uD83D\uDCCB', color: '#f97316', bgColor: '#fff7ed', borderColor: '#fed7aa', href: '/reports' },
            { label: 'Generate Receipts', icon: '\uD83E\uDDFE', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca', comingSoon: 'receipts' },
            { label: 'Gift Aid Claim', icon: '\uD83C\uDF81', color: '#ca8a04', bgColor: '#fefce8', borderColor: '#fef08a', comingSoon: 'giftAid' },
            { label: 'View Alerts', icon: '\uD83D\uDD14', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca', comingSoon: 'alerts' },
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => action.href ? router.push(action.href) : showComingSoon(action.comingSoon)}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              style={{
                backgroundColor: action.bgColor,
                border: `1px solid ${action.borderColor}`,
                borderRadius: '10px',
                padding: '14px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: action.color,
                fontWeight: '500',
                fontSize: '13px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <span>{action.icon}</span>
              <span className="btn-text">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== RESPONSIVE STYLES ==================== */}
<style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* =========================================================== */
        /* === DEFAULT: DESKTOP (> 1024px)                         === */
        /* =========================================================== */
        
        /* Table visible, Cards hidden */
        .cards-view { display: none; }
        .table-view { display: block; }
        .mobile-pagination { display: none; }

        /* Filter row - horizontal with spacer */
        .filter-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          align-items: center;
        }
        .filter-spacer {
          flex: 1;
        }
        .filter-select {
          min-width: 140px;
        }
        .filter-buttons {
          display: flex;
          gap: 12px;
        }

        /* Tabs - single row */
        .tabs-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .tab-btn {
          flex: none;
        }
        
        /* Quick actions - 6 columns */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        .qa-btn {
          padding: 14px 12px;
          border-radius: 10px;
          border: 1px solid;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
          font-size: 13px;
        }
        .qa-btn.green { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
        .qa-btn.blue { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
        .qa-btn.yellow { background: #fef3c7; border-color: #fde68a; color: #92400e; }
        .qa-btn.orange { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
        .qa-btn.red { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
        .qa-btn em { background: #ef4444; color: white; font-size: 10px; padding: 1px 6px; border-radius: 10px; font-style: normal; }


        /* =========================================================== */
        /* === TABLET (640px - 1024px)                             === */
        /* === Covers: Tablet Landscape + Tablet Portrait          === */
        /* =========================================================== */
        @media (max-width: 1024px) {
          /* Hide table, Show cards */
          .cards-view { display: block; }
          .table-view { display: none; }

          /* Mobile pagination */
          .mobile-pagination { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            gap: 16px; 
            padding: 16px; 
            background: #f9fafb; 
            border-radius: 12px; 
            margin-top: 16px; 
          }
          .mobile-pagination button {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            background: white;
            cursor: pointer;
            font-size: 16px;
          }
          .mobile-pagination button:disabled { color: #d1d5db; cursor: not-allowed; }
          .mobile-pagination span { font-weight: 600; color: #1e3a5f; font-size: 16px; }
          
          /* Donor cards - 2 columns (iPad has room in both orientations) */
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .donor-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            cursor: pointer;
            min-width: 0;
          }
          .donor-card.skeleton {
            min-height: 120px;
          }

          /* --------------------------------------------------- */
          /* Filter row - ALL 3 IN ONE ROW on tablet             */
          /* [All Types ▼] [📊 Export] [✉️ Email]                */
          /* --------------------------------------------------- */
          .filter-row {
            flex-direction: row;
            gap: 10px;
            align-items: center;
          }
          .filter-select {
            flex: 1;
            min-width: 0;
            width: auto;
          }
          .filter-spacer {
            display: none;
          }
          .filter-buttons {
            display: flex;
            gap: 10px;
            flex-shrink: 0;
          }
          .btn-text { display: inline; }

          /* Tabs - 3x2 grid (no horizontal scroll!) */
          .tabs-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 20px;
          }
          .tab-btn {
            width: 100%;
            font-size: 13px;
            padding: 10px 8px;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          /* Quick actions - 3 columns with text */
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr); }
        }


        /* =========================================================== */
        /* === MOBILE (< 640px)                                    === */
        /* === Covers: Mobile Portrait + Mobile Landscape          === */
        /* === Always 1-col cards for clean full-width display     === */
        /* =========================================================== */
        @media (max-width: 640px) {
          /* Donor cards - always 1 column on mobile */
          .cards-grid { grid-template-columns: 1fr; }

          /* Filter row - STACKED on mobile (not enough room for 3-in-row) */
          .filter-row {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          .filter-select {
            width: 100%;
            flex: none;
          }
          .filter-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          /* Tabs - still 3x2 grid, tighter */
          .tabs-row {
            gap: 6px;
          }
          .tab-btn {
            font-size: 12px;
            padding: 8px 6px;
            border-radius: 16px;
          }
          
          /* Quick actions - 2 columns, icon only */
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
          .qa-btn span { display: none; }
          .qa-btn { padding: 16px 12px; }
        }


        /* =========================================================== */
        /* === SMALL MOBILE PORTRAIT (< 380px)                    === */
        /* === Extra tight for small phones                        === */
        /* =========================================================== */
        @media (max-width: 380px) {
          .tabs-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }
          .tab-btn {
            font-size: 11px;
            padding: 8px 4px;
          }
        }
      `}</style>
    </>
  );
}