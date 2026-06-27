// ===================================================================
// 👤 Donor Profile Search Page
// ===================================================================
// Location: src/pages/donor-profile/index.js
// Route: /donor-profile
// Updated: February 2026 - API-wired + CSS Modules + Responsive
// 
// Components Used:
//   - DonorSearchCards   → 3-card search UI (already responsive)
//   - PaginationBar      → responsive pagination
//
// Services Used (EXISTING - no new files needed):
//   - donorService.js         → getDonorStats, getDonorList (with searchType)
//   - donorProfileService.js  → getDonorProfile (full detail for preview)
//
// Styles:
//   - donor-profile.module.css → all page styles (CSS Modules)
//
// Layout:  Desktop/Tablet-L: 50/50 | Tablet-P: stack | Mobile: stack
// Table:   5 visible rows with scroll (desktop/tablet-L)
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import DonorSearchCards from '../../components/common/DonorSearchCards';
import PaginationBar from '../../components/common/PaginationBar';
import { getDonorStats, getDonorList } from '../../services/donorService';
import { getDonorProfile, getDonorDonations, formatCurrency } from '../../services/donorProfileService';
import styles from './donor-profile.module.css';

// ===================================================================
// HELPERS
// ===================================================================

const CATEGORY_STYLES = {
  'DD':        { bg: '#dbeafe', color: '#3b82f6', icon: '⭐' },
  'Premium':   { bg: '#f0fdf4', color: '#22c55e', icon: '🌙' },
  'Regular':   { bg: '#fef3c7', color: '#f59e0b', icon: '' },
  'Lapsed':    { bg: '#fef2f2', color: '#ef4444', icon: '' },
  'Non-Donor': { bg: '#f3f4f6', color: '#6b7280', icon: '' },
  'Cancelled': { bg: '#fef2f2', color: '#ef4444', icon: '' },
};

function getCategoryDisplay(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES['Non-Donor'];
}

