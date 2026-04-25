// ===================================================================
// 👤 Donor Profile Page - View & Manage Individual Donor
// ===================================================================
// Location: src/pages/donor/[cftNo]/index.js
// Route: /donor/001, /donor/002, etc.
// Pattern: Matching donation-book/index.js style
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { getDonorProfile, deleteDonor } from '../../../services/donorProfileService';

export default function DonorProfile() {
  const router = useRouter();
  const { cftNo } = router.query;
  
  // ===================================================================
  // STATE
  // ===================================================================
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ===================================================================
  // DATA FETCHING
  // ===================================================================
  const fetchDonorProfile = useCallback(async () => {
    if (!cftNo) return;
    
    setLoading(true);
    setError(null);
    
    const result = await getDonorProfile(cftNo);
    
    if (result.success) {
      setDonor(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [cftNo]);

  useEffect(() => {
    fetchDonorProfile();
  }, [fetchDonorProfile]);

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handleDeleteDonor = async () => {
    if (!confirm(`Are you sure you want to delete ${donor?.fullName}? This will anonymize their data.`)) {
      return;
    }

    setDeleteLoading(true);
    
    const result = await deleteDonor(cftNo);
    
    if (result.success) {
      alert('Donor has been deleted successfully');
      router.push('/donor-bank');
    } else {
      alert(result.error || 'Failed to delete donor');
    }
    
    setDeleteLoading(false);
  };

  // ===================================================================
  // COMPUTED VALUES
  // ===================================================================
  const isProfileComplete = donor?.consentGDPR && donor?.consentGiftAid && donor?.consentCFT;
  
  const missingConsents = [];
  if (donor && !donor.consentCFT) missingConsents.push('Consent for CFT fund');
  if (donor && !donor.consentGiftAid) missingConsents.push('Gift Aid Declaration');
  if (donor && !donor.consentGDPR) missingConsents.push('GDPR Consent');

  // ===================================================================
  // RENDER
  // ===================================================================

  // Loading state
  if (loading) {
    return (
      <>
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <span>Loading donor profile...</span>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            gap: 16px;
            color: #6b7280;
            font-size: 16px;
          }
          .loading-spinner {
            font-size: 32px;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
          }
        `}</style>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="error-container">
          <span className="error-icon">❌</span>
          <span className="error-text">{error}</span>
          <button className="btn-retry" onClick={fetchDonorProfile}>
            🔄 Retry
          </button>
          <button className="btn-back" onClick={() => router.push('/donor-bank')}>
            ← Back to Donor Bank
          </button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            gap: 16px;
          }
          .error-icon { font-size: 48px; }
          .error-text { color: #ef4444; font-size: 16px; }
          .btn-retry {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
          }
          .btn-back {
            color: #6b7280;
            font-size: 14px;
            cursor: pointer;
            padding: 10px 16px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            background-color: white;
          }
        `}</style>
      </>
    );
  }

  // Not found
  if (!donor) {
    return (
      <>
        <div className="error-container">
          <span className="error-icon">🔍</span>
          <span className="error-text">Donor not found</span>
          <button className="btn-back" onClick={() => router.push('/donor-bank')}>
            ← Back to Donor Bank
          </button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            gap: 16px;
          }
          .error-icon { font-size: 48px; }
          .error-text { color: #ef4444; font-size: 16px; }
          .btn-back {
            color: #6b7280;
            font-size: 14px;
            cursor: pointer;
            padding: 10px 16px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            background-color: white;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button onClick={() => router.push('/donor-bank')} className="btn-back">
            ← Back to Donor Bank
          </button>
          <h1 className="page-title">
            General Profile of {donor.fullName}
            {!isProfileComplete && <span className="incomplete-tag">❗ Incomplete</span>}
          </h1>
          <span className="page-subtitle">Complete profile of our donor pool</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* LEFT: Details Table */}
        <div className="card">
          <div className="card-header">
            <span className="header-icon">📋</span>
            <h3 className="card-title">Donor Details</h3>
            {!isProfileComplete && <span className="alert-icon">❗</span>}
          </div>

          <table className="details-table">
            <tbody>
              {/* Basic Info */}
              <tr><td className="th">CFT No</td><td className="td cft-no">{donor.cftNo}</td></tr>
              <tr><td className="th">Title</td><td className="td">{donor.title || '-'}</td></tr>
              <tr><td className="th">First Name</td><td className="td">{donor.firstName}</td></tr>
              <tr><td className="th">Last Name</td><td className="td">{donor.lastName}</td></tr>

              {/* Address Section */}
              <tr><td colSpan={2} className="section-header">Address</td></tr>
              <tr><td className="th">House No</td><td className="td">{donor.address?.houseNo || '-'}</td></tr>
              <tr><td className="th">Street</td><td className="td">{donor.address?.street || '-'}</td></tr>
              <tr><td className="th">City</td><td className="td">{donor.address?.city || '-'}</td></tr>
              <tr><td className="th">County</td><td className="td">{donor.address?.county || '-'}</td></tr>
              <tr><td className="th">Post Code</td><td className="td">{donor.address?.postCode || '-'}</td></tr>

              {/* Contact */}
              <tr><td className="th">E-Mail</td><td className="td link">{donor.email || '-'}</td></tr>
              <tr><td className="th">Mobile</td><td className="td">{donor.mobile || '-'}</td></tr>

              {/* Consent */}
              <tr>
                <td className="th">Consent for GDPR</td>
                <td className="td">
                  {donor.consentGDPR ? <span className="consent-yes">✅ Yes</span> : <span className="consent-no">❌ No</span>}
                </td>
              </tr>
              <tr>
                <td className="th">Consent for Gift Aid</td>
                <td className="td">
                  {donor.consentGiftAid ? <span className="consent-yes">✅ Yes</span> : <span className="consent-no">❌ No</span>}
                </td>
              </tr>
              <tr>
                <td className="th">Consent for CFT fund</td>
                <td className="td">
                  {donor.consentCFT ? <span className="consent-yes">✅ Yes</span> : <span className="consent-no">❌ No ❗</span>}
                </td>
              </tr>

              {/* Donation Profile Link */}
              <tr>
                <td className="th">Donation Profile</td>
                <td className="td">
                  <span onClick={() => router.push(`/donor/${donor.cftNo}/donations/history`)} className="link">
                    🔗 Click here to view donation history
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT: Quick Actions & Status */}
        <div className="right-column">
          {/* Quick Actions */}
          <div className="actions-card">
            <h3 className="card-title">⚡ Quick Actions</h3>

            <button className="action-btn yellow" onClick={() => alert('Send Email feature coming soon!')}>
              <span>✉️</span> Send E-Mail
            </button>
            <button className="action-btn yellow" onClick={() => router.push(`/donor/${donor.cftNo}/edit`)}>
              <span>✏️</span> Edit Profile
            </button>
            <button className="action-btn green" onClick={() => alert('Generate Receipt feature coming soon!')}>
              <span>🧾</span> Generate Receipt
            </button>
            <button className="action-btn blue" onClick={() => router.push(`/donor/${donor.cftNo}/donations/history`)}>
              <span>📊</span> Donation History
            </button>
            <button className="action-btn red" onClick={handleDeleteDonor} disabled={deleteLoading}>
              <span>{deleteLoading ? '⏳' : '🗑️'}</span> {deleteLoading ? 'Deleting...' : 'Delete Donor'}
            </button>
          </div>

          {/* Donor Status */}
          <div className="status-card">
            <h3 className="card-title">📊 Donor Status</h3>

            <div className="badges">
              {donor.isDirectDebitor && (
                <span className="badge blue">
                  ⭐ Direct Debitor
                  <small>{donor.ddFrequency}: {donor.ddAmount}</small>
                </span>
              )}
              {donor.isPremium && (
                <span className="badge green">
                  🌙 Premium Donor
                  <small>Yearly: £500+</small>
                </span>
              )}
              {donor.status === 'cancelled' && <span className="badge red">❌ Cancelled</span>}
              {donor.status === 'inactive' && <span className="badge yellow">⏸️ Inactive</span>}
            </div>

            <div className="stat-item"><span>Total Donated:</span><span className="value">{donor.totalDonated}</span></div>
            <div className="stat-item"><span>Donations:</span><span className="value">{donor.donationCount}</span></div>
            <div className="stat-item"><span>Gift Aid:</span><span className="value green">{donor.giftAidTotal}</span></div>
            <div className="stat-item"><span>Member Since:</span><span className="value">{donor.memberSince}</span></div>
            <div className="stat-item last"><span>Last Donation:</span><span className="value">{donor.lastDonation}</span></div>
          </div>

          {/* Alert for Incomplete Profile */}
          {!isProfileComplete && (
            <div className="alert-card">
              <div className="alert-title">⚠️ Alert: Incomplete Profile</div>
              <div className="alert-text">Missing: {missingConsents.join(', ')}</div>
              <button className="complete-btn" onClick={() => router.push(`/donor/${donor.cftNo}/edit`)}>
                Complete Now →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* STYLED-JSX - MOBILE FIRST RESPONSIVE STYLES                      */}
      {/* ================================================================= */}
      <style jsx>{`
        /* ============================================ */
        /* BASE STYLES (Mobile First)                  */
        /* ============================================ */
        
        .page-header {
          margin-bottom: 24px;
        }
        
        .header-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background-color: white;
          width: fit-content;
        }
        
        .page-title {
          font-size: 20px;
          font-weight: bold;
          color: #1e3a5f;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }
        
        .incomplete-tag {
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
        }
        
        .page-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        
        .main-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        
        .card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .header-icon {
          font-size: 20px;
        }
        
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e3a5f;
          margin: 0;
        }
        
        .alert-icon {
          color: #ef4444;
          font-size: 20px;
        }
        
        .details-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .th {
          padding: 12px 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          background-color: #f9fafb;
          width: 140px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .td {
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .cft-no {
          color: #3b82f6;
          font-weight: 600;
        }
        
        .section-header {
          padding: 10px 16px;
          background-color: #fef3c7;
          color: #92400e;
          font-weight: 600;
          font-size: 13px;
        }
        
        .link {
          color: #3b82f6;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .consent-yes {
          color: #22c55e;
          font-weight: 500;
        }
        
        .consent-no {
          color: #ef4444;
          font-weight: 500;
        }
        
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .actions-card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 20px;
        }
        
        .actions-card .card-title {
          margin-bottom: 16px;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 8px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
        }
        
        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .action-btn.yellow { background-color: #fef3c7; color: #92400e; }
        .action-btn.green { background-color: #d1fae5; color: #065f46; }
        .action-btn.blue { background-color: #dbeafe; color: #1e40af; }
        .action-btn.red { background-color: #fef2f2; color: #991b1b; }
        
        .status-card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 20px;
        }
        
        .status-card .card-title {
          margin-bottom: 16px;
        }
        
        .badges {
          margin-bottom: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .badge {
          display: inline-flex;
          flex-direction: column;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }
        
        .badge small {
          font-weight: 400;
          font-size: 11px;
        }
        
        .badge.blue { background-color: #dbeafe; color: #1e40af; }
        .badge.green { background-color: #f0fdf4; color: #166534; }
        .badge.red { background-color: #fef2f2; color: #991b1b; }
        .badge.yellow { background-color: #fef3c7; color: #92400e; }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #6b7280;
        }
        
        .stat-item.last {
          border-bottom: none;
        }
        
        .stat-item .value {
          font-weight: 600;
          color: #1e3a5f;
        }
        
        .stat-item .value.green {
          color: #22c55e;
        }
        
        .alert-card {
          background-color: #fef2f2;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #fecaca;
        }
        
        .alert-title {
          color: #991b1b;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .alert-text {
          color: #b91c1c;
          font-size: 13px;
          margin-bottom: 12px;
        }
        
        .complete-btn {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        
        /* ============================================ */
        /* TABLET STYLES (768px and up)                */
        /* ============================================ */
        @media (min-width: 768px) {
          .page-title {
            font-size: 24px;
          }
          
          .th {
            width: 180px;
            padding: 12px 20px;
          }
          
          .td {
            padding: 12px 20px;
          }
          
          .section-header {
            padding: 10px 20px;
          }
        }
        
        /* ============================================ */
        /* DESKTOP STYLES (1024px and up)              */
        /* ============================================ */
        @media (min-width: 1024px) {
          .main-grid {
            display: grid;
            grid-template-columns: 1fr 320px;
            flex-direction: row;
          }
          
          .page-title {
            font-size: 26px;
          }
          
          .th {
            width: 200px;
          }
        }
      `}</style>
    </>
  );
}