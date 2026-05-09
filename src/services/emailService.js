// ===================================================================
// 📧 Email Service - Email Centre API Methods
// ===================================================================
// Location: src/services/emailService.js
// Created: February 2026 - Phase 1 Email Centre
// Updated: February 2026 - Phase 2 Compose & Send (Step 2.4)
// Updated: 2026-05-04 - Production-readiness pass:
//   - All console.error -> logger.error with sanitised error.message
//   - getGroupRecipients & sendGroupEmail migrated from raw fetch()
//     to api.js post() helper for cross-origin compatibility, auth
//     header attachment, and 401 auto-refresh
//   - Normalised function declaration style across the file
// Purpose: Service layer for all Email Centre API calls.
//          Follows the same pattern as donorService.js
//
// Phase 1: getEmailStats, getEmails, getEmailDetail, resendEmail
// Phase 2: getTemplates, previewEmail, sendComposedEmail, searchDonors,
//          getGroupRecipients, sendGroupEmail
// ===================================================================

import { get, post } from './api';
import logger from '@/utils/logger';

/**
 * ============================================
 * EMAIL STATS API
 * ============================================
 * GET /api/admin/emails/stats/
 * Returns analytics card data + category tab counts
 */
export async function getEmailStats() {
  try {
    const response = await get('/admin/emails/stats/');
    const data = response.data || response;
    return {
      success: true,
      data: {
        sentThisMonth: data.sent_this_month || 0,
        sentLastMonth: data.sent_last_month || 0,
        monthChangePercent: data.month_change_percent || 0,
        totalSent: data.total_sent || 0,
        totalFailed: data.total_failed || 0,
        totalScheduled: data.total_scheduled || 0,
        // Tab counts
        countAll: data.count_all || 0,
        countReceipt: data.count_receipt || 0,
        countNewsletter: data.count_newsletter || 0,
        countCampaign: data.count_campaign || 0,
        countReminder: data.count_reminder || 0,
        countNotification: data.count_notification || 0,
        countVolunteer: data.count_volunteer || 0,
      },
    };
  } catch (error) {
    logger.error('getEmailStats failed', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ============================================
 * EMAIL LIST API
 * ============================================
 * GET /api/admin/emails/
 * Returns paginated, filterable email log list
 */
export async function getEmails({
  page = 1,
  pageSize = 20,
  search = '',
  category = '',
  status = '',
  dateFrom = '',
  dateTo = '',
} = {}) {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('page_size', pageSize);
    if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);
    if (status && status !== 'all') params.append('status', status);
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);

    const data = await get(`/admin/emails/?${params.toString()}`);
    return {
      success: true,
      data: (data.data || []).map(formatEmailRow),
      pagination: {
        page: data.pagination?.page || 1,
        pageSize: data.pagination?.page_size || 20,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 1,
      },
    };
  } catch (error) {
    logger.error('getEmails failed', error.message);
    return { success: false, error: error.message, data: [], pagination: {} };
  }
}

/**
 * ============================================
 * EMAIL DETAIL API
 * ============================================
 * GET /api/admin/emails/<id>/
 * Returns full detail of a single email log
 */
