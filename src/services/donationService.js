// ===================================================================
// 📖 Donation Service - Donation Book API Methods
// ===================================================================
// Location: src/services/donationService.js
// Created: January 2026
// ===================================================================

import { get } from './api';
import logger from '@/utils/logger';

/**
 * ============================================
 * DONATION STATS API
 * ============================================
 * GET /api/admin/donations/stats/
 * Returns KPI stats for dashboard cards
 * 
 * @param {object} params - Optional date filters
 * @param {string} params.startDate - Start date (YYYY-MM-DD)
 * @param {string} params.endDate - End date (YYYY-MM-DD)
 */
export async function getDonationStats(params = {}) {
  try {
    const queryParams = {};
    
    if (params.startDate) queryParams.start_date = params.startDate;
    if (params.endDate) queryParams.end_date = params.endDate;
    
    const data = await get('/admin/donations/stats/', queryParams);
    
    return {
      success: true,
      data: {
        totalThisYear: data.total_this_year || 0,
        totalTransactions: data.total_transactions || 0,
        giftAidClaimable: data.gift_aid_claimable || 0,
        thisMonth: data.this_month || 0,
        filteredTotal: data.filtered_total,
        filteredCount: data.filtered_count,
      }
    };
  } catch (error) {
    logger.error('getDonationStats failed', error.message);
    return {
      success: false,
      error: error.message,
      data: {
        totalThisYear: 0,
        totalTransactions: 0,
        giftAidClaimable: 0,
        thisMonth: 0,
      }
    };
  }
}

/**
 * ============================================
 * DONATION LIST API
 * ============================================
 * GET /api/admin/donations/
 * Returns paginated list of donations with filters
 * 
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 25)
 * @param {string} params.startDate - Filter start date (YYYY-MM-DD)
 * @param {string} params.endDate - Filter end date (YYYY-MM-DD)
 * @param {string} params.frequency - Filter by frequency (one_off, recurring)
 * @param {string} params.search - Search term
 * @param {string} params.searchType - Type of search (cft, name, contact)
 * @param {string} params.sortBy - Sort field (date, amount, donor)
 * @param {string} params.sortOrder - Sort direction (asc, desc)
 */
export async function getDonationList(params = {}) {
  try {
    // Build query params
    const queryParams = {
      page: params.page || 1,
      page_size: params.pageSize || 25,
    };
    
    // Add optional params if provided
    if (params.startDate) queryParams.start_date = params.startDate;
    if (params.endDate) queryParams.end_date = params.endDate;
    if (params.frequency) queryParams.frequency = params.frequency;
    if (params.search) queryParams.search = params.search;
    if (params.searchType) queryParams.search_type = params.searchType;
    if (params.sortBy) queryParams.sort_by = params.sortBy;
    if (params.sortOrder) queryParams.sort_order = params.sortOrder;
    
    const data = await get('/admin/donations/', queryParams);
    
    // Transform the response to match frontend expectations
    const donations = (data.results || []).map(donation => ({
      id: donation.id,
      date: donation.date,
      dateRaw: donation.date_raw,
      time: donation.time,
      
      // Donor info
      donor: donation.donor,
      donorCft: donation.donor_cft,
      donorLink: donation.donor_link,
      
      // Type (Islamic fund classification)
      type: donation.type,
      typeColor: donation.type_color,
      
      // Cause/Fund
      // [TD-101] cause/causeKey/causeColor mapping removed (backend still sends them — dead weight, dies with TD-099)

      
      // Frequency
      frequency: donation.frequency,
      frequencyKey: donation.frequency_key,
      frequencyColor: donation.frequency_color,
      
      // Gift Aid
      giftAid: donation.gift_aid,
      
      // Amount
      amount: donation.amount,
      amountFormatted: donation.amount_formatted,
      amountColor: donation.amount_color,
      netAmount: donation.net_amount,
      currency: donation.currency,
      
      // Payment info
      paymentMode: donation.payment_mode,
      status: donation.status,
      
      // Stripe references
      stripePaymentId: donation.stripe_payment_id,
      stripeSubscriptionId: donation.stripe_subscription_id,
      invoiceUrl: donation.invoice_url,
      
      // Receipt
      receiptGenerated: donation.receipt_generated,
    }));
    
    return {
      success: true,
      data: {
        donations,
        pagination: {
          total: data.count || 0,
          page: data.page || 1,
          pageSize: data.page_size || 25,
          totalPages: data.total_pages || 1,
        }
      }
    };
  } catch (error) {
    logger.error('getDonationList failed', error.message);
    return {
      success: false,
      error: error.message,
      data: {
        donations: [],
        pagination: { total: 0, page: 1, pageSize: 25, totalPages: 1 }
      }
    };
  }
}

/**
 * ============================================
 * DONATION FILTERS API
 * ============================================
 * GET /api/admin/donations/filters/
 * Returns distinct values for filter dropdowns
 */
export async function getDonationFilters() {
  try {
    const data = await get('/admin/donations/filters/');
    
    return {
      success: true,
      data: {
        paymentModes: data.payment_modes || [],
      }
    };
  } catch (error) {
    logger.error('getDonationFilters failed', error.message);
    return {
      success: false,
      error: error.message,
      data: {
        paymentModes: [],
      }
    };
  }
}

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Format currency (GBP)
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '£0.00';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-GB').format(num);
}

// ===================================================================
// EXPORTS
// ===================================================================

export default {
  getDonationStats,
  getDonationList,
  getDonationFilters,
  formatCurrency,
  formatNumber,
};