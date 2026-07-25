// ===================================================================
// 👥 Donor Service - Donor Bank API Methods
// ===================================================================
// Location: src/services/donorService.js
// Updated: January 2026 - Added searchType for field-specific search
// ===================================================================

import { get, post, put } from './api';
import logger from '@/utils/logger';
/**
 * ============================================
 * DONOR STATS API
 * ============================================
 * GET /api/admin/donors/stats/
 * Returns category counts for dashboard tabs
 */
export async function getDonorStats() {
  try {
    const data = await get('/admin/donors/stats/');
    return {
      success: true,
      data: {
        total: data.total || 0,
        dd: data.dd || 0,
        premium: data.premium || 0,
        regular: data.regular || 0,
        lapsed: data.lapsed || 0,
        nonDonor: data.non_donor || 0,
      }
    };
  } catch (error) {
    logger.error('getDonorStats failed', error.message);
    return {
      success: false,
      error: error.message,
      data: { total: 0, dd: 0, premium: 0, regular: 0, lapsed: 0, nonDonor: 0 }
    };
  }
}

/**
 * ============================================
 * DONOR LIST API
 * ============================================
 * GET /api/admin/donors/
 * Returns paginated list of donors with search/filter/sort
 * 
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.page_size - Items per page (default: 10, max: 100)
 * @param {string} params.search - Search term
 * @param {string} params.searchType - Type of search: 'cft', 'name', 'contact', 'postcode', 'phone' (NEW)
 * @param {string} params.category - Filter by category (dd, premium, regular, lapsed, non_donor)
 * @param {string} params.sort_by - Sort field (name, cft_no, total_given, last_donation, email)
 * @param {string} params.sort_order - Sort direction (asc, desc)
 */
export async function getDonorList(params = {}) {
  try {
    // Build query params
    const queryParams = {
      page: params.page || 1,
      page_size: params.pageSize || 10,
    };
    
    // Add optional params if provided
    if (params.search) queryParams.search = params.search;
    
    // ============================================================
    // NEW: Pass searchType to API as search_type
    // ============================================================
    if (params.searchType) queryParams.search_type = params.searchType;
    
    if (params.category && params.category !== 'all') queryParams.category = params.category;
    if (params.sortBy) queryParams.sort_by = params.sortBy;
    if (params.sortOrder) queryParams.sort_order = params.sortOrder;
    
    const data = await get('/admin/donors/', queryParams);
    
    // Transform the response to match frontend expectations
    const donors = (data.results || []).map(donor => ({
      id: donor.id,
      cftNo: donor.cft_no,
      name: donor.name,
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email,
      mobile: donor.mobile,
      postcode: donor.postcode,
      category: mapCategoryDisplay(donor.category),
      categoryKey: donor.category,
      categoryColor: getCategoryColor(donor.category),
      totalGiven: formatCurrency(donor.total_given),
      totalGivenRaw: donor.total_given,
      donationCount: donor.donation_count,
      lastDonation: formatDate(donor.last_donation),
      lastDonationRaw: donor.last_donation,
      status: donor.status || 'active',
      volunteer: donor.volunteer,
      getUpdates: donor.get_updates,
    }));
    
    return {
      success: true,
      data: {
        donors,
        pagination: {
          total: data.count || 0,
          page: data.page || 1,
          pageSize: data.page_size || 10,
          totalPages: data.total_pages || 1,
        }
      }
    };
  } catch (error) {
    logger.error('getDonorList failed', error.message);
    return {
      success: false,
      error: error.message,
      data: {
        donors: [],
        pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 }
      }
    };
  }
}

/**
 * ============================================
 * DONOR DETAIL API
 * ============================================
 * GET /api/admin/donors/{cft_no}/
 * Returns single donor with full details and donation history
 * 
 * @param {string} cftNo - Donor's CFT number
 */
