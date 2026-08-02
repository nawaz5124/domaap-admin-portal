// ===================================================================
// ✉️ Compose Email Page — Phase 2, Steps 2.5 + 2.7
// ===================================================================
// Location: src/pages/email/compose.js
// Created: February 2026 - Phase 2 Compose & Send
// Updated: February 2026 - Added Group Email mode with filter panel
// Purpose: Compose and send emails from Admin Portal.
//          Supports Individual (solo) + Group email modes.
//          Template-based + custom emails.
//          Mobile-first responsive design.
//
// Dependencies: npm install react-quill
//
// URL: /email/compose?type=solo    (individual mode)
//      /email/compose?type=group   (group mode)
//      /email/compose?type=solo&to=email@test.com&cft=014 (cross-page)
// ===================================================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
  getTemplates,
  previewEmail,
  sendComposedEmail,
  searchDonors,
  getGroupRecipients,
  sendGroupEmail,
} from '@/services/emailService';
import logger from '@/utils/logger';
import styles from './compose.module.css';

// ============================================================
// React Quill — dynamic import (no SSR, uses 'document')
// ============================================================
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

// ============================================================
// Common emojis for quick picker
// ============================================================
const EMOJI_LIST = [
  '😊', '🤝', '❤️', '🙏', '✨', '🎉', '💚', '🌟',
  '📧', '📢', '🔔', '⭐', '🐪', '🤲', '💰', '🎁',
  '👋', '👍', '🙌', '💪', '🌹', '🕌', '☪️', '📿',
];

// ============================================================
// Group Email Filter Options (matches backend exactly)
// ============================================================
const FUND_TYPE_OPTIONS = [
  { value: 'lillah', label: 'Lillah' },
  { value: 'sadaqah', label: 'Sadaqah' },
  { value: 'zakat', label: 'Zakat' },
];


const FREQUENCY_OPTIONS = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'One-Off', label: 'One-Off' },
];

const DONOR_TYPE_OPTIONS = [
  { value: 'all', label: 'All Donors' },
  { value: 'active', label: 'Active (has donations)' },
  { value: 'recurring', label: 'Recurring (Monthly)' },
  { value: 'one_off_only', label: 'One-Off Only' },
  { value: 'lapsed', label: 'Lapsed (90+ days)' },
  { value: 'non_donor', label: 'Non-Donor (registered only)' },
];

