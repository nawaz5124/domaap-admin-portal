// ===================================================================
// 📧 Email Centre Page — Phase 1: Foundation
// ===================================================================
// Location: src/pages/email/index.js
// Updated:  February 2026 - Phase 1 (replaces visual prototype)
// Changes:  - Connected to real API via emailService.js
//           - Moved from inline styles → email.module.css
//           - Loading / empty / error states
//           - Live search, category tabs, status filter, pagination
//           - Resend action wired to POST /api/admin/emails/<id>/resend/
//           - Cross-page compose via URL query params (Phase 2 ready)
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getEmailStats, getEmails, resendEmail } from '@/services/emailService';
import PaginationBar from '@/components/common/PaginationBar';
import styles from './email.module.css';

export default function EmailCentrePage() {
  const router = useRouter();

  // ------------------------------------------------------------------
  // STATE
  // ------------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats (analytics cards + tab counts)
  const [stats, setStats] = useState(null);

  // Emails (table data)
  const [emails, setEmails] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1, pageSize: 10, total: 0, totalPages: 1,
  });

  // Filters
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Selection
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Resend in progress
  const [resending, setResending] = useState(null);

  // Detail modal
  const [viewEmail, setViewEmail] = useState(null);

  // ------------------------------------------------------------------
  // COMPOSE BUTTONS (static UI config — these don't come from API)
  // ------------------------------------------------------------------
  const composeButtons = [
    { id: 'solo', label: 'Solo Email', icon: '👤', bg: '#3B82F6', color: '#fff' },
    { id: 'group', label: 'Group Email', icon: '👥', bg: '#3B82F6', color: '#fff' },
    { id: 'marketing', label: 'Marketing', icon: '📢', bg: '#F59E0B', color: '#fff' },
    { id: 'reminder', label: 'Reminder', icon: '⏰', bg: '#EF4444', color: '#fff' },
    { id: 'personalised', label: 'Bespoke', icon: '⭐', bg: '#EC4899', color: '#fff' },
  ];

  // ------------------------------------------------------------------
  // CATEGORY TABS (counts come from stats API)
  // ------------------------------------------------------------------
  const buildTabs = useCallback(() => {
    if (!stats) return [{ id: 'all', label: 'All', count: 0 }];
    return [
      { id: 'all',          label: 'All',           count: stats.countAll,          icon: '' },
      { id: 'receipt',      label: 'Receipts',      count: stats.countReceipt,      icon: '🧾' },
      { id: 'newsletter',   label: 'Newsletters',   count: stats.countNewsletter,   icon: '📰' },
      { id: 'campaign',     label: 'Campaigns',     count: stats.countCampaign,     icon: '📢' },
      { id: 'reminder',     label: 'Reminders',     count: stats.countReminder,     icon: '⏰' },
      { id: 'notification', label: 'Notifications', count: stats.countNotification, icon: '🔔' },
      { id: 'volunteer',    label: 'Volunteer',     count: stats.countVolunteer,    icon: '🤝' },
    ];
  }, [stats]);

  // ------------------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------------------
  const fetchStats = useCallback(async () => {
    const res = await getEmailStats();
    if (res.success) setStats(res.data);
  }, []);

  const fetchEmails = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmails({
        page,
        pageSize: pagination.pageSize,
        search: searchQuery,
        category: activeTab,
        status: statusFilter !== 'all' ? statusFilter : '',
      });
      if (res.success) {
        setEmails(res.data);
        setPagination(res.pagination);
      } else {
        setError(res.error || 'Failed to load emails');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTab, statusFilter, pagination.pageSize]);

  // ------------------------------------------------------------------
  // EFFECTS
  // ------------------------------------------------------------------
  // Initial load
  useEffect(() => {
    fetchStats();
    fetchEmails(1);
  }, []);

  // Re-fetch when filters change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmails(1);
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(timer);
  }, [activeTab, statusFilter, searchQuery]);

  // ------------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------------
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedEmails([]);
  };

  const handlePageChange = (page) => {
    fetchEmails(page);
    setSelectedEmails([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmails(emails.map((em) => em.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectEmail = (id) => {
    setSelectedEmails((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleResend = async (emailId) => {
    // Safety check — confirm before resending
    const confirmed = window.confirm(
      'Are you sure you want to resend this email?\nA new email will be sent to the recipient.'
    );
    if (!confirmed) return;

    setResending(emailId);
    const res = await resendEmail(emailId);
    setResending(null);
    if (res.success) {
      // Refresh data after resend
      fetchStats();
      fetchEmails(pagination.page);
    } else {
      alert(`Resend failed: ${res.error}`);
    }
  };

  const handleCompose = (type) => {
    router.push(`/email/compose?type=${type}`);
  };

  // ------------------------------------------------------------------
  // RENDER HELPERS
  // ------------------------------------------------------------------
  const tabs = buildTabs();

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  return (
    <div className={styles.pageContainer}>

      {/* ============ PAGE TITLE ============ */}
      <h1 className={styles.pageTitle}>Email Centre</h1>

      {/* ============ COMPOSE BAR ============ */}
      <div className={styles.composeBar}>
        {composeButtons.map((btn) => (
          <button
            key={btn.id}
            className={styles.composeBtn}
            style={{ background: btn.bg, color: btn.color }}
            onClick={() => handleCompose(btn.id)}
          >
            <span>{btn.icon}</span> {btn.label}
          </button>
        ))}
        <div className={styles.composeSpacer} />
        <button className={styles.generateBtn} onClick={() => handleCompose('generate')}>
          <span>✨</span> Write Email
        </button>
      </div>

      {/* ============ ANALYTICS CARDS ============ */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59,130,246,0.1)' }}>📤</div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats?.sentThisMonth ?? '—'}</span>
            {stats && stats.monthChangePercent !== 0 && (
              <span className={`${styles.statChange} ${stats.monthChangePercent >= 0 ? styles.statChangeUp : styles.statChangeDown}`}>
                {stats.monthChangePercent >= 0 ? '↑' : '↓'} {Math.abs(stats.monthChangePercent)}% from last month
              </span>
            )}
            <span className={styles.statLabel}>Sent This Month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(34,197,94,0.1)' }}>📧</div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats?.totalSent ?? '—'}</span>
            <span className={styles.statLabel}>Total Emails Sent</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(239,68,68,0.1)' }}>⚠️</div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats?.totalFailed ?? '—'}</span>
            <span className={styles.statLabel}>Failed</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(249,115,22,0.1)' }}>📅</div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats?.totalScheduled ?? '—'}</span>
            <span className={styles.statLabel}>Scheduled</span>
          </div>
        </div>
      </div>

      {/* ============ CATEGORY TABS ============ */}
      <div className={styles.tabsWrapper}>
        {/* "All" tab — full width on mobile */}
        <button
          className={`${styles.tab} ${styles.tabAll} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All
          <span className={styles.tabCount}>{tabs.find((t) => t.id === 'all')?.count || 0}</span>
        </button>

        {/* Category tabs — horizontal scroll on mobile */}
        <div className={styles.tabsScroll}>
          {tabs.filter((t) => t.id !== 'all').map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              <span className={styles.tabCount}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============ SEARCH & FILTER ROW ============ */}
      <div className={styles.filterRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search emails by subject, recipient, CFT number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* ============ EMAIL TABLE ============ */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <span>Loading emails...</span>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⚠️</div>
            <div className={styles.emptyTitle}>Error loading emails</div>
            <div className={styles.emptySubtext}>{error}</div>
          </div>
        ) : emails.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <div className={styles.emptyTitle}>No emails found</div>
            <div className={styles.emptySubtext}>
              {searchQuery || activeTab !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Emails will appear here once the system starts sending them'}
            </div>
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={`${styles.checkboxCell} ${styles.colHideMobile}`}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      onChange={handleSelectAll}
                      checked={selectedEmails.length === emails.length && emails.length > 0}
                    />
                  </th>
                  <th className={styles.colHideMobile}>Type</th>
                  <th>Subject</th>
                  <th>Recipient</th>
                  <th className={styles.colHideMobile}>Sent</th>
                  <th>Status</th>
                  <th className={styles.colHideMobile}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr
                    key={email.id}
                    className={`${styles.tableRow} ${email.isFailed ? styles.tableRowFailed : ''}`}
                    onClick={() => setViewEmail(email)}
                  >
                    {/* Checkbox — hidden on mobile */}
                    <td className={`${styles.checkboxCell} ${styles.colHideMobile}`}>
                      {email.isFailed ? (
                        <span title="Failed email">⚠️</span>
                      ) : (
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedEmails.includes(email.id)}
                          onChange={() => handleSelectEmail(email.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </td>

                    {/* Type badge — hidden on mobile */}
                    <td className={styles.colHideMobile}>
                      <span
                        className={styles.typeBadge}
                        style={{ color: email.typeColor, background: email.typeBg }}
                      >
                        {email.typeIcon} {email.type}
                      </span>
                    </td>

                    {/* Subject — always visible */}
                    <td>
                      <span className={`${styles.subjectText} ${email.isFailed ? styles.subjectFailed : ''}`}>
                        {email.subject}
                      </span>
                    </td>

                    {/* Recipient — always visible */}
                    <td>
                      <span className={styles.recipientText}>
                        {email.recipients}
                      </span>
                    </td>

                    {/* Date — hidden on mobile */}
                    <td className={styles.colHideMobile}>
                      <span className={`${styles.dateText} ${email.isScheduled ? styles.dateScheduled : ''}`}>
                        {email.sent}
                      </span>
                    </td>

                    {/* Status badge — always visible */}
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ color: email.statusColor, background: email.statusBg }}
                      >
                        {email.statusIcon} {email.status}
                      </span>
                    </td>

                    {/* Actions — hidden on mobile (row tap opens modal instead) */}
                    <td className={styles.colHideMobile}>
                      <div className={styles.actionsCell}>
                        {/* View */}
                        <button
                          className={styles.actionBtn}
                          title="View details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewEmail(email);
                          }}
                        >
                          👁
                        </button>

                        {/* Resend (for sent and failed) */}
                        {(email.rawStatus === 'sent' || email.rawStatus === 'failed') && (
                          <button
                            className={styles.actionBtn}
                            title="Resend email"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResend(email.id);
                            }}
                            disabled={resending === email.id}
                          >
                            {resending === email.id ? '⏳' : '🔄'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationBar
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
              itemLabel="emails"
            />
          </>
        )}
      </div>

      {/* ============ DAILY QUOTE ============ */}
      <div className={styles.quoteCard}>
        &ldquo;Indeed, Allah is with those who are patient&rdquo; — Quran 2:153
      </div>

      {/* ============ EMAIL DETAIL MODAL ============ */}
      {viewEmail && (
        <div className={styles.modalOverlay} onClick={() => setViewEmail(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>📧 Email Details</span>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setViewEmail(null)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {/* Status badge at top */}
              <div className={styles.modalStatusRow}>
                <span
                  className={styles.statusBadge}
                  style={{ color: viewEmail.statusColor, background: viewEmail.statusBg }}
                >
                  {viewEmail.statusIcon} {viewEmail.status}
                </span>
                <span
                  className={styles.typeBadge}
                  style={{ color: viewEmail.typeColor, background: viewEmail.typeBg }}
                >
                  {viewEmail.typeIcon} {viewEmail.type}
                </span>
              </div>

              {/* Detail rows */}
              <div className={styles.modalDetailGrid}>
                <div className={styles.modalDetailRow}>
                  <span className={styles.modalDetailLabel}>Subject</span>
                  <span className={styles.modalDetailValue}>{viewEmail.subject}</span>
                </div>
                <div className={styles.modalDetailRow}>
                  <span className={styles.modalDetailLabel}>Recipient</span>
                  <span className={styles.modalDetailValue}>
                    {viewEmail.recipientName || '—'}
                    {viewEmail.recipientEmail && (
                      <span className={styles.modalDetailSub}> ({viewEmail.recipientEmail})</span>
                    )}
                  </span>
                </div>
                <div className={styles.modalDetailRow}>
                  <span className={styles.modalDetailLabel}>Sent</span>
                  <span className={styles.modalDetailValue}>{viewEmail.sent}</span>
                </div>
                <div className={styles.modalDetailRow}>
                  <span className={styles.modalDetailLabel}>Template</span>
                  <span className={styles.modalDetailValue}>{viewEmail.templateType || '—'}</span>
                </div>
                {viewEmail.cftNo && (
                  <div className={styles.modalDetailRow}>
                    <span className={styles.modalDetailLabel}>CFT No</span>
                    <span className={styles.modalDetailValue}>{viewEmail.cftNo}</span>
                  </div>
                )}
                {viewEmail.stripeReference && (
                  <div className={styles.modalDetailRow}>
                    <span className={styles.modalDetailLabel}>Stripe Ref</span>
                    <span className={styles.modalDetailValue}>{viewEmail.stripeReference}</span>
                  </div>
                )}
                <div className={styles.modalDetailRow}>
                  <span className={styles.modalDetailLabel}>Trigger</span>
                  <span className={styles.modalDetailValue}>{viewEmail.triggerSource || '—'}</span>
                </div>
                {viewEmail.errorMessage && (
                  <div className={`${styles.modalDetailRow} ${styles.modalDetailError}`}>
                    <span className={styles.modalDetailLabel}>⚠️ Error</span>
                    <span className={styles.modalDetailValue}>{viewEmail.errorMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              {(viewEmail.rawStatus === 'sent' || viewEmail.rawStatus === 'failed') && (
                <button
                  className={styles.modalResendBtn}
                  onClick={() => {
                    handleResend(viewEmail.id);
                    setViewEmail(null);
                  }}
                >
                  🔄 Resend
                </button>
              )}
              <button
                className={styles.modalCloseFooterBtn}
                onClick={() => setViewEmail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}