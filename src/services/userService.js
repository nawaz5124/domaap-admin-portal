// ===================================================================
// userService.js — [LOGIN-V2] Phase 2b slice 1: User Management
// -------------------------------------------------------------------
// NOTES:
//   1. Uses /admin/users/ — GET {users: [...]}, POST 201 {user, temp_password}.
//   2. api.js base URL already includes /api — do not prefix it here.
//   3. Validation failures come back as 400 {errors: {field: [...]}},
//      same wrap as /admin/funds/, so failure() is identical.
//   4. The temp password exists ONLY in the 201 body. Nothing here
//      stores or logs it — the page shows it once and lets it go.
// ===================================================================

import api from './api';
import logger from '@/utils/logger';

export const ROLES = [
  { value: 'owner',  label: 'Owner',  hint: 'Full access, including users and settings' },
  { value: 'admin',  label: 'Admin',  hint: 'Day-to-day changes (same as Viewer until roles are wired)' },
  { value: 'viewer', label: 'Viewer', hint: 'Read-only' },
];

export function roleLabel(value) {
  return ROLES.find((r) => r.value === value)?.label || 'User';
}

// API row (snake_case) -> portal shape (camelCase)
export function mapApiUser(row) {
  return {
    id:         row.id,
    username:   row.username,
    email:      row.email,
    firstName:  row.first_name || '',
    lastName:   row.last_name || '',
    fullName:   [row.first_name, row.last_name].filter(Boolean).join(' ') || row.username,
    role:       row.role || null,
    hasTwoStep: !!row.has_two_step,
    isActive:   !!row.is_active,
    dateJoined: row.date_joined || null,
    lastLogin:  row.last_login || null,
  };
}

function toApiBody(form) {
  return {
    username:   form.username.trim(),
    email:      form.email.trim(),
    first_name: form.firstName?.trim() || '',
    last_name:  form.lastName?.trim() || '',
    role:       form.role,
  };
}

function failure(error, fallbackMessage) {
  const fieldErrors = error?.body?.errors || null;
  const first = fieldErrors ? Object.values(fieldErrors).flat()[0] : null;
  const detail = error?.body?.detail || null;             // 403 from IsPortalTrustee
  return { success: false, fieldErrors, error: first || detail || error?.message || fallbackMessage };}

export async function getAllUsers() {
  try {
    const response = await api.get('/admin/users/');
    const rows = response?.users || [];
    return { success: true, data: rows.map(mapApiUser) };
  } catch (error) {
    logger.error('[USERS] getAllUsers failed', error.message);
    return { success: false, error: error.message || 'Failed to load users' };
  }
}

export async function createUser(form) {
  try {
    const response = await api.post('/admin/users/', toApiBody(form));
    return { success: true, data: mapApiUser(response.user), tempPassword: response.temp_password };
  } catch (error) {
    logger.error('[USERS] createUser failed', error.message);
    return failure(error, 'Could not add the user');
  }
}

const userService = { getAllUsers, createUser, ROLES, roleLabel };
export default userService;