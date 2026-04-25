// ===================================================================
// 📖 Donation Book Page
// ===================================================================
// Location: src/pages/donation-book/index.js
// Updated:  28 Feb 2026 - Fixed 404, Export routing, mobile KPI container
// Pattern:  Desktop-first (max-width) | Breakpoints: 1024 / 640 / 380
// 
// Components Used:
//   - CollapsibleFilterBar  → responsive filter row
//   - PaginationBar         → responsive pagination
//   - donation-book.module.css → page-specific styles
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { getDonationStats, getDonationList, getDonationFilters, formatCurrency, formatNumber } from '../../services/donationService';
import CollapsibleFilterBar from '../../components/common/CollapsibleFilterBar';
import PaginationBar from '../../components/common/PaginationBar';
import styles from './donation-book.module.css';

export default function DonationBook() {
  const router = useRouter();

  // ===================================================================
  // STATE
  // ===================================================================

  const [stats, setStats] = useState({
    totalThisYear: 0, totalTransactions: 0, giftAidClaimable: 0, thisMonth: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterOptions, setFilterOptions] = useState({ causes: [], paymentModes: [] });

  const [pagination, setPagination] = useState({
    total: 0, page: 1, pageSize: 10, totalPages: 1,
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCause, setSelectedCause] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Derived values
  const hasActiveFilters = startDate || endDate || selectedCause || selectedFrequency || searchQuery;
  const activeFilterCount = [startDate, endDate, selectedCause, selectedFrequency, searchQuery].filter(Boolean).length;

  // ===================================================================
  // DATA FETCHING
  // ===================================================================

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      const result = await getDonationStats({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      if (result.success) setStats(result.data);
      setStatsLoading(false);
    }
    fetchStats();
  }, [startDate, endDate]);

  useEffect(() => {
    async function fetchFilters() {
      const result = await getDonationFilters();
      if (result.success) setFilterOptions(result.data);
    }
    fetchFilters();
  }, []);

  const fetchDonations = useCallback(async () => {
    setDonationsLoading(true);
    setError(null);
    const result = await getDonationList({
      page: pagination.page, pageSize: pagination.pageSize,
      startDate: startDate || undefined, endDate: endDate || undefined,
      cause: selectedCause || undefined, frequency: selectedFrequency || undefined,
      search: searchQuery || undefined, sortBy, sortOrder,
    });
    if (result.success) {
      setDonations(result.data.donations);
      setPagination(result.data.pagination);
    } else {
      setError(result.error);
    }
    setDonationsLoading(false);
  }, [pagination.page, pagination.pageSize, startDate, endDate, selectedCause, selectedFrequency, searchQuery, sortBy, sortOrder]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  // ===================================================================
  // HANDLERS
  // ===================================================================

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetPage = () => setPagination(prev => ({ ...prev, page: 1 }));

  const handleClearFilters = () => {
    setStartDate(''); setEndDate(''); setSelectedCause('');
    setSelectedFrequency(''); setSearchQuery(''); resetPage();
  };

  // ===================================================================
  // FIX: Use window.location.href instead of router.push (avoids 404)
  // ===================================================================
  const handleViewDonor = (cftNo) => {
    if (cftNo) window.location.href = `/portal/donor-bank/${cftNo}`;
  };

  // ===================================================================
  // FILTER CONFIG (for CollapsibleFilterBar)
  // ===================================================================

  const filters = [
    {
      type: 'date',
      value: startDate,
      onChange: (val) => { setStartDate(val); resetPage(); },
    },
    {
      type: 'date',
      value: endDate,
      onChange: (val) => { setEndDate(val); resetPage(); },
    },
    {
      type: 'select',
      value: selectedCause,
      onChange: (val) => { setSelectedCause(val); resetPage(); },
      placeholder: 'All Causes',
      options: filterOptions.causes.map((c) => ({
        value: c,
        label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      })),
    },
    {
      type: 'select',
      value: selectedFrequency,
      onChange: (val) => { setSelectedFrequency(val); resetPage(); },
      placeholder: 'All Frequencies',
      options: [
        { value: 'one_off', label: 'One-off' },
        { value: 'recurring', label: 'Recurring (DD)' },
      ],
    },
  ];

  const actions = [
    { icon: '\uD83D\uDCCA', label: 'Export', onClick: () => window.location.href = '/portal/reports', variant: 'default' },
    { icon: '\uD83E\uDDFE', label: 'Receipts', onClick: () => window.location.href = '/portal/reports', variant: 'danger' },
  ];

  // Active filter tags (shown on desktop only via CollapsibleFilterBar)
  const activeTags = hasActiveFilters ? (
    <div className={styles.filterTagsRow}>
      <span className={styles.filterLabel}>{'\uD83D\uDD0D'} Active Filters:</span>
      <div className={styles.filterTags}>
        {startDate && <span className={styles.filterTag}>From: {startDate}</span>}
        {endDate && <span className={styles.filterTag}>To: {endDate}</span>}
        {selectedCause && <span className={styles.filterTag}>Cause: {selectedCause.replace(/_/g, ' ')}</span>}
        {selectedFrequency && <span className={styles.filterTag}>Freq: {selectedFrequency === 'one_off' ? 'One-off' : 'Recurring'}</span>}
      </div>
    </div>
  ) : null;

  // ===================================================================
  // KPI CONFIG (for mobile one-container view)
  // ===================================================================
  const kpiItems = [
    { icon: '\uD83D\uDCB7', iconClass: styles.kpiIconBlue, label: 'Total This Year', value: formatCurrency(stats.totalThisYear), valueClass: styles.kpiValue },
    { icon: '\uD83D\uDCCA', iconClass: styles.kpiIconGreen, label: 'Total Transactions', value: formatNumber(stats.totalTransactions), valueClass: styles.kpiValue },
    { icon: '\uD83C\uDF81', iconClass: styles.kpiIconYellow, label: 'Gift Aid Claimable', value: formatCurrency(stats.giftAidClaimable), valueClass: styles.kpiValueGreen },
    { icon: '\uD83D\uDCC5', iconClass: styles.kpiIconYellow, label: 'This Month', value: formatCurrency(stats.thisMonth), valueClass: styles.kpiValue },
  ];

  // ===================================================================
  // RENDER HELPERS
  // ===================================================================

  const renderSortIcon = (field) => {
    if (sortBy !== field) return <span className={`${styles.sortIcon} ${styles.sortInactive}`}>{'\u2195'}</span>;
    return sortOrder === 'asc'
      ? <span className={`${styles.sortIcon} ${styles.sortActive}`}>{'\u2191'}</span>
      : <span className={`${styles.sortIcon} ${styles.sortActive}`}>{'\u2193'}</span>;
  };

  // ===================================================================
  // RENDER
  // ===================================================================

  return (
    <>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>{'\uD83D\uDCD6'} Donation Book</h1>
          <span className={styles.pageSubtitle}>
            {statsLoading ? '...' : `${formatNumber(stats.totalTransactions)} transactions this year`}
          </span>
        </div>
        <button className={styles.btnAdd}>
          <span>+</span> <span>Add Entry</span>
        </button>
      </div>

      {/* Desktop/Tablet: KPI Cards Grid (4 separate cards) */}
      <div className={styles.kpiGrid}>
        {kpiItems.map((item, i) => (
          <div key={i} className={styles.kpiCard}>
            <span className={`${styles.kpiIcon} ${item.iconClass}`}>{item.icon}</span>
            <div className={styles.kpiContent}>
              <div className={item.valueClass}>{statsLoading ? '...' : item.value}</div>
              <div className={styles.kpiLabel}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: One clean container with all 4 KPIs as rows */}
      <div className={styles.kpiMobile}>
        <h3 className={styles.kpiMobileTitle}>{'\uD83D\uDCCA'} Key Stats</h3>
        {kpiItems.map((item, i) => (
          <div key={i} className={`${styles.kpiMobileRow} ${i < kpiItems.length - 1 ? styles.kpiMobileRowBorder : ''}`}>
            <div className={styles.kpiMobileLeft}>
              <span className={`${styles.kpiMobileIcon} ${item.iconClass}`}>{item.icon}</span>
              <span className={styles.kpiMobileLabel}>{item.label}</span>
            </div>
            <span className={item.valueClass}>{statsLoading ? '...' : item.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Row (responsive — handled by CollapsibleFilterBar) */}
      <CollapsibleFilterBar
        filters={filters}
        actions={actions}
        activeCount={activeFilterCount}
        hasActive={hasActiveFilters}
        onClear={handleClearFilters}
        activeTags={activeTags}
      />

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>{'\u26A0\uFE0F'} {error}</div>
      )}

      {/* Donations Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={`${styles.colId} ${styles.colP3}`}>#</th>
                <th className={styles.sortable} onClick={() => handleSort('date')}>
                  Date {renderSortIcon('date')}
                </th>
                <th className={styles.sortable} onClick={() => handleSort('donor')}>
                  Donor {renderSortIcon('donor')}
                </th>
                <th className={styles.colP3}>Type</th>
                <th className={styles.sortable} onClick={() => handleSort('cause')}>
                  Cause {renderSortIcon('cause')}
                </th>
                <th className={styles.colP2}>Freq</th>
                <th className={`${styles.colGiftaid} ${styles.colP2}`}>Gift Aid</th>
                <th className={`${styles.colAmount} ${styles.sortable}`} onClick={() => handleSort('amount')}>
                  Amount {renderSortIcon('amount')}
                </th>
                <th className={`${styles.colAction} ${styles.colP3}`}></th>
              </tr>
            </thead>
            <tbody>
              {donationsLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className={styles.skeletonRow}>
                    <td className={styles.colP3}><div className={styles.skeletonCell} /></td>
                    <td><div className={styles.skeletonCell} /></td>
                    <td><div className={styles.skeletonCell} /></td>
                    <td className={styles.colP3}><div className={styles.skeletonCell} /></td>
                    <td><div className={styles.skeletonCell} /></td>
                    <td className={styles.colP2}><div className={styles.skeletonCell} /></td>
                    <td className={styles.colP2}><div className={styles.skeletonCell} /></td>
                    <td><div className={styles.skeletonCell} /></td>
                    <td className={styles.colP3}><div className={styles.skeletonCell} /></td>
                  </tr>
                ))
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan="9" className={styles.emptyState}>
                    <div className={styles.emptyIcon}>{'\uD83D\uDCD6'}</div>
                    <div className={styles.emptyTitle}>No donations found</div>
                    <div className={styles.emptySubtitle}>
                      {hasActiveFilters ? 'Try adjusting your filters' : 'No donations recorded yet'}
                    </div>
                    {hasActiveFilters && (
                      <button onClick={handleClearFilters} className={styles.btnClearEmpty}>Clear Filters</button>
                    )}
                  </td>
                </tr>
              ) : (
                donations.map((donation, index) => (
                  <tr key={donation.id} className={styles.dataRow}>
                    <td className={`${styles.colId} ${styles.colP3}`}>
                      {((pagination.page - 1) * pagination.pageSize) + index + 1}
                    </td>
                    <td>{donation.date}</td>
                    <td>
                      {donation.donorCft ? (
                        <a
                          href={`/portal/donor-bank/${donation.donorCft}`}
                          onClick={(e) => { e.preventDefault(); handleViewDonor(donation.donorCft); }}
                          className={styles.donorLink}
                        >
                          {donation.donor}
                        </a>
                      ) : (
                        <span>{donation.donor}</span>
                      )}
                    </td>
                    <td className={styles.colP3}>
                      <span
                        className={styles.badge}
                        style={{ backgroundColor: donation.typeColor + '20', color: donation.typeColor }}
                      >
                        {donation.type}
                      </span>
                    </td>
                    <td>{donation.cause}</td>
                    <td className={styles.colP2}>
                      <span
                        className={styles.badge}
                        style={{ backgroundColor: donation.frequencyColor + '20', color: donation.frequencyColor }}
                      >
                        {donation.frequency}
                      </span>
                    </td>
                    <td className={`${styles.colGiftaid} ${styles.colP2}`}>
                      {donation.giftAid
                        ? <span className={styles.giftaidYes}>{'\u2713'}</span>
                        : <span className={styles.giftaidNo}>{'\u2014'}</span>
                      }
                    </td>
                    <td className={styles.colAmount} style={{ color: donation.amountColor }}>
                      {donation.amountFormatted}
                    </td>
                    <td className={`${styles.colAction} ${styles.colP3}`}>
                      <button
                        onClick={() => donation.invoiceUrl && window.open(donation.invoiceUrl, '_blank')}
                        disabled={!donation.invoiceUrl}
                        className={donation.invoiceUrl ? styles.btnReceipt : styles.btnReceiptDisabled}
                        title={donation.invoiceUrl ? 'View Receipt' : 'No receipt available'}
                      >
                        {'\uD83D\uDCC4'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (responsive — handled by PaginationBar) */}
        <PaginationBar
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={donationsLoading}
          formatNumber={formatNumber}
          itemLabel="transactions"
        />
      </div>
    </>
  );
}