// ===================================================================
// 👤 Donor Profile Service - Donor Profile API Methods
// ===================================================================
// Location: src/services/donorProfileService.js
// Created: January 2026
// Updated: Backend now returns camelCase - NO transformation needed!
// ===================================================================

import { get, post, put, del } from './api';
import logger from '@/utils/logger';
/**
 * ============================================
 * GET DONOR PROFILE
 * ============================================
 * GET /api/admin/donors/{cftNo}/
 * 
 * Backend returns camelCase directly:
 * {
 *   cftNo, firstName, lastName, fullName, email, mobile,
 *   address: { houseNo, street, city, county, postCode },
 *   consentGiftAid
 *   status, isDirectDebitor, isPremium, ddAmount, ddFrequency,
 *   totalDonated, donationCount, giftAidTotal,
 *   memberSince, lastDonation, ...
 * }
 */
export async function getDonorProfile(cftNo) {
  try {
    const data = await get(`/admin/donors/${cftNo}/`);
    
    // Backend already returns camelCase format - pass through directly!
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    logger.error('getDonorProfile failed', error.message);
    return {
      success: false,
      error: error.message || 'Failed to load donor profile',
      data: null,
    };
  }
}

/**
 * ============================================
 * GET DONOR DONATIONS HISTORY
 * ============================================
 * GET /api/admin/donors/{cftNo}/donations/
 * 
 * Backend returns:
 * {
 *   donor: { cftNo, fullName },
 *   summary: { totalDonated, donationCount, giftAid, ... },
 *   donations: [...],
 *   pagination: { page, pageSize, totalCount, totalPages }
 * }
 */
export async function getDonorDonations(cftNo, params = {}) {
  try {
    const queryParams = {};
    
    // Map frontend params to backend query params
    // Handle both camelCase and snake_case for backward compatibility
    if (params.page) queryParams.page = params.page;
    if (params.pageSize || params.page_size) queryParams.page_size = params.pageSize || params.page_size;
    if (params.fund && params.fund !== 'all') queryParams.fund = params.fund;
    if (params.type && params.type !== 'all') queryParams.type = params.type;
    if (params.route && params.route !== 'all') queryParams.route = params.route;
    if (params.startDate || params.start_date) queryParams.start_date = params.startDate || params.start_date;
    if (params.endDate || params.end_date) queryParams.end_date = params.endDate || params.end_date;
    
    const data = await get(`/admin/donors/${cftNo}/donations/`, queryParams);
    
    // Backend already returns camelCase format - pass through directly!
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    logger.error('getDonorDonations failed', error.message);
    return {
      success: false,
      error: error.message || 'Failed to load donation history',
      data: {
        donor: null,
        summary: null,
        donations: [],
        pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 1 },
      },
    };
  }
}

/**
 * ============================================
 * CREATE DONOR
 * ============================================
 * POST /api/admin/donors/create/
 * 
 * Backend expects camelCase:
 * { firstName, lastName, email, mobile, firstLine, street, city, county, postCode, ... }
 */
export async function createDonor(donorData) {
  try {
    // Send camelCase - backend expects camelCase!
    const apiData = {
      title: donorData.title || '',
      firstName: donorData.firstName || '',
      lastName: donorData.lastName || '',
      email: donorData.email || '',
      mobile: donorData.mobile || '',
      firstLine: donorData.firstLine || donorData.houseNo || '',
      street: donorData.street || '',
      city: donorData.city || '',
      county: donorData.county || '',
      postCode: donorData.postCode || '',
      getUpdates: donorData.getUpdates || false,
      volunteer: donorData.volunteer || false,
    };
    
    const data = await post('/admin/donors/create/', apiData);
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    logger.error('createDonor failed', error.message);
    return {
      success: false,
      error: error.message || 'Failed to create donor',
      data: null,
    };
  }
}

/**
 * ============================================
 * UPDATE DONOR
 * ============================================
 * PUT /api/admin/donors/{cftNo}/
 * 
 * Backend expects camelCase
 */
export async function updateDonor(cftNo, donorData) {
  try {
    // Send camelCase - backend expects camelCase!
    const apiData = {
      title: donorData.title,
      firstName: donorData.firstName,
      lastName: donorData.lastName,
      email: donorData.email,
      mobile: donorData.mobile,
      firstLine: donorData.firstLine || donorData.houseNo,
      street: donorData.street,
      city: donorData.city,
      county: donorData.county,
      postCode: donorData.postCode,
      getUpdates: donorData.getUpdates,
      volunteer: donorData.volunteer,
    };
    
    const data = await put(`/admin/donors/${cftNo}/`, apiData);
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    logger.error('updateDonor failed', error.message);
    return {
      success: false,
      error: error.message || 'Failed to update donor',
      data: null,
    };
  }
}

/**
 * ============================================
 * DELETE DONOR (Soft Delete / Anonymize)
 * ============================================
 * DELETE /api/admin/donors/{cftNo}/delete/
 */
export async function deleteDonor(cftNo) {
  try {
    const data = await del(`/admin/donors/${cftNo}/delete/`);
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    logger.error('deleteDonor failed', error.message);
    return {
      success: false,
      error: error.message || 'Failed to delete donor',
      data: null,
    };
  }
}

/**
 * ============================================
 * GET DONOR STATS
 * ============================================
 * GET /api/admin/donors/stats/
 */
export async function getDonorStats() {
  try {
    const data = await get('/admin/donors/stats/');
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    logger.error('getDonorStats failed', error.message);
    return {
      success: false,
      error: error.message || 'Failed to load stats',
      data: null,
    };
  }
}

/**
 * ============================================
 * GET DONORS LIST
 * ============================================
 * GET /api/admin/donors/
 */
export async function getDonorsList(params = {}) {
  try {
    const data = await get('/admin/donors/', params);
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    logger.error('getDonorsList failed', error.message);
    return {
      success: false,
      error: error.message || 'Failed to load donors',
      data: null,
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

/**
 * Format date to UK format (DD/MM/YYYY)
 */
export function formatDate(dateStr) {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  } catch {
    return dateStr;
  }
}

// ===================================================================
// DEFAULT EXPORT
// ===================================================================

export default {
  getDonorProfile,
  getDonorDonations,
  createDonor,
  updateDonor,
  deleteDonor,
  getDonorStats,
  getDonorsList,
  formatCurrency,
  formatNumber,
  formatDate,
};