export async function getDonorDetail(cftNo) {
  try {
    const data = await get(`/admin/donors/${cftNo}/`);
    
    // Transform donor data
    const donor = {
      id: data.donor.id,
      cftNo: data.donor.cft_no,
      stripeCustomerId: data.donor.stripe_customer_id,
      title: data.donor.title,
      firstName: data.donor.first_name,
      lastName: data.donor.last_name,
      name: data.donor.name,
      orgName: data.donor.org_name,
      email: data.donor.email,
      mobile: data.donor.mobile,
      address: {
        firstLine: data.donor.address?.first_line || '',
        street: data.donor.address?.street || '',
        city: data.donor.address?.city || '',
        county: data.donor.address?.county || '',
        postcode: data.donor.address?.postcode || '',
      },
      volunteer: data.donor.volunteer,
      getUpdates: data.donor.get_updates,
      source: data.donor.source,
      referralMessage: data.donor.referral_message,
      createdAt: data.donor.created_at,
      updatedAt: data.donor.updated_at,
    };
    
    // Transform summary data
    const summary = {
      category: mapCategoryDisplay(data.summary.category),
      categoryKey: data.summary.category,
      categoryColor: getCategoryColor(data.summary.category),
      totalGiven: formatCurrency(data.summary.total_given),
      totalGivenRaw: data.summary.total_given,
      annualTotal: formatCurrency(data.summary.annual_total),
      annualTotalRaw: data.summary.annual_total,
      donationCount: data.summary.donation_count,
      lastDonation: formatDate(data.summary.last_donation),
      lastDonationRaw: data.summary.last_donation,
      activeSubscriptions: data.summary.active_subscriptions,
    };
    
    // Transform donations
    const donations = (data.donations || []).map(donation => ({
      id: donation.id,
      amount: formatCurrency(donation.amount),
      amountRaw: donation.amount,
      netAmount: formatCurrency(donation.net_amount),
      netAmountRaw: donation.net_amount,
      currency: donation.currency,
      type: donation.type,
      typeDisplay: capitalizeFirst(donation.type),
      frequency: donation.frequency,
      status: donation.status,
      statusColor: getStatusColor(donation.status),
      billingReason: donation.billing_reason,
      paymentMode: donation.payment_mode,
      giftAid: donation.gift_aid,
      date: formatDate(donation.date),
      dateRaw: donation.date,
      invoiceUrl: donation.invoice_url,
    }));
    
    return {
      success: true,
      data: {
        donor,
        summary,
        donations,
      }
    };
  } catch (error) {
    logger.error('getDonorDetail failed', error.message);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Map category key to display label
 */
function mapCategoryDisplay(category) {
  const categoryMap = {
    'DD': 'DD',
    'Premium': 'Premium',
    'Regular': 'Regular',
    'Lapsed': 'Lapsed',
    'Non-Donor': 'Non-Donor',
    'non_donor': 'Non-Donor',
  };
  return categoryMap[category] || category;
}

/**
 * Get category color
 */
function getCategoryColor(category) {
  const colorMap = {
    'DD': '#3b82f6',        // Blue
    'Premium': '#22c55e',   // Green
    'Regular': '#f97316',   // Orange
    'Lapsed': '#6b7280',    // Gray
    'Non-Donor': '#9ca3af', // Light Gray
    'non_donor': '#9ca3af',
    'Cancelled': '#ef4444', // Red
  };
  return colorMap[category] || '#6b7280';
}

/**
 * Get status color
 */
function getStatusColor(status) {
  const colorMap = {
    'succeeded': '#22c55e',  // Green
    'pending': '#f59e0b',    // Yellow
    'failed': '#ef4444',     // Red
    'cancelled': '#6b7280',  // Gray
  };
  return colorMap[status] || '#6b7280';
}

/**
 * Format currency (GBP)
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '£0.00';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

/**
 * Format date (DD/MM/YYYY)
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ===================================================================
// EXPORTS
// ===================================================================

export default {
  getDonorStats,
  getDonorList,
  getDonorDetail,
};
