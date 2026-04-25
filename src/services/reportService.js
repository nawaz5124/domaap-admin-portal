// ===================================================================
// 📊 Report Service — FIXED
// ===================================================================
// Location: src/services/reportService.js
// Created:  February 2026 - Reports & Exports Module
//
// FIXES APPLIED:
//   1. URL: Removed '/api' prefix — api.js base URL already has it
//      OLD: /api/admin/reports/preview/
//      NEW: /admin/reports/preview/
//   2. Response: api.get() returns response.data directly
//      OLD: response.data.stats
//      NEW: response.stats  (response IS the data)
// ===================================================================

import api from './api';


// ===================================================================
// QUERY STRING BUILDER
// ===================================================================

function buildQueryString(params) {
  const qp = new URLSearchParams();

  // Report type (always required)
  if (params.reportType) {
    qp.append('report_type', params.reportType);
  }

  // Date range
  if (params.startDate) qp.append('start_date', params.startDate);
  if (params.endDate) qp.append('end_date', params.endDate);

  // Filters — only send if not 'all'
  if (params.paymentMode && params.paymentMode !== 'all') {
    qp.append('payment_mode', params.paymentMode);
  }
  if (params.fundType && params.fundType !== 'all') {
    qp.append('fund_type', params.fundType);
  }
  if (params.cause && params.cause !== 'all') {
    qp.append('cause', params.cause);
  }
  if (params.frequency && params.frequency !== 'all') {
    qp.append('frequency', params.frequency);
  }
  if (params.status && params.status !== 'all') {
    qp.append('status', params.status);
  }
  if (params.giftAid && params.giftAid !== 'all') {
    qp.append('gift_aid', params.giftAid);
  }

  // Donor search (optional)
  if (params.searchType && params.searchValue) {
    qp.append('search_type', params.searchType);
    qp.append('search', params.searchValue);
  }

  // Pagination (preview only)
  if (params.page) qp.append('page', params.page);
  if (params.pageSize) qp.append('page_size', params.pageSize);

  // Download format (download only)
  if (params.format) qp.append('format', params.format);

  return qp.toString();
}


// ===================================================================
// 1. GET REPORT PREVIEW
// ===================================================================
// FIX 1: URL path — /admin/ not /api/admin/
// FIX 2: response IS the data (api.get returns response.data)
// ===================================================================

export async function getReportPreview(params) {
  try {
    const queryString = buildQueryString(params);
    const response = await api.get(
      `/admin/reports/preview/?${queryString}`
    );

    // api.get() returns response.data directly
    // So 'response' already IS { stats, rows, totalRows, page, pageSize }
    const data = response.data || response;

    return {
      success: true,
      data: {
        stats: data.stats || {
          totalAmount: 0,
          totalDonations: 0,
          uniqueDonors: 0,
          giftAidValue: 0,
        },
        rows: data.rows || [],
        totalRows: data.totalRows || 0,
        page: data.page || 1,
        pageSize: data.pageSize || 20,
      },
    };
  } catch (error) {
    console.error('getReportPreview error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to load report preview',
    };
  }
}


// ===================================================================
// 2. DOWNLOAD REPORT (File Stream)
// ===================================================================
// FIX 1: URL path — /admin/ not /api/admin/
// ===================================================================

export async function downloadReport(params) {
  try {
    const queryString = buildQueryString(params);
    const response = await api.get(
      `/admin/reports/download/?${queryString}`,
      {
        responseType: 'blob',
      }
    );

    // Handle the response — could be response.data or response directly
    const blobData = response.data || response;

    // Extract filename from Content-Disposition header
    const headers = response.headers || {};
    const contentDisposition = headers['content-disposition'] || '';
    let filename = `report.${params.format || 'csv'}`;

    const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }

    // Determine MIME type
    const mimeTypes = {
      csv: 'text/csv',
      pdf: 'application/pdf',
      hmrc: 'text/csv',
    };
    const mimeType = mimeTypes[params.format] || 'application/octet-stream';

    // Create blob and trigger download
    const blob = new Blob([blobData], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error('downloadReport error:', error);

    // If the response was a blob (error from API), try to read it
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        return {
          success: false,
          error: parsed.error || parsed.message || 'Download failed',
        };
      } catch {
        // Couldn't parse blob error
      }
    }

    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to download report',
    };
  }
}


// ===================================================================
// FORMATTING HELPERS
// ===================================================================

export function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return `£${num.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(num) {
  const n = parseInt(num) || 0;
  return n.toLocaleString('en-GB');
}


// ===================================================================
// DEFAULT EXPORT
// ===================================================================

const reportService = {
  getReportPreview,
  downloadReport,
  formatCurrency,
  formatNumber,
  buildQueryString,
};

export default reportService;