const DATE_RANGE_OPTIONS = [
  { value: 0, label: 'All Time' },
  { value: 30, label: 'Last 30 days' },
  { value: 60, label: 'Last 60 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 180, label: 'Last 6 months' },
  { value: 365, label: 'Last 12 months' },
];

// ============================================================
// Default filter state
// ============================================================
const DEFAULT_FILTERS = {
  fund_types: [],
  frequencies: [],
  donor_type: 'all',
  newsletter_only: false,
  volunteer_only: false,
  donated_within_days: 0,
};

export default function ComposeEmailPage() {
  const router = useRouter();
  const quillRef = useRef(null);

  // ------------------------------------------------------------------
  // STATE — Email Mode
  // ------------------------------------------------------------------
  const [emailMode, setEmailMode] = useState('individual'); // 'individual' | 'group'

  // ------------------------------------------------------------------
  // STATE — Group Filters (Phase 2, Step 2.7)
  // ------------------------------------------------------------------
  const [groupFilters, setGroupFilters] = useState({ ...DEFAULT_FILTERS });
  const [groupCount, setGroupCount] = useState(null);
  const [groupDonors, setGroupDonors] = useState([]);
  const [loadingGroupCount, setLoadingGroupCount] = useState(false);
  const [showGroupPreview, setShowGroupPreview] = useState(false);
  const [sendingGroup, setSendingGroup] = useState(false);
  const [groupSendResult, setGroupSendResult] = useState(null);

  // ------------------------------------------------------------------
  // STATE — Templates (loaded from API)
  // ------------------------------------------------------------------
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Selected template
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Recipient (individual mode)
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [cftNo, setCftNo] = useState('');
  const [donorSearch, setDonorSearch] = useState('');
  const [donorResults, setDonorResults] = useState([]);
  const [showDonorDropdown, setShowDonorDropdown] = useState(false);
  const [searchingDonors, setSearchingDonors] = useState(false);
  const donorSearchRef = useRef(null);

  // Email content
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [templateFields, setTemplateFields] = useState({});

  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);

  // Preview
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Send (individual)
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // ------------------------------------------------------------------
  // QUILL TOOLBAR CONFIG
  // ------------------------------------------------------------------
  const quillModules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  }), []);

  const quillFormats = [
    'bold', 'italic', 'underline',
    'color', 'background',
    'list', 'bullet',
    'link',
  ];

  // ------------------------------------------------------------------
  // LOAD TEMPLATES ON MOUNT
  // ------------------------------------------------------------------
  useEffect(() => {
    async function loadTemplates() {
      setLoadingTemplates(true);
      const res = await getTemplates();
      if (res.success) {
        setTemplates(res.data);
        // Default to 'custom' template
        const customTpl = res.data.find((t) => t.isCustom);
        if (customTpl) setSelectedTemplate(customTpl);
      }
      setLoadingTemplates(false);
    }
    loadTemplates();
  }, []);

  // ------------------------------------------------------------------
  // TEMPLATE CHANGE (memoized to avoid stale closures)
  // ------------------------------------------------------------------
  const handleTemplateChange = useCallback(
    (templateType) => {
      const tpl = templates.find((t) => t.templateType === templateType);
      if (!tpl) return;

      setSelectedTemplate(tpl);
      setPreviewHtml('');
      setShowPreview(false);
      setSendResult(null);

      // Auto-fill subject for template emails
      if (!tpl.isCustom) {
        setSubject(tpl.subject);
        // Reset template fields
        const fields = {};
        tpl.requiredFields.forEach((f) => (fields[f] = ''));
        tpl.optionalFields.forEach((f) => (fields[f] = ''));
        setTemplateFields(fields);
      } else {
        setSubject('');
        setBody('');
        setTemplateFields({});
      }
    },
    [templates]
  );

  // ------------------------------------------------------------------
  // HANDLE URL QUERY PARAMS (cross-page compose)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!router.isReady || templates.length === 0) return;
    const { to, name, cft, template, type } = router.query;

    // Set mode from URL
    if (type === 'group') {
      setEmailMode('group');
    } else {
      setEmailMode('individual');
    }

    if (to) setRecipientEmail(to);
    if (name) setRecipientName(name);
    if (cft) setCftNo(cft);

    // Select template if specified in URL
    if (template) {
      handleTemplateChange(template);
    }
  }, [router.isReady, router.query, templates, handleTemplateChange]);

  // ------------------------------------------------------------------
  // GROUP FILTER — Auto-fetch count on filter change (debounced)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (emailMode !== 'group') return;

    const timer = setTimeout(async () => {
      setLoadingGroupCount(true);
      setGroupSendResult(null);
      try {
        const res = await getGroupRecipients(groupFilters);
        if (res.success) {
          setGroupCount(res.count);
          setGroupDonors(res.donors);
        }
      } catch (err) {
        logger.error('Group count fetch failed', err.message);
        setGroupCount(null);
        setGroupDonors([]);
      }
      setLoadingGroupCount(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [emailMode, groupFilters]);

  // ------------------------------------------------------------------
  // GROUP FILTER HANDLERS
  // ------------------------------------------------------------------
  const handleToggleFilterArray = (filterKey, value) => {
    setGroupFilters((prev) => {
      const arr = prev[filterKey];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const handleResetFilters = () => {
    setGroupFilters({ ...DEFAULT_FILTERS });
    setShowGroupPreview(false);
    setGroupSendResult(null);
  };

  // ------------------------------------------------------------------
  // DONOR SEARCH (debounced) — individual mode only
  // ------------------------------------------------------------------
  useEffect(() => {
    if (emailMode !== 'individual') return;
    if (!donorSearch || donorSearch.length < 2) {
      setDonorResults([]);
      setShowDonorDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingDonors(true);
      const res = await searchDonors(donorSearch, 5);
      if (res.success) {
        setDonorResults(res.data);
        setShowDonorDropdown(res.data.length > 0);
      }
      setSearchingDonors(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [donorSearch, emailMode]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (donorSearchRef.current && !donorSearchRef.current.contains(e.target)) {
        setShowDonorDropdown(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDonor = (donor) => {
    setRecipientEmail(donor.email);
    setRecipientName(donor.name);
    setCftNo(donor.cftNo);
    setDonorSearch('');
    setShowDonorDropdown(false);

    // Auto-fill template fields if applicable
    if (selectedTemplate && !selectedTemplate.isCustom) {
      setTemplateFields((prev) => ({
        ...prev,
        name: donor.name || prev.name,
        volunteer_name: donor.name || prev.volunteer_name,
        subscriber_name: donor.name || prev.subscriber_name,
        contact_name: donor.name || prev.contact_name,
        entry_name: donor.name || prev.entry_name,
        volunteer_email: donor.email || prev.volunteer_email,
        subscriber_email: donor.email || prev.subscriber_email,
        contact_email: donor.email || prev.contact_email,
        entry_email: donor.email || prev.entry_email,
      }));
    }
  };

  // ------------------------------------------------------------------
  // EMOJI INSERT
  // ------------------------------------------------------------------
  const handleInsertEmoji = (emoji) => {
    const editor = quillRef.current?.getEditor?.();
    if (editor) {
      const range = editor.getSelection(true);
      editor.insertText(range ? range.index : editor.getLength(), emoji);
    } else {
      setBody((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  // ------------------------------------------------------------------
  // PREVIEW
  // ------------------------------------------------------------------
  const handlePreview = async () => {
    setLoadingPreview(true);
    setSendResult(null);

    const contextData = selectedTemplate?.isCustom
      ? { subject, body }
      : { ...templateFields };

    const res = await previewEmail(selectedTemplate.templateType, contextData);

    if (res.success) {
      setPreviewHtml(res.html);
      setShowPreview(true);
    } else {
      alert(`Preview failed: ${res.error}`);
    }
    setLoadingPreview(false);
  };

  // ------------------------------------------------------------------
  // SEND — Individual
  // ------------------------------------------------------------------
  const handleSend = async () => {
    if (!recipientEmail) {
      alert('Please enter a recipient email address');
      return;
    }
    if (selectedTemplate?.isCustom && !subject) {
      alert('Please enter a subject line');
      return;
    }
    if (selectedTemplate?.isCustom && !body) {
      alert('Please enter a message body');
      return;
    }

    setSending(true);
    setSendResult(null);

    const contextData = selectedTemplate?.isCustom
      ? { subject, body }
      : { ...templateFields };

    const res = await sendComposedEmail({
      templateType: selectedTemplate.templateType,
      recipientEmail,
      recipientName,
      cftNo,
      contextData,
    });

    setSending(false);
    setSendResult(res);

    if (res.success) {
      setTimeout(() => {
        router.push('/email');
      }, 2000);
    }
  };

  // ------------------------------------------------------------------
  // SEND — Group (Phase 2, Step 2.7)
  // ------------------------------------------------------------------
  const handleGroupSend = async () => {
    if (groupCount === 0 || groupCount === null) {
      alert('No donors match the current filters');
      return;
    }
    if (!subject) {
      alert('Please enter a subject line');
      return;
    }
    if (!body || body.replace(/<[^>]*>/g, '').trim().length === 0) {
      alert('Please enter a message body');
      return;
    }

    // Confirm before sending
    const confirmed = window.confirm(
      `You are about to send this email to ${groupCount} donor${groupCount !== 1 ? 's' : ''}.\n\nAre you sure you want to proceed?`
    );
    if (!confirmed) return;

    setSendingGroup(true);
    setGroupSendResult(null);

    try {
      const res = await sendGroupEmail('custom', groupFilters, { subject, body });
      setGroupSendResult(res);

      if (res.success) {
        setTimeout(() => {
          router.push('/email');
        }, 3000);
      }
    } catch (err) {
      setGroupSendResult({ success: false, error: err.message });
    }

    setSendingGroup(false);
  };

  // ------------------------------------------------------------------
  // MODE SWITCH
  // ------------------------------------------------------------------
  const handleModeSwitch = (mode) => {
    setEmailMode(mode);
    setSendResult(null);
    setGroupSendResult(null);
    setShowPreview(false);
    setPreviewHtml('');

    // Force custom template for group mode
    if (mode === 'group') {
      const customTpl = templates.find((t) => t.isCustom);
      if (customTpl) setSelectedTemplate(customTpl);
    }
  };

  // ------------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------------
  const isCustom = selectedTemplate?.isCustom;

  const formatFieldLabel = (field) => {
    return field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const hasBodyContent = isCustom
    ? body && body.replace(/<[^>]*>/g, '').trim().length > 0
    : true;

  const canPreview = isCustom
    ? subject && hasBodyContent
    : selectedTemplate?.requiredFields?.every((f) => templateFields[f]);

  const canSend = recipientEmail && canPreview;
  const canGroupSend = groupCount > 0 && subject && hasBodyContent;

  // Count how many filters are active
  const activeFilterCount = [
    groupFilters.fund_types.length > 0,
    groupFilters.frequencies.length > 0,
    groupFilters.donor_type !== 'all',
    groupFilters.newsletter_only,
    groupFilters.volunteer_only,
    groupFilters.donated_within_days > 0,
  ].filter(Boolean).length;

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  return (
    <div className={styles.pageContainer}>

      {/* ============ HEADER ============ */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/email')}>
          ← Back to Email Centre
        </button>
        <h1 className={styles.pageTitle}>✉️ Compose Email</h1>
      </div>

      {/* ============ MODE TOGGLE ============ */}
      <div className={styles.modeToggleWrapper}>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${emailMode === 'individual' ? styles.modeBtnActive : ''}`}
            onClick={() => handleModeSwitch('individual')}
          >
            👤 Individual
          </button>
          <button
            className={`${styles.modeBtn} ${emailMode === 'group' ? styles.modeBtnActive : ''}`}
            onClick={() => handleModeSwitch('group')}
          >
            👥 Group
          </button>
        </div>
        {emailMode === 'group' && (
          <div className={styles.modeHint}>
            Send personalised emails to a filtered group of donors. Each donor receives their own email with {'{name}'} replaced.
          </div>
        )}
      </div>

      {/* ============ MAIN LAYOUT ============ */}
      <div className={styles.mainLayout}>

        {/* ============ FORM COLUMN ============ */}
        <div className={styles.formColumn}>

          {/* ---- Template Selector (individual mode only) ---- */}
          {emailMode === 'individual' && (
            <div className={styles.formSection}>
              <label className={styles.fieldLabel}>📋 Email Template</label>
              {loadingTemplates ? (
                <div className={styles.loadingText}>Loading templates...</div>
              ) : (
                <select
                  className={styles.selectField}
                  value={selectedTemplate?.templateType || ''}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  {templates.map((t) => (
                    <option key={t.templateType} value={t.templateType}>
                      {t.displayName}
                      {t.isCustom ? ' (Free-form)' : ''}
                    </option>
                  ))}
                </select>
              )}
              {selectedTemplate && !isCustom && (
                <div className={styles.templateHint}>
                  Subject: {selectedTemplate.subject}
                </div>
              )}
            </div>
          )}

          {/* ============ GROUP FILTER PANEL (group mode) ============ */}
          {emailMode === 'group' && (
            <div className={styles.formSection}>
              <div className={styles.filterHeader}>
                <label className={styles.fieldLabel}>🎯 Filter Recipients</label>
                {activeFilterCount > 0 && (
                  <button className={styles.resetFiltersBtn} onClick={handleResetFilters}>
                    ✕ Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* ---- Fund Type ---- */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Fund Type</label>
                <div className={styles.chipRow}>
                  {FUND_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.filterChip} ${
                        groupFilters.fund_types.includes(opt.value) ? styles.filterChipActive : ''
                      }`}
                      onClick={() => handleToggleFilterArray('fund_types', opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>


              {/* ---- Frequency ---- */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Frequency</label>
                <div className={styles.chipRow}>
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.filterChip} ${
                        groupFilters.frequencies.includes(opt.value) ? styles.filterChipActive : ''
                      }`}
                      onClick={() => handleToggleFilterArray('frequencies', opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ---- Donor Type ---- */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Donor Type</label>
                <select
                  className={styles.selectField}
                  value={groupFilters.donor_type}
                  onChange={(e) => setGroupFilters((prev) => ({ ...prev, donor_type: e.target.value }))}
                >
                  {DONOR_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* ---- Flags Row ---- */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Flags</label>
                <div className={styles.chipRow}>
                  <button
                    className={`${styles.filterChip} ${
                      groupFilters.newsletter_only ? styles.filterChipActive : ''
                    }`}
                    onClick={() =>
                      setGroupFilters((prev) => ({ ...prev, newsletter_only: !prev.newsletter_only }))
                    }
                  >
                    📰 Newsletter Only
                  </button>
                  <button
                    className={`${styles.filterChip} ${
                      groupFilters.volunteer_only ? styles.filterChipActive : ''
                    }`}
                    onClick={() =>
                      setGroupFilters((prev) => ({ ...prev, volunteer_only: !prev.volunteer_only }))
                    }
                  >
                    🤝 Volunteers Only
                  </button>
                </div>
              </div>

              {/* ---- Date Range ---- */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Donated Within</label>
                <select
                  className={styles.selectField}
                  value={groupFilters.donated_within_days}
                  onChange={(e) =>
                    setGroupFilters((prev) => ({
                      ...prev,
                      donated_within_days: parseInt(e.target.value, 10),
                    }))
                  }
                >
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* ---- Match Count Badge ---- */}
              <div className={styles.matchBadgeRow}>
                {loadingGroupCount ? (
                  <div className={styles.matchBadge}>
                    <span className={styles.matchSpinner}>⏳</span> Counting...
                  </div>
                ) : groupCount !== null ? (
                  <div
                    className={`${styles.matchBadge} ${
                      groupCount > 0 ? styles.matchBadgeGreen : styles.matchBadgeRed
                    }`}
                  >
                    <span className={styles.matchCount}>{groupCount}</span>
                    <span>donor{groupCount !== 1 ? 's' : ''} match</span>
                  </div>
                ) : null}

                {groupCount > 0 && (
                  <button
                    className={styles.previewListBtn}
                    onClick={() => setShowGroupPreview(!showGroupPreview)}
                  >
                    {showGroupPreview ? '▲ Hide List' : '▼ Preview List'}
                  </button>
                )}
              </div>

              {/* ---- Donor Preview List (expandable) ---- */}
              {showGroupPreview && groupDonors.length > 0 && (
                <div className={styles.donorPreviewList}>
                  {groupDonors.map((d, i) => (
                    <div key={d.cft_no || i} className={styles.donorPreviewItem}>
                      <span className={styles.donorPreviewName}>
                        {d.name}
                      </span>
                      <span className={styles.donorPreviewEmail}>
                        {d.email}
                      </span>
                      <div className={styles.donorPreviewTags}>
                        {d.volunteer && <span className={styles.tagVolunteer}>Vol</span>}
                        {d.newsletter && <span className={styles.tagNewsletter}>News</span>}
                        {d.last_donated && (
                          <span className={styles.tagDonated}>
                            Last: {new Date(d.last_donated).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {groupCount > groupDonors.length && (
                    <div className={styles.donorPreviewMore}>
                      + {groupCount - groupDonors.length} more donors
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ---- Recipient (individual mode only) ---- */}
          {emailMode === 'individual' && (
            <div className={styles.formSection}>
              <label className={styles.fieldLabel}>👤 Recipient</label>

              {/* Donor search */}
              <div className={styles.donorSearchWrapper} ref={donorSearchRef}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Search donor by name, email, CFT number..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  onFocus={() => donorResults.length > 0 && setShowDonorDropdown(true)}
                />
                {searchingDonors && (
                  <span className={styles.searchSpinner}>🔍</span>
                )}

                {/* Donor dropdown */}
                {showDonorDropdown && (
                  <div className={styles.donorDropdown}>
                    {donorResults.map((d) => (
                      <button
                        key={d.cftNo || d.email}
                        className={styles.donorOption}
                        onClick={() => handleSelectDonor(d)}
                      >
                        <span className={styles.donorName}>{d.name}</span>
                        <span className={styles.donorMeta}>
                          {d.cftNo && `CFT-${d.cftNo}`} · {d.email}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Manual email input */}
              <input
                type="email"
                className={styles.inputField}
                placeholder="Recipient email address"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />

              {/* Name + CFT row */}
              <div className={styles.fieldRow}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Recipient name (optional)"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
                <input
                  type="text"
                  className={styles.inputFieldSmall}
                  placeholder="CFT No."
                  value={cftNo}
                  onChange={(e) => setCftNo(e.target.value)}
                />
              </div>

              {/* Selected donor badge */}
              {recipientEmail && recipientName && (
                <div className={styles.selectedDonor}>
                  <span>✅ {recipientName}</span>
                  <span className={styles.selectedDonorEmail}>{recipientEmail}</span>
                  {cftNo && <span className={styles.selectedDonorCft}>CFT-{cftNo}</span>}
                  <button
                    className={styles.clearDonorBtn}
                    onClick={() => {
                      setRecipientEmail('');
                      setRecipientName('');
                      setCftNo('');
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---- Custom Email Fields (with Rich Text) ---- */}
          {(isCustom || emailMode === 'group') && (
            <>
              <div className={styles.formSection}>
                <label className={styles.fieldLabel}>
                  📝 Subject
                  {emailMode === 'group' && (
                    <span className={styles.mergeTagHint}> — use {'{name}'} for personalisation</span>
                  )}
                </label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder={
                    emailMode === 'group'
                      ? 'e.g. Assalamu Alaikum {name} — Important Update'
                      : 'Email subject line'
                  }
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className={styles.formSection}>
                <div className={styles.messageHeader}>
                  <label className={styles.fieldLabel}>
                    📄 Message
                    {emailMode === 'group' && (
                      <span className={styles.mergeTagHint}> — {'{name}'} = donor&apos;s name</span>
                    )}
                  </label>
                  {/* Emoji picker toggle */}
                  <div className={styles.emojiWrapper} ref={emojiRef}>
                    <button
                      type="button"
                      className={styles.emojiToggleBtn}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      title="Insert emoji"
                    >
                      😊
                    </button>
                    {showEmojiPicker && (
                      <div className={styles.emojiDropdown}>
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className={styles.emojiItem}
                            onClick={() => handleInsertEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className={styles.editorWrapper}>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={body}
                    onChange={setBody}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={
                      emailMode === 'group'
                        ? 'Dear {name}, we hope this message finds you well...'
                        : 'Write your email message here... Use the toolbar for formatting.'
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* ---- Template Fields (dynamic, individual only) ---- */}
          {emailMode === 'individual' && !isCustom && selectedTemplate && (
            <div className={styles.formSection}>
              <label className={styles.fieldLabel}>📝 Template Fields</label>
              <div className={styles.templateFieldsGrid}>
                {selectedTemplate.requiredFields.map((field) => (
                  <div key={field} className={styles.templateFieldItem}>
                    <label className={styles.templateFieldLabel}>
                      {formatFieldLabel(field)} <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                      value={templateFields[field] || ''}
                      onChange={(e) =>
                        setTemplateFields((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                    />
                  </div>
                ))}
                {selectedTemplate.optionalFields.map((field) => (
                  <div key={field} className={styles.templateFieldItem}>
                    <label className={styles.templateFieldLabel}>
                      {formatFieldLabel(field)}
                    </label>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder={`${formatFieldLabel(field)} (optional)`}
                      value={templateFields[field] || ''}
                      onChange={(e) =>
                        setTemplateFields((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- Action Buttons ---- */}
          <div className={styles.actionButtons}>
            {emailMode === 'individual' ? (
              <>
                <button
                  className={styles.previewBtn}
                  onClick={handlePreview}
                  disabled={!canPreview || loadingPreview}
                >
                  {loadingPreview ? '⏳ Rendering...' : '👁 Preview'}
                </button>
                <button
                  className={styles.sendBtn}
                  onClick={handleSend}
                  disabled={!canSend || sending}
                >
                  {sending ? '⏳ Sending...' : '📤 Send Email'}
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.previewBtn}
                  onClick={handlePreview}
                  disabled={!subject || !hasBodyContent || loadingPreview}
                >
                  {loadingPreview ? '⏳ Rendering...' : '👁 Preview'}
                </button>
                <button
                  className={styles.sendGroupBtn}
                  onClick={handleGroupSend}
                  disabled={!canGroupSend || sendingGroup}
                >
                  {sendingGroup
                    ? '⏳ Sending...'
                    : `📤 Send to ${groupCount || 0} Donor${groupCount !== 1 ? 's' : ''}`}
                </button>
              </>
            )}
          </div>

          {/* ---- Send Result (Individual) ---- */}
          {emailMode === 'individual' && sendResult && (
            <div
              className={`${styles.resultBanner} ${
                sendResult.success ? styles.resultSuccess : styles.resultError
              }`}
            >
              {sendResult.success ? (
                <>
                  <span>✅ {sendResult.message}</span>
                  <span className={styles.resultSubtext}>Redirecting to Email Centre...</span>
                </>
              ) : (
                <span>❌ {sendResult.error || 'Failed to send email'}</span>
              )}
            </div>
          )}

          {/* ---- Send Result (Group) ---- */}
          {emailMode === 'group' && groupSendResult && (
            <div
              className={`${styles.resultBanner} ${
                groupSendResult.success ? styles.resultSuccess : styles.resultError
              }`}
            >
              {groupSendResult.success ? (
                <>
                  <span>
                    ✅ Group email sent — {groupSendResult.sent} delivered
                    {groupSendResult.failed > 0 && `, ${groupSendResult.failed} failed`}
                  </span>
                  <span className={styles.resultSubtext}>Redirecting to Email Centre...</span>
                </>
              ) : (
                <span>❌ {groupSendResult.error || 'Failed to send group email'}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ PREVIEW SLIDE-IN PANEL ============ */}
      {/* Backdrop — click to close */}
      <div
        className={`${styles.previewBackdrop} ${showPreview ? styles.previewBackdropVisible : ''}`}
        onClick={() => setShowPreview(false)}
      />

      {/* Panel — slides in from right */}
      <div className={`${styles.previewColumn} ${showPreview ? styles.previewVisible : ''}`}>
        <div className={styles.previewHeader}>
          <span className={styles.previewTitle}>📧 Email Preview</span>
          <button
            className={styles.previewCloseBtn}
            onClick={() => setShowPreview(false)}
          >
            ✕
          </button>
        </div>
        <div className={styles.previewFrame}>
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              title="Email Preview"
              className={styles.previewIframe}
              sandbox="allow-same-origin"
            />
          ) : (
            <div className={styles.previewPlaceholder}>
              <div className={styles.previewPlaceholderIcon}>⏳</div>
              <div className={styles.previewPlaceholderText}>Rendering preview...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}