export async function getEmailDetail(emailId) {
  try {
    const data = await get(`/admin/emails/${emailId}/`);
    return {
      success: true,
      data: formatEmailRow(data.data || data),
    };
  } catch (error) {
    logger.error('getEmailDetail failed', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ============================================
 * RESEND EMAIL API
 * ============================================
 * POST /api/admin/emails/<id>/resend/
 * Resends a failed or previously sent email
 */
export async function resendEmail(emailId) {
  try {
    const data = await post(`/admin/emails/${emailId}/resend/`);
    return {
      success: true,
      message: data.message || 'Email resent successfully',
    };
  } catch (error) {
    logger.error('resendEmail failed', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ============================================
 * TEMPLATES LIST API (Phase 2, Step 2.1)
 * ============================================
 * GET /api/admin/emails/templates/
 * Returns all available email templates for the compose form.
 * Used by TemplateSelector dropdown component.
 */
export async function getTemplates() {
  try {
    const data = await get('/admin/emails/templates/');
    return {
      success: true,
      data: (data.data || []).map((t) => ({
        templateType: t.template_type,
        displayName: t.display_name,
        subject: t.subject,
        requiredFields: t.required_fields || [],
        optionalFields: t.optional_fields || [],
        category: t.category,
        templatePath: t.template_path,
        isCustom: t.template_type === 'custom',
      })),
      count: data.count || 0,
    };
  } catch (error) {
    logger.error('getTemplates failed', error.message);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * ============================================
 * PREVIEW EMAIL API (Phase 2, Step 2.4)
 * ============================================
 * POST /api/admin/emails/preview/
 * Renders a template with context data and returns HTML.
 * Does NOT send the email — preview only.
 */
export async function previewEmail(templateType, contextData = {}) {
  try {
    const data = await post('/admin/emails/preview/', {
      template_type: templateType,
      context_data: contextData,
    });
    return {
      success: true,
      html: data.html || '',
      subject: data.subject || '',
      templateType: data.template_type || templateType,
    };
  } catch (error) {
    logger.error('previewEmail failed', error.message);
    return { success: false, error: error.message, html: '' };
  }
}

/**
 * ============================================
 * SEND COMPOSED EMAIL API (Phase 2, Step 2.4)
 * ============================================
 * POST /api/admin/emails/send/
 * Sends a composed email from the Admin Portal.
 * Supports both template-based and custom emails.
 */
export async function sendComposedEmail({
  templateType,
  recipientEmail,
  recipientName = '',
  cftNo = '',
  contextData = {},
}) {
  try {
    const data = await post('/admin/emails/send/', {
      template_type: templateType,
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      cft_no: cftNo,
      context_data: contextData,
    });

    // Backend may return success: false even on HTTP 200
    if (data.success === false) {
      return {
        success: false,
        error: data.error || 'Failed to send email',
      };
    }

    return {
      success: true,
      message: data.message || 'Email sent successfully',
      emailId: data.email_id || null,
    };
  } catch (error) {
    logger.error('sendComposedEmail failed', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ============================================
 * SEARCH DONORS (Phase 2, Step 2.4)
 * ============================================
 * Reuses GET /api/admin/donors/ with small page size.
 * Used by RecipientSearch component in the compose form.
 */
export async function searchDonors(query, limit = 5) {
  try {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const data = await get('/admin/donors/', {
      search: query,
      page_size: limit,
      page: 1,
    });

    const donors = (data.results || []).map((d) => ({
      cftNo: d.cft_no || '',
      name: d.name || `${d.first_name || ''} ${d.last_name || ''}`.trim(),
      firstName: d.first_name || '',
      lastName: d.last_name || '',
      email: d.email || '',
      mobile: d.mobile || '',
      postcode: d.postcode || '',
    }));

    return { success: true, data: donors };
  } catch (error) {
    logger.error('searchDonors failed', error.message);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * ============================================
 * GROUP RECIPIENTS COUNT (Phase 2, group-send)
 * ============================================
 * POST /api/admin/emails/group-count/
 * Returns count + preview list of donors matching group filters.
 * Called when admin changes filters on compose page → updates
 * "47 donors match" badge.
 *
 * @param {Object} filters - Group filter object
 * @returns {Promise<{success: boolean, count: number, donors: Array}>}
 */
export async function getGroupRecipients(filters) {
  try {
    const data = await post('/admin/emails/group-count/', { filters });
    return data;
  } catch (error) {
    logger.error('getGroupRecipients failed', error.message);
    throw error;
  }
}

/**
 * ============================================
 * SEND GROUP EMAIL (Phase 2, group-send)
 * ============================================
 * POST /api/admin/emails/send-group/
 * Sends an email to all donors matching group filters.
 * Each donor gets a personalised email with {name} replaced.
 *
 * @returns {Promise<{success, total, sent, failed, results}>}
 */
export async function sendGroupEmail(templateType, filters, contextData) {
  try {
    const data = await post('/admin/emails/send-group/', {
      template_type: templateType,
      filters,
      context_data: contextData,
    });
    return data;
  } catch (error) {
    logger.error('sendGroupEmail failed', error.message);
    throw error;
  }
}


// ===================================================================
// HELPERS — Format backend response → frontend-friendly shape
// ===================================================================

/**
 * Maps a backend email log record to the shape the Email Centre
 * table expects. This keeps all formatting logic in one place.
 */
function formatEmailRow(email) {
  // Category → visual config
  const categoryConfig = {
    receipt:      { label: 'Receipt',      icon: '🧾', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    newsletter:   { label: 'Newsletter',   icon: '📰', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
    campaign:     { label: 'Campaign',     icon: '📢', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    reminder:     { label: 'Reminder',     icon: '⏰', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    notification: { label: 'Notification', icon: '🔔', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
    volunteer:    { label: 'Volunteer',    icon: '🤝', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
    other:        { label: 'Other',        icon: '📧', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  };

  // Status → visual config
  const statusConfig = {
    sent:      { label: 'Sent',      icon: '✓', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
    failed:    { label: 'Failed',    icon: '✗', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    scheduled: { label: 'Scheduled', icon: '📅', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
    draft:     { label: 'Draft',     icon: '📝', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  };

  const cat = categoryConfig[email.category] || categoryConfig.other;
  const stat = statusConfig[email.status] || statusConfig.sent;

  return {
    id: email.id,
    // Type/category display
    type: cat.label,
    typeColor: cat.color,
    typeBg: cat.bg,
    typeIcon: cat.icon,
    category: email.category,
    // Content
    subject: email.subject || '(No subject)',
    recipients: email.recipient_name || email.recipient_email,
    recipientEmail: email.recipient_email,
    recipientName: email.recipient_name,
    templateType: email.template_type,
    // Status display
    status: stat.label,
    statusColor: stat.color,
    statusBg: stat.bg,
    statusIcon: stat.icon,
    rawStatus: email.status,
    // Flags
    isFailed: email.status === 'failed',
    isScheduled: email.status === 'scheduled',
    // Dates
    sent: formatDate(email.sent_at || email.created_at),
    sentRaw: email.sent_at || email.created_at,
    createdAt: email.created_at,
    // References
    cftNo: email.cft_no,
    stripeReference: email.stripe_reference,
    triggerSource: email.trigger_source_display || email.trigger_source,
    errorMessage: email.error_message,
  };
}

/**
 * Format ISO date string → "DD/MM/YYYY" or "Today @ HH:MM"
 */
function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    // If today, show time too
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `Today @ ${hh}:${min}`;
    }
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return '—';
  }
}