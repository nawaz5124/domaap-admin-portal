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
  { id: null, code: 'sadaqah', name: 'Sadaqah', tagline: 'Voluntary charity',         colour: '#f97316', emoji: '🤲', isActive: true, createdAt: null, updatedAt: null },
  { id: null, code: 'lillah',  name: 'Lillah',  tagline: 'For the sake of Allah',     colour: '#8b5cf6', emoji: '🕌', isActive: true, createdAt: null, updatedAt: null },
  { id: null, code: 'zakat',   name: 'Zakat',   tagline: 'Obligatory charity (2.5%)', colour: '#22c55e', emoji: '🌟', isActive: true, createdAt: null, updatedAt: null },
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
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
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

const fundService = { getAllFunds, mapApiFund, FALLBACK_FUNDS };
export default fundService;