export default function DonorProfileSearch() {
  const router = useRouter();

  // ===================================================================
  // STATE
  // ===================================================================

  // Stats (header badges) — from donorService.getDonorStats()
  const [stats, setStats] = useState({ total: 0, dd: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Donor list (table) — from donorService.getDonorList()
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected donor (preview panel)
  const [selectedDonor, setSelectedDonor] = useState(null);  // basic data from list
  const [donorDetail, setDonorDetail] = useState(null);       // full data from profile API
  const [donorDonations, setDonorDonations] = useState([]);   // donations from separate API
  const [previewLoading, setPreviewLoading] = useState(false);

  // Search state
  const [searchActive, setSearchActive] = useState(false);
  const [searchInfo, setSearchInfo] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0, page: 1, pageSize: 10, totalPages: 1,
  });

  // ===================================================================
  // DATA FETCHING
  // ===================================================================

  // Fetch stats on mount
  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      const result = await getDonorStats();
      if (result.success) {
        setStats(result.data);
      }
      setStatsLoading(false);
    }
    fetchStats();
  }, []);

  // Fetch donor list (on mount + when page changes, only when NOT searching)
  const fetchDonors = useCallback(async (page = 1) => {
    setDonorsLoading(true);
    setError(null);

    const result = await getDonorList({
      page,
      pageSize: pagination.pageSize,
    });

    if (result.success) {
      setDonors(result.data.donors);
      setPagination(result.data.pagination);
    } else {
      setError(result.error);
    }

    setDonorsLoading(false);
  }, [pagination.pageSize]);

  useEffect(() => {
    if (!searchActive) {
      fetchDonors(pagination.page);
    }
  }, [pagination.page, searchActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch full donor detail + donations for preview panel
  const fetchDonorDetail = async (cftNo) => {
    setPreviewLoading(true);
    setDonorDetail(null);
    setDonorDonations([]);

    // Fetch profile and donations in parallel
    const [profileResult, donationsResult] = await Promise.allSettled([
      getDonorProfile(cftNo),
      getDonorDonations(cftNo, { page: 1, page_size: 5 }),
    ]);

    // Profile — handle both wrapped { success, data } and raw response
    if (profileResult.status === 'fulfilled') {
      const result = profileResult.value;
      const data = result?.success ? result.data : result;
      if (data) setDonorDetail(data);
    }

    // Donations — handle both wrapped and raw
    if (donationsResult.status === 'fulfilled') {
      const result = donationsResult.value;
      const donations = result?.success ? result.data?.donations : (result?.results || result?.donations || []);
      if (Array.isArray(donations)) {
        setDonorDonations(donations.slice(0, 5));
      }
    }

    setPreviewLoading(false);
  };

  // ===================================================================
  // HANDLERS
  // ===================================================================

  const handleSearch = async ({ type, value }) => {
    if (type === 'clear') {
      setSelectedDonor(null);
      setDonorDetail(null);
      setDonorDonations([]);
      setSearchActive(false);
      setSearchInfo(null);
      setPagination(prev => ({ ...prev, page: 1 }));
      return;
    }

    setDonorsLoading(true);
    setError(null);
    setSearchActive(true);
    setSearchInfo({ type, value });

    const result = await getDonorList({
      page: 1,
      pageSize: 10,
      search: value,
      searchType: type,
    });

    if (result.success) {
      setDonors(result.data.donors);
      setPagination(result.data.pagination);

      // Auto-select if exactly one result
      if (result.data.donors.length === 1) {
        const donor = result.data.donors[0];
        setSelectedDonor(donor);
        fetchDonorDetail(donor.cftNo);
      } else if (result.data.donors.length === 0) {
        setSelectedDonor(null);
        setDonorDetail(null);
        setDonorDonations([]);
      }
    } else {
      setError(result.error);
    }

    setDonorsLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setPagination(prev => ({ ...prev, page: newPage }));

    if (searchActive && searchInfo) {
      (async () => {
        setDonorsLoading(true);
        const result = await getDonorList({
          page: newPage,
          pageSize: pagination.pageSize,
          search: searchInfo.value,
          searchType: searchInfo.type,
        });
        if (result.success) {
          setDonors(result.data.donors);
          setPagination(result.data.pagination);
        }
        setDonorsLoading(false);
      })();
    }
  };

  const handleRowClick = (donor) => {
    setSelectedDonor(donor);
    fetchDonorDetail(donor.cftNo);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // ===================================================================
  // PREVIEW DATA (merge list + detail)
  // ===================================================================

  const preview = selectedDonor ? {
    name: selectedDonor.name,
    cftNo: selectedDonor.cftNo,
    email: selectedDonor.email,
    mobile: selectedDonor.mobile,
    category: selectedDonor.category,
    categoryColor: selectedDonor.categoryColor,
    status: selectedDonor.status,
    totalGiven: selectedDonor.totalGiven,
    donationCount: selectedDonor.donationCount,
    lastDonation: selectedDonor.lastDonation,
    volunteer: selectedDonor.volunteer,
    getUpdates: selectedDonor.getUpdates,
    ...getCategoryDisplay(selectedDonor.category),
    isPremium: selectedDonor.category === 'Premium' || selectedDonor.category === 'DD',

    // From detail API (flat camelCase response, null until loaded)
    // API returns: { cftNo, firstName, lastName, fullName, address: { houseNo, street, city, postCode },
    //   consentGDPR, consentGiftAid, consentCFT, totalDonated, giftAidTotal, memberSince,
    //   lastDonation, createdAt, updatedAt, isDirectDebitor, isPremium, ddAmount, ddFrequency }
    address: donorDetail?.address
      ? `${donorDetail.address.houseNo || ''} ${donorDetail.address.street || ''}, ${donorDetail.address.city || ''}, ${donorDetail.address.postCode || ''}`.replace(/^[\s,]+|[\s,]+$/g, '')
      : selectedDonor.postcode || '-',
    memberSince: donorDetail?.memberSince || null,
    // TD-085 CONSENT-DECOUPLE: gdprConsent removed — front-end no longer reads GDPR consent.
    // gdprConsent: donorDetail?.consentGDPR ?? null,
    giftAidConsent: donorDetail?.consentGiftAid ?? null,
    // TD-085 CONSENT-DECOUPLE: consentCFT removed — front-end no longer reads CFT fund consent.
    // consentCFT: donorDetail?.consentCFT ?? null,
    giftAid: donorDetail?.giftAidTotal || null,
    activeDD: donorDetail?.isDirectDebitor
      ? `${donorDetail.ddAmount} / ${donorDetail.ddFrequency}`
      : '-',
    // Donor Details section
    source: donorDetail?.source || null,
    stripeCustomerId: donorDetail?.stripeCustomerId || null,
    annualTotal: donorDetail?.totalDonated || null,
    lastDonationDate: donorDetail?.lastDonation || null,
    updatedAt: donorDetail?.updatedAt
      ? new Date(donorDetail.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : null,
    // Recent donations from separate API call
    recentDonations: donorDonations,
  } : null;

  // ===================================================================
  // RENDER
  // ===================================================================

  return (
    <>
      {/* ============================================= */}
      {/* HEADER                                        */}
      {/* ============================================= */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>{'\uD83D\uDC64'} Donor Profile Search</h1>
          <div className={styles.headerStats}>
            <span className={`${styles.statBadge} ${styles.statBadgeBlue}`}>
              <strong>{statsLoading ? '...' : stats.total.toLocaleString()}</strong> Donors
            </span>
            <span className={`${styles.statBadge} ${styles.statBadgeGreen}`}>
              <strong>{statsLoading ? '...' : stats.dd}</strong> Active DD
            </span>
          </div>
        </div>
        <button onClick={() => router.push('/donor/new')} className={styles.btnAdd}>
          <span>+</span> <span className={styles.btnAddText}>Add New Donor</span>
        </button>
      </div>

      {/* ============================================= */}
      {/* SEARCH CARDS                                  */}
      {/* ============================================= */}
      <DonorSearchCards onSearch={handleSearch} variant="compact" />

      {/* Search Active Indicator */}
      {searchActive && searchInfo && (
        <div className={styles.searchIndicator}>
          <span>{'\uD83D\uDD0D'} Showing results for &ldquo;{searchInfo.value}&rdquo; ({pagination.total} found)</span>
          <button onClick={() => handleSearch({ type: 'clear' })} className={styles.btnClearSearch}>
            {'\u2715'} Clear Search
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={styles.errorMessage}>{'\u26A0\uFE0F'} {error}</div>
      )}

      {/* ============================================= */}
      {/* TWO COLUMN: Table + Preview                   */}
      {/* ============================================= */}
      <div className={styles.twoColumnGrid}>
        
        {/* LEFT: Donor Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>
              {searchActive ? `${'\uD83D\uDD0D'} Search Results` : `${'\uD83D\uDCCB'} Recent Donors`}
            </h3>
            <span className={styles.tableHint}>Click row to view details {'\u2192'}</span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>CFT No</th>
                  <th>Name</th>
                  <th className={styles.colP2}>Email</th>
                  <th className={styles.colCenter}>Status</th>
                </tr>
              </thead>
              <tbody>
                {donorsLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className={styles.skeletonRow}>
                      <td><div className={styles.skeletonCell} style={{ width: '40px' }} /></td>
                      <td><div className={styles.skeletonCell} /></td>
                      <td className={styles.colP2}><div className={styles.skeletonCell} /></td>
                      <td className={styles.colCenter}><div className={styles.skeletonCell} style={{ width: '60px', margin: '0 auto' }} /></td>
                    </tr>
                  ))
                ) : donors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.emptyState}>
                      <div className={styles.emptyIcon}>{'\uD83D\uDC64'}</div>
                      <div className={styles.emptyTitle}>
                        {searchActive ? 'No donors found' : 'No donors yet'}
                      </div>
                      <div className={styles.emptySubtitle}>
                        {searchActive ? 'Try a different search term' : 'Add your first donor to get started'}
                      </div>
                      {searchActive && (
                        <button onClick={() => handleSearch({ type: 'clear' })} className={styles.btnClearEmpty}>
                          Clear Search
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  donors.map((donor) => {
                    const catDisplay = getCategoryDisplay(donor.category);
                    return (
                      <tr
                        key={donor.id}
                        onClick={() => handleRowClick(donor)}
                        className={`${styles.dataRow} ${selectedDonor?.id === donor.id ? styles.rowSelected : ''}`}
                      >
                        <td>
                          <span className={styles.cftNo}>{donor.cftNo}</span>
                        </td>
                        <td className={donor.status === 'cancelled' ? styles.textCancelled : styles.textName}>
                          {donor.name}
                        </td>
                        <td className={`${styles.colP2} ${styles.textEmail}`}>{donor.email}</td>
                        <td className={styles.colCenter}>
                          <span
                            className={styles.badge}
                            style={{ backgroundColor: catDisplay.bg, color: catDisplay.color }}
                          >
                            {catDisplay.icon} {donor.category}
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
          <PaginationBar
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={donorsLoading}
            itemLabel="donors"
          />
        </div>

        {/* RIGHT: Preview Panel */}
        <div className={`${styles.previewCard} ${preview ? styles.previewActive : ''}`}>
          {preview ? (
            <>
              {/* Header */}
              <div className={styles.previewHeader}>
                <div className={styles.previewHeaderRow}>
                  <div className={styles.avatar}>{getInitials(preview.name)}</div>
                  <div className={styles.previewInfo}>
                    <div className={styles.previewName}>{preview.name}</div>
                    <div className={styles.previewMeta}>
                      CFT No: {preview.cftNo}
                      {preview.memberSince && <> {'\u2022'} Member since {preview.memberSince}</>}
                    </div>
                  </div>
                  <div className={styles.previewBadges}>
                    {preview.icon && (
                      <span className={styles.badge} style={{ backgroundColor: preview.bg, color: preview.color }}>
                        {preview.icon} {preview.category}
                      </span>
                    )}
                    {preview.isPremium && (
                      <span className={styles.badge} style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>
                        {'\uD83C\uDF19'} Premium
                      </span>
                    )}
                    {preview.status === 'cancelled' && (
                      <span className={styles.badge} style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className={styles.previewStats}>
                {[
                  { value: preview.totalGiven, label: 'Total Donated', color: '#1e3a5f' },
                  { value: preview.donationCount, label: 'Donations', color: '#1e3a5f' },
                  { value: preview.giftAid || '-', label: 'Gift Aid (25%)', color: '#22c55e' },
                  { value: preview.activeDD !== '-' ? preview.activeDD : '-', label: 'Active DD', color: '#f59e0b' },
                ].map((stat, idx) => (
                  <div key={idx} className={styles.previewStatItem}>
                    <div className={styles.previewStatValue} style={{ color: stat.color }}>{stat.value}</div>
                    <div className={styles.previewStatLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Contact & Consent */}
              <div className={styles.previewDetails}>
                <div>
                  <h4 className={styles.detailHeading}>{'\uD83D\uDCDE'} Contact Info</h4>
                  <div className={styles.detailList}>
                    <div className={styles.detailEmail}>{'\u2709\uFE0F'} {preview.email}</div>
                    <div className={styles.detailItem}>{'\uD83D\uDCF1'} {preview.mobile}</div>
                    <div className={styles.detailAddress}>{'\uD83D\uDCCD'} {preview.address}</div>
                  </div>
                </div>

                <div>
                  {/* TD-085 CONSENT-DECOUPLE: heading gate switched from gdprConsent to giftAidConsent (GDPR/CFT decoupled, Gift Aid retained). */}
                  <h4 className={styles.detailHeading}>{'\u2705'} {preview.giftAidConsent != null ? 'Consent Status' : 'Flags'}</h4>
                  <div className={styles.detailList}>
                    {preview.giftAidConsent != null ? (
                      <>
                        {[
                          // TD-085 CONSENT-DECOUPLE: GDPR + CFT consent rows removed — Gift Aid retained.
                          // { label: 'GDPR Consent', value: preview.gdprConsent },
                          { label: 'Gift Aid', value: preview.giftAidConsent },
                          // { label: 'CFT Fund', value: preview.consentCFT },  // TD-085 CONSENT-DECOUPLE
                        ].map((consent, idx) => (
                          <div key={idx} className={styles.consentRow}>
                            <span className={`${styles.consentBadge} ${consent.value ? styles.consentYes : styles.consentNo}`}>
                              {consent.value ? '\u2713' : '\u2717'} {consent.label}
                            </span>
                            {/* TD-085 CONSENT-DECOUPLE: CFT Fund warning removed — no CFT row in map anymore.
                            {!consent.value && consent.label === 'CFT Fund' && (
                              <span>{'\u26A0\uFE0F'}</span>
                            )}
                            */}
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className={styles.consentRow}>
                          <span className={`${styles.consentBadge} ${preview.volunteer ? styles.consentYes : styles.consentNo}`}>
                            {preview.volunteer ? '\u2713' : '\u2717'} Volunteer
                          </span>
                        </div>
                        <div className={styles.consentRow}>
                          <span className={`${styles.consentBadge} ${preview.getUpdates ? styles.consentYes : styles.consentNo}`}>
                            {preview.getUpdates ? '\u2713' : '\u2717'} Get Updates
                          </span>
                        </div>
                        {preview.lastDonation && preview.lastDonation !== '-' && (
                          <div className={styles.detailItem} style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                            Last donation: {preview.lastDonation}
                          </div>
                        )}
                        {previewLoading && (
                          <div className={styles.detailItem} style={{ marginTop: '6px', fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                            Loading full details...
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Donor Details (from Detail API) */}
              {donorDetail && (
                <div className={styles.donorDetailsSection}>
                  <h4 className={styles.donorDetailsTitle}>{'\uD83D\uDCCB'} Donor Details</h4>
                  <div className={styles.donorDetailsGrid}>
                    <div className={styles.donorDetailCell}>
                      <span className={styles.donorDetailLabel}>Source</span>
                      <span className={styles.donorDetailValue}>{preview.source || '-'}</span>
                    </div>
                    <div className={styles.donorDetailCell}>
                      <span className={styles.donorDetailLabel}>Total Donated</span>
                      <span className={styles.donorDetailValue}>{preview.annualTotal || '-'}</span>
                    </div>
                    <div className={styles.donorDetailCell}>
                      <span className={styles.donorDetailLabel}>Last Donation</span>
                      <span className={styles.donorDetailValue}>{preview.lastDonationDate || '-'}</span>
                    </div>
                    <div className={styles.donorDetailCell}>
                      <span className={styles.donorDetailLabel}>Stripe Customer ID</span>
                      <span className={`${styles.donorDetailValue} ${styles.donorDetailMono}`}>{preview.stripeCustomerId || '-'}</span>
                    </div>
                    <div className={styles.donorDetailCell}>
                      <span className={styles.donorDetailLabel}>Category</span>
                      <span className={styles.donorDetailValue}>
                        <span
                          className={styles.badge}
                          style={{ backgroundColor: preview.bg, color: preview.color }}
                        >
                          {preview.icon} {preview.category}
                        </span>
                      </span>
                    </div>
                    <div className={styles.donorDetailCell}>
                      <span className={styles.donorDetailLabel}>Last Updated</span>
                      <span className={styles.donorDetailValue}>{preview.updatedAt || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Donations */}
              <div className={styles.recentDonations}>
                <div className={styles.recentDonationsHeader}>
                  <h4 className={styles.recentDonationsTitle}>{'\uD83D\uDCB0'} Recent Donations</h4>
                  {preview.recentDonations.length > 0 && (
                    <span className={styles.recentDonationsHint}>Last {preview.recentDonations.length} transactions</span>
                  )}
                </div>
                {previewLoading ? (
                  <div className={styles.noDonations}>Loading donations...</div>
                ) : preview.recentDonations.length > 0 ? (
                  <div className={styles.donationsList}>
                    {preview.recentDonations.map((donation, idx) => {
                      const date = donation.date || donation.created_at || '-';
                      const amount = donation.amount || donation.formatted_amount || '-';
                      const cause = donation.causeDisplay || donation.cause_display || donation.cause || '-';
                      const status = donation.status || donation.payment_status || 'pending';
                      return (
                        <div key={idx} className={styles.donationRow}>
                          <span className={styles.donationDate}>{date}</span>
                          <span className={styles.donationAmount}>{amount}</span>
                          <span className={styles.donationCause}>{cause}</span>
                          <span className={styles.donationStatus}>
                            <span
                              className={styles.donationStatusBadge}
                              style={{
                                backgroundColor: status === 'succeeded' ? '#f0fdf4' : status === 'failed' ? '#fef2f2' : '#fefce8',
                                color: status === 'succeeded' ? '#22c55e' : status === 'failed' ? '#ef4444' : '#f59e0b',
                              }}
                            >
                              {status === 'succeeded' ? '\u2713' : status === 'failed' ? '\u2717' : '\u23F3'} {status}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.noDonations}>No donations recorded yet</div>
                )}
              </div>

              {/* Actions */}
              <div className={styles.previewActions}>
                <button className={`${styles.actionBtn} ${styles.actionAmber}`}>{'\u2709\uFE0F'} <span className={styles.actionBtnText}>Email</span></button>
                <button className={`${styles.actionBtn} ${styles.actionAmber}`}>{'\u270F\uFE0F'} <span className={styles.actionBtnText}>Edit</span></button>
                <button className={`${styles.actionBtn} ${styles.actionAmber}`}>{'\uD83E\uDDFE'} <span className={styles.actionBtnText}>Receipt</span></button>
                <button
                  onClick={() => router.push(`/donor/${preview.cftNo}/donations/history`)}
                  className={`${styles.actionBtn} ${styles.actionBlue}`}
                >
                  {'\uD83D\uDCCA'} <span className={styles.actionBtnText}>History</span>
                </button>
                <button
                  onClick={() => router.push(`/donor/${preview.cftNo}`)}
                  className={`${styles.actionBtn} ${styles.actionPrimary}`}
                >
                  View Full Profile {'\u2192'}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.previewEmpty}>
              <div className={styles.previewEmptyIcon}>{'\uD83D\uDC64'}</div>
              <div className={styles.previewEmptyTitle}>Select a Donor</div>
              <div className={styles.previewEmptyText}>
                Use the search cards above or<br/>click on a donor from the list
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}