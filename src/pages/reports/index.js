// ===================================================================
// DOMAAP Reports & Exports Page
// ===================================================================
// Location: src/pages/reports/index.js
// Pattern: CSS Modules + Layout component
// Design Doc: v1.1 (7 filters including Fund Type)
// UI: Email Centre buttons + Donor Bank search cards
//
// VERSION: Consolidated — API wired + tax year fix
// ===================================================================

import { useState } from 'react';
import styles from './Reports.module.css';
import PaginationBar from '../../components/common/PaginationBar';
import {
  getReportPreview,
  downloadReport,
  formatCurrency,
  formatNumber,
} from '../../services/reportService';

// ==================================================================
// TAX YEAR HELPER
// ==================================================================
// UK Tax Year: 6 April → 5 April
// Feb 2026 → currentYear = 2025 → 2025-04-06 to 2026-04-05
// Jul 2026 → currentYear = 2026 → 2026-04-06 to 2027-04-05
// ==================================================================
const getDefaultTaxYear = () => {
  const now = new Date();
  const apr6 = new Date(now.getFullYear(), 3, 6);
  const yr = now >= apr6 ? now.getFullYear() : now.getFullYear() - 1;
  return { start: `${yr}-04-06`, end: `${yr + 1}-04-05` };
};

export default function Reports() {

  // ==================================================================
  // REPORT TYPE DEFINITIONS - Email Centre coloured buttons
  // ==================================================================
  const reportTypes = [
    {
      id: 'donation',
      title: 'Donation Report',
      icon: '📊',
      btnClass: styles.btnDonation,
      phase: 2,
    },
    {
      id: 'donor-book',
      title: 'Donor Book',
      icon: '👥',
      btnClass: styles.btnDonorBook,
      phase: 2,
    },
    {
      id: 'gift-aid',
      title: 'Gift Aid Report',
      icon: '🎁',
      btnClass: styles.btnGiftAid,
      phase: 2,
    },
    {
      id: 'recurring',
      title: 'Recurring',
      icon: '🔄',
      btnClass: styles.btnRecurring,
      phase: 3,
    },
    {
      id: 'lapsed',
      title: 'Lapsed Donors',
      icon: '⚠️',
      btnClass: styles.btnLapsed,
      phase: 3,
    },
  ];

  // ==================================================================
  // REPORT-SPECIFIC CONFIGURATIONS
  // ==================================================================
  const reportConfigs = {
    'donation': {
      title: 'Donation Report',
      icon: '📊',
      showFilters: ['paymentMode', 'fundType', 'cause', 'frequency', 'status', 'giftAid'],
      columns: ['cftNo', 'donorName', 'paymentMode', 'fundType', 'cause', 'date', 'amount', 'giftAid'],
      showHmrc: false,
    },
    'donor-book': {
      title: 'Donor Book',
      icon: '👥',
      showFilters: [],
      columns: ['cftNo', 'donorName', 'email', 'mobile', 'address', 'postcode', 'registered'],
      showHmrc: false,
    },
    'gift-aid': {
      title: 'Gift Aid Report',
      icon: '🎁',
      showFilters: ['fundType', 'cause', 'status'],
      columns: ['cftNo', 'donorName', 'address', 'postcode', 'date', 'amount', 'giftAid'],
      showHmrc: true,
    },
  };

  // ==================================================================
  // COLUMN DEFINITIONS
  // ==================================================================
  const columnDefs = {
    cftNo:       { label: 'CFT No',       align: 'left' },
    donorName:   { label: 'Donor Name',   align: 'left' },
    paymentMode: { label: 'Payment Mode', align: 'left' },
    fundType:    { label: 'Fund Type',    align: 'left' },
    cause:       { label: 'Cause',        align: 'left' },
    date:        { label: 'Date',         align: 'left' },
    amount:      { label: 'Amount',       align: 'right' },
    giftAid:     { label: 'Gift Aid',     align: 'center' },
    email:       { label: 'Email',        align: 'left' },
    mobile:      { label: 'Mobile',       align: 'left' },
    address:     { label: 'Address',      align: 'left' },
    postcode:    { label: 'Postcode',     align: 'left' },
    registered:  { label: 'Registered',   align: 'left' },
  };

  // ==================================================================
  // STATE
  // ==================================================================
  const defaultTax = getDefaultTaxYear();
  const [selectedReport, setSelectedReport] = useState('donation');
  const [startDate, setStartDate] = useState(defaultTax.start);
  const [endDate, setEndDate] = useState(defaultTax.end);
  const [activePeriod, setActivePeriod] = useState('this-tax-year');

  // 7 Filters
  const [paymentMode, setPaymentMode] = useState('all');
  const [fundType, setFundType] = useState('all');
  const [cause, setCause] = useState('all');
  const [frequency, setFrequency] = useState('all');
  const [status, setStatus] = useState('all');
  const [giftAid, setGiftAid] = useState('all');

  // Donor Search - Donor Bank style
  const [searchCFT, setSearchCFT] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [activeSearch, setActiveSearch] = useState(null);

  // Preview + UI states
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  // ==================================================================
  // REPORT TYPE SWITCH — Reset filters, search & preview
  // ==================================================================
  const handleReportSwitch = (reportId) => {
    setSelectedReport(reportId);
    // Reset all filters to 'all'
    setPaymentMode('all');
    setFundType('all');
    setCause('all');
    setFrequency('all');
    setStatus('all');
    setGiftAid('all');
    // Clear donor search
    setSearchCFT('');
    setSearchName('');
    setSearchContact('');
    setActiveSearch(null);
    // Clear previous preview
    setPreviewData(null);
    setError(null);
    setCurrentPage(1);
  };

  // ==================================================================
  // DONOR SEARCH HANDLERS
  // ==================================================================
  const handleSearchCFT = () => {
    if (searchCFT.trim()) {
      setActiveSearch({ type: 'cft', value: searchCFT.trim() });
      setSearchName('');
      setSearchContact('');
    }
  };

  const handleSearchName = () => {
    if (searchName.trim()) {
      setActiveSearch({ type: 'name', value: searchName.trim() });
      setSearchCFT('');
      setSearchContact('');
    }
  };

  const handleSearchContact = () => {
    if (searchContact.trim()) {
      setActiveSearch({ type: 'contact', value: searchContact.trim() });
      setSearchCFT('');
      setSearchName('');
    }
  };

  const handleClearSearch = () => {
    setSearchCFT('');
    setSearchName('');
    setSearchContact('');
    setActiveSearch(null);
  };

  const handleKeyPress = (e, searchType) => {
    if (e.key === 'Enter') {
      if (searchType === 'cft') handleSearchCFT();
      else if (searchType === 'name') handleSearchName();
      else if (searchType === 'contact') handleSearchContact();
    }
  };

  // ==================================================================
  // PERIOD BUTTONS
  // ==================================================================
  const periodButtons = [
    { id: 'this-tax-year', label: 'This Tax Year' },
    { id: 'last-tax-year', label: 'Last Tax Year' },
    { id: 'q1', label: 'Q1' },
    { id: 'q2', label: 'Q2' },
    { id: 'q3', label: 'Q3' },
    { id: 'q4', label: 'Q4' },
  ];

  const handlePeriodSelect = (periodId) => {
    setActivePeriod(periodId);
    const now = new Date();
    const apr6 = new Date(now.getFullYear(), 3, 6);
    const currentYear = now >= apr6 ? now.getFullYear() : now.getFullYear() - 1;

    switch (periodId) {
      case 'this-tax-year':
        setStartDate(`${currentYear}-04-06`);
        setEndDate(`${currentYear + 1}-04-05`);
        break;
      case 'last-tax-year':
        setStartDate(`${currentYear - 1}-04-06`);
        setEndDate(`${currentYear}-04-05`);
        break;
      case 'q1':
        setStartDate(`${currentYear}-04-06`);
        setEndDate(`${currentYear}-07-05`);
        break;
      case 'q2':
        setStartDate(`${currentYear}-07-06`);
        setEndDate(`${currentYear}-10-05`);
        break;
      case 'q3':
        setStartDate(`${currentYear}-10-06`);
        setEndDate(`${currentYear + 1}-01-05`);
        break;
      case 'q4':
        setStartDate(`${currentYear + 1}-01-06`);
        setEndDate(`${currentYear + 1}-04-05`);
        break;
      default:
        break;
    }
  };

  // ==================================================================
  // FILTER OPTIONS
  // ==================================================================
  const filterOptions = {
    paymentMode: [
      { value: 'all', label: 'All Methods' },
      { value: 'Card', label: 'Card' },
      { value: 'Cash', label: 'Cash' },
      { value: 'BankTransfer', label: 'Bank Transfer' },
      { value: 'DirectDebit', label: 'Direct Debit' },
    ],
    fundType: [
      { value: 'all', label: 'All Fund Types' },
      { value: 'Sadaqah', label: 'Sadaqah' },
      { value: 'Lillah', label: 'Lillah' },
      { value: 'Other', label: 'Other' },
    ],
    cause: [
      { value: 'all', label: 'All Causes' },
      { value: 'building_institutions', label: 'Building of Institutions' },
      { value: 'sponsor_child', label: 'Sponsor a Child' },
      { value: 'where_most_needed', label: 'Where Most Needed' },
    ],
    frequency: [
      { value: 'all', label: 'All Frequencies' },
      { value: 'One-Off', label: 'One-Off' },
      { value: 'Monthly', label: 'Monthly' },
      { value: 'Yearly', label: 'Yearly' },
    ],
    status: [
      { value: 'all', label: 'All Statuses' },
      { value: 'succeeded', label: 'Succeeded' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' },
    ],
    giftAid: [
      { value: 'all', label: 'All' },
      { value: 'yes', label: 'Yes - Gift Aid' },
      { value: 'no', label: 'No Gift Aid' },
    ],
  };

  const filterSetters = {
    paymentMode: setPaymentMode,
    fundType: setFundType,
    cause: setCause,
    frequency: setFrequency,
    status: setStatus,
    giftAid: setGiftAid,
  };

  const filterValues = {
    paymentMode,
    fundType,
    cause,
    frequency,
    status,
    giftAid,
  };

  // ==================================================================
  // SHARED PARAMS BUILDER
  // ==================================================================
  const buildParams = (extras = {}) => ({
    reportType: selectedReport,
    startDate,
    endDate,
    paymentMode,
    fundType,
    cause,
    frequency,
    status,
    giftAid,
    searchType: activeSearch?.type || '',
    searchValue: activeSearch?.value || '',
    ...extras,
  });

  // ==================================================================
  // HANDLERS — REAL API CALLS
  // ==================================================================

  const handleGeneratePreview = async (page = 1) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);

    const result = await getReportPreview(buildParams({ page, pageSize: PAGE_SIZE }));

    if (result.success) {
      setPreviewData(result.data);
    } else {
      setError(result.error);
      setPreviewData(null);
    }

    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    handleGeneratePreview(newPage);
  };

  const handleDownload = async (format) => {
    setDownloading(format);

    const result = await downloadReport(buildParams({ format }));

    if (!result.success) {
      if (format === 'pdf') {
        alert('PDF download coming soon! Use CSV for now.');
      } else {
        alert(`Download failed: ${result.error}`);
      }
    }

    setDownloading(null);
  };

  // ==================================================================
  // CURRENT CONFIG
  // ==================================================================
  const config = reportConfigs[selectedReport] || reportConfigs['donation'];

  // ==================================================================
  // RENDER HELPERS
  // ==================================================================
  const renderCellValue = (row, colKey) => {
    const value = row[colKey];
    if (colKey === 'giftAid') {
      return (
        <span className={value ? styles.giftAidYes : styles.giftAidNo}>
          {value ? '✓ Yes' : '✗ No'}
        </span>
      );
    }
    return value || '-';
  };

  const renderStats = () => {
    if (!previewData?.stats) return null;
    const { stats } = previewData;

    if (selectedReport === 'donor-book') {
      return (
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={`${styles.statNumber} ${styles.statNumberGreen}`}>
              {formatNumber(stats.totalDonors)}
            </div>
            <div className={styles.statLabel}>Total Donors</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={`${styles.statNumber} ${styles.statNumberGreen}`}>
              {formatNumber(stats.withEmail)}
            </div>
            <div className={styles.statLabel}>With Email</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={`${styles.statNumber} ${styles.statNumberGreen}`}>
              {formatNumber(stats.withMobile)}
            </div>
            <div className={styles.statLabel}>With Mobile</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardRed}`}>
            <div className={`${styles.statNumber} ${styles.statNumberRed}`}>
              {formatNumber(stats.withGDPR)}
            </div>
            <div className={styles.statLabel}>GDPR Consent</div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={`${styles.statNumber} ${styles.statNumberGreen}`}>
            {formatCurrency(stats.totalAmount)}
          </div>
          <div className={styles.statLabel}>Total Amount</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={`${styles.statNumber} ${styles.statNumberGreen}`}>
            {formatNumber(stats.totalDonations)}
          </div>
          <div className={styles.statLabel}>Total Donations</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={`${styles.statNumber} ${styles.statNumberGreen}`}>
            {formatNumber(stats.uniqueDonors)}
          </div>
          <div className={styles.statLabel}>Unique Donors</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardRed}`}>
          <div className={`${styles.statNumber} ${styles.statNumberRed}`}>
            {formatCurrency(stats.giftAidValue)}
          </div>
          <div className={styles.statLabel}>Gift Aid Value (25%)</div>
        </div>
      </div>
    );
  };

  // ==================================================================
  // RENDER
  // ==================================================================
  return (
    <div className={styles.pageContainer}>

      {/* Page Title */}
      <h1 className={styles.pageTitle}>📋 Reports & Exports</h1>

      {/* Main Layout */}
      <div className={styles.mainGrid}>

        {/* ========================================= */}
        {/* REPORT TYPE BUTTONS - Email Centre Style  */}
        {/* ========================================= */}
        <div className={styles.reportTypeSection}>
          <h3 className={styles.sidebarTitle}>Select Report Type</h3>
          <div className={styles.reportTypeList}>
            {reportTypes.map((report) => {
              const isActive = selectedReport === report.id;
              const isDisabled = report.phase === 3;

              return (
                <button
                  key={report.id}
                  className={`${styles.reportTypeBtn} ${report.btnClass} ${isActive ? styles.reportTypeBtnActive : ''} ${isDisabled ? styles.reportTypeBtnDisabled : ''}`}
                  onClick={() => !isDisabled && handleReportSwitch(report.id)}
                  disabled={isDisabled}
                >
                  <span className={styles.reportBtnIcon}>{report.icon}</span>
                  {report.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================= */}
        {/* CONFIG PANEL - Search, Filters & Preview  */}
        {/* ========================================= */}
        <div className={styles.configPanel}>

          {/* Report Title */}
          <h2 className={styles.panelTitle}>
            <span>{config.icon}</span> {config.title}
          </h2>

          {/* Donor Search Cards - Inside Config Panel */}
          <label className={styles.sectionLabel}>Search Specific Donor (Optional)</label>
          <div className={styles.searchGrid}>

            {/* Card 1: CFT No - Blue */}
            <div className={`${styles.searchCard} ${styles.searchCardBlue}`}>
              <div className={styles.searchCardHeader}>
                <div className={`${styles.searchCardIcon} ${styles.searchCardIconBlue}`}>
                  🔢
                </div>
                <div>
                  <div className={styles.searchCardTitle}>Search by CFT No</div>
                  <div className={styles.searchCardSubtitle}>Enter donor&apos;s unique ID</div>
                </div>
              </div>
              <div className={styles.searchCardSeparator} />
              <div className={styles.searchCardInputRow}>
                <input
                  className={styles.searchCardInput}
                  type="text"
                  placeholder="e.g. 001, 002..."
                  value={searchCFT}
                  onChange={(e) => setSearchCFT(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'cft')}
                />
                <button
                  className={`${styles.searchCardBtn} ${styles.searchBtnBlue}`}
                  onClick={handleSearchCFT}
                  disabled={!searchCFT.trim()}
                >
                  🔍 Search
                </button>
              </div>
            </div>

            {/* Card 2: Name - Green */}
            <div className={`${styles.searchCard} ${styles.searchCardGreen}`}>
              <div className={styles.searchCardHeader}>
                <div className={`${styles.searchCardIcon} ${styles.searchCardIconGreen}`}>
                  👤
                </div>
                <div>
                  <div className={styles.searchCardTitle}>Search by Name</div>
                  <div className={styles.searchCardSubtitle}>Enter first or last name</div>
                </div>
              </div>
              <div className={styles.searchCardSeparator} />
              <div className={styles.searchCardInputRow}>
                <input
                  className={styles.searchCardInput}
                  type="text"
                  placeholder="e.g. Nawaz, Ahmed..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'name')}
                />
                <button
                  className={`${styles.searchCardBtn} ${styles.searchBtnGreen}`}
                  onClick={handleSearchName}
                  disabled={!searchName.trim()}
                >
                  🔍 Search
                </button>
              </div>
            </div>

            {/* Card 3: Email/Phone - Orange */}
            <div className={`${styles.searchCard} ${styles.searchCardOrange}`}>
              <div className={styles.searchCardHeader}>
                <div className={`${styles.searchCardIcon} ${styles.searchCardIconOrange}`}>
                  ✉️
                </div>
                <div>
                  <div className={styles.searchCardTitle}>Search by Email/Phone</div>
                  <div className={styles.searchCardSubtitle}>Enter email or mobile</div>
                </div>
              </div>
              <div className={styles.searchCardSeparator} />
              <div className={styles.searchCardInputRow}>
                <input
                  className={styles.searchCardInput}
                  type="text"
                  placeholder="e.g. @gmail, 0787..."
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'contact')}
                />
                <button
                  className={`${styles.searchCardBtn} ${styles.searchBtnOrange}`}
                  onClick={handleSearchContact}
                  disabled={!searchContact.trim()}
                >
                  🔍 Search
                </button>
              </div>
            </div>
          </div>

          {/* Active Search Indicator */}
          {activeSearch && (
            <div className={styles.activeSearchBar}>
              <span className={styles.activeSearchText}>
                🔍 Filtering report by {activeSearch.type === 'cft' ? 'CFT No' : activeSearch.type === 'name' ? 'Name' : 'Email/Phone'}: &quot;{activeSearch.value}&quot;
              </span>
              <button className={styles.activeSearchClear} onClick={handleClearSearch}>
                ✕ Clear
              </button>
            </div>
          )}

          {/* Date Range (shown for all reports) */}
          <label className={styles.sectionLabel} style={{ marginTop: '20px' }}>Date Range (UK Tax Year)</label>
          <div className={styles.dateRow}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setActivePeriod(null); }}
              className={styles.dateInput}
            />
            <span className={styles.dateSeparator}>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setActivePeriod(null); }}
              className={styles.dateInput}
            />
          </div>

          {/* Period Quick Select */}
          <div className={styles.periodRow}>
            {periodButtons.map((period) => (
              <button
                key={period.id}
                className={`${styles.periodBtn} ${activePeriod === period.id ? styles.periodBtnActive : ''}`}
                onClick={() => handlePeriodSelect(period.id)}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Filters (dynamic per report type) */}
          {config.showFilters.length > 0 && (
            <>
              <label className={styles.sectionLabel}>Filters</label>
              <div className={styles.filterGrid}>
                {config.showFilters.map((filterKey) => (
                  <div key={filterKey} className={styles.filterGroup}>
                    <span className={styles.filterLabel}>
                      {filterKey === 'paymentMode' && 'Payment Method'}
                      {filterKey === 'fundType' && 'Fund Type'}
                      {filterKey === 'cause' && 'Cause'}
                      {filterKey === 'frequency' && 'Frequency'}
                      {filterKey === 'status' && 'Status'}
                      {filterKey === 'giftAid' && 'Gift Aid'}
                    </span>
                    <select
                      className={styles.filterSelect}
                      value={filterValues[filterKey]}
                      onChange={(e) => filterSetters[filterKey](e.target.value)}
                    >
                      {filterOptions[filterKey].map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Generate Preview Button */}
          <div className={styles.generateRow}>
            <button
              className={styles.generateBtn}
              onClick={() => handleGeneratePreview()}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '⚡ Generate Preview'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.activeSearchBar} style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
              <span className={styles.activeSearchText} style={{ color: '#EF4444' }}>
                ⚠️ {error}
              </span>
              <button className={styles.activeSearchClear} onClick={() => setError(null)}>
                ✕ Close
              </button>
            </div>
          )}

          {/* ===== PREVIEW RESULTS ===== */}
          {previewData ? (
            <>
              {/* Summary Stats — dynamic per report type */}
              <label className={styles.sectionLabel}>Preview Summary</label>
              {renderStats()}

              {/* Preview Table */}
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      {config.columns.map((colKey) => (
                        <th key={colKey} style={{ textAlign: columnDefs[colKey]?.align || 'left' }}>
                          {columnDefs[colKey]?.label || colKey}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row, index) => (
                      <tr key={index} className={styles.tableRow}>
                        {config.columns.map((colKey) => (
                          <td key={colKey} style={{ textAlign: columnDefs[colKey]?.align || 'left' }}>
                            {renderCellValue(row, colKey)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.totalRows > 0 && (
                  <PaginationBar
                    pagination={{
                      page: currentPage,
                      pageSize: PAGE_SIZE,
                      total: previewData.totalRows,
                      totalPages: Math.ceil(previewData.totalRows / PAGE_SIZE),
                    }}
                    onPageChange={handlePageChange}
                    loading={loading}
                    formatNumber={formatNumber}
                    itemLabel="records"
                  />
                )}
              </div>

              {/* Download Buttons */}
              <div className={styles.downloadRow}>
                <button
                  className={`${styles.downloadBtn} ${styles.btnPdf}`}
                  onClick={() => handleDownload('pdf')}
                  disabled={downloading === 'pdf'}
                >
                  {downloading === 'pdf' ? '⏳ Generating...' : '📄 Download PDF'}
                </button>
                <button
                  className={`${styles.downloadBtn} ${styles.btnCsv}`}
                  onClick={() => handleDownload('csv')}
                  disabled={downloading === 'csv'}
                >
                  {downloading === 'csv' ? '⏳ Downloading...' : '📊 Download CSV'}
                </button>
                {config.showHmrc && (
                  <button
                    className={`${styles.downloadBtn} ${styles.btnHmrc}`}
                    onClick={() => handleDownload('hmrc')}
                    disabled={downloading === 'hmrc'}
                  >
                    {downloading === 'hmrc' ? '⏳ Downloading...' : '🏛️ HMRC Format'}
                  </button>
                )}
              </div>
              {config.showHmrc && (
                <div className={styles.hmrcNote}>HMRC format available for Gift Aid report only</div>
              )}
            </>
          ) : (
            /* Empty State - Before Generate */
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>{config.icon}</div>
              <div className={styles.emptyText}>Configure your filters and click Generate Preview</div>
              <div className={styles.emptySubtext}>
                {selectedReport === 'donor-book'
                  ? 'The full donor register will be exported'
                  : 'Preview data will appear here with summary statistics'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}