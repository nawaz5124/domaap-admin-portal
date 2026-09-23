// ===================================================================
// 🎁 Fund Service — Admin Portal
// ===================================================================
// Location: src/services/fundService.js
// Created:  31 August 2026 — FUND-P3 (fund catalogue, portal consumers)
//
// Reads the central Fund table (cft_fund_01) so the portal stops
// carrying hardcoded copies of the three funds.
//
// NOTES:
//   1. Uses /admin/funds/ — NOT /funds/. Settings must show INACTIVE
//      funds; the public endpoint returns active only.
//   2. api.js base URL already includes /api — do not prefix it here.
//   3. api.get() returns the parsed body directly. Response shape is
//      { funds: [...] }, confirmed against stage 31 Aug.
//   4. NO module-level memo. The website caches; a Settings screen
//      must show fresh data after an edit (P4).
// ===================================================================

import api from './api';
import logger from '@/utils/logger';

// Mirrors migration 0031_seed_core_funds — last-resort display only.
export const FALLBACK_FUNDS = [
    { id: null, code: 'sadaqah', name: 'Sadaqah', tagline: 'Voluntary charity',         colour: '#f97316', emoji: '🤲', isActive: true, donationCount: 0, createdAt: null, updatedAt: null },
    { id: null, code: 'lillah',  name: 'Lillah',  tagline: 'For the sake of Allah',     colour: '#8b5cf6', emoji: '🕌', isActive: true, donationCount: 0, createdAt: null, updatedAt: null },
    { id: null, code: 'zakat',   name: 'Zakat',   tagline: 'Obligatory charity (2.5%)', colour: '#22c55e', emoji: '🌟', isActive: true, donationCount: 0, createdAt: null, updatedAt: null },
];

// API row (snake_case) -> portal shape (camelCase)
export function mapApiFund(row) {
  return {
    id:        row.id ?? null,
    code:      row.code,
    name:      row.name,
    tagline:   row.tagline || '',
    colour:    row.colour || '#6b7280',
    emoji:     row.emoji || '',
    isActive:  row.is_active,
    donationCount: row.donation_count ?? 0,
    createdAt: row.created_at || null,
  };
}

// ===================================================================
// GET ALL FUNDS (active + inactive)
// ===================================================================
export async function getAllFunds() {
  try {
    const response = await api.get('/admin/funds/');
    const rows = response?.funds || [];

    if (!rows.length) {
      logger.warn('[FUNDS] API returned an empty list — showing fallback');
      return { success: true, data: FALLBACK_FUNDS, source: 'fallback' };
    }

    return { success: true, data: rows.map(mapApiFund), source: 'api' };
  } catch (error) {
    logger.error('[FUNDS] getAllFunds failed', error.message);
    return { success: false, error: error.message || 'Failed to load funds' };
  }
}

// ===================================================================
// WRITE PATH — FUND-P4. Rules live in the API; this layer only maps
// shapes and normalises failures into { success, fieldErrors, error }.
// ===================================================================

// Portal form (camelCase) -> API body (snake_case). `code` is never sent.
function toApiBody(form) {
  return {
    name: form.name,
    tagline: form.tagline || '',
    colour: form.colour || '',
    emoji: form.emoji || '',
    is_active: !!form.isActive,
  };
}

function failure(error, fallbackMessage) {
  const fieldErrors = error?.body?.errors || null; // { name: ["..."], is_active: ["..."] }
  const first = fieldErrors ? Object.values(fieldErrors).flat()[0] : null;
  return { success: false, fieldErrors, error: first || error?.message || fallbackMessage };
}

export async function createFund(form) {
  try {
    const response = await api.post('/admin/funds/', toApiBody(form));
    return { success: true, data: mapApiFund(response.fund) };
  } catch (error) {
    logger.error('[FUNDS] createFund failed', error.message);
    return failure(error, 'Could not add the donation type');
  }
}

export async function updateFund(id, form) {
  try {
    const response = await api.put(`/admin/funds/${id}/`, toApiBody(form));
    return { success: true, data: mapApiFund(response.fund) };
  } catch (error) {
    logger.error('[FUNDS] updateFund failed', error.message);
    return failure(error, 'Could not save the changes');
  }
}

// Mirrors make_fund_code() in the API for the live preview only — the server decides.
export function previewCode(name) {
  return (name || '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, '_')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, 32)
    .replace(/_+$/, '');
}

const fundService = { getAllFunds, createFund, updateFund, previewCode, mapApiFund, FALLBACK_FUNDS };
export default fundService;