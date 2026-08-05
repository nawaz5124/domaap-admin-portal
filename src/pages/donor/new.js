// ===================================================================
// ➕ Add New Donor Page - Create New Donor Form
// ===================================================================
// Location: src/pages/donor/new.js
// Route: /donor/new
// Pattern: Matching donation-book/index.js style
// ===================================================================

import { useState } from 'react';
import { useRouter } from 'next/router';

import { createDonor } from '../../services/donorProfileService';

export default function AddNewDonor() {
  const router = useRouter();
  
  // ===================================================================
  // STATE
  // ===================================================================
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    houseNo: '',
    street: '',
    city: '',
    county: '',
    postCode: '',
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.mobile.trim()) errors.mobile = 'Mobile is required';
    if (!formData.postCode.trim()) errors.postCode = 'Post code is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await createDonor({
      title: formData.title,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      houseNo: formData.houseNo,
      street: formData.street,
      city: formData.city,
      county: formData.county,
      postCode: formData.postCode,
    });
    
    if (result.success) {
      alert(`Donor created successfully! CFT No: ${result.data.cftNo}`);
      router.push(`/donor/${result.data.cftNo}`);
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">➕</span>
          Add New Donor
        </h1>
        <button onClick={() => router.push('/donor-bank')} className="btn-cancel">
          ✕ Cancel
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          {/* Personal Information */}
          <div className="section">
            <h3 className="section-title">
              <span>👤</span> Personal Information
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="label">Title<span className="required">*</span></label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`select ${validationErrors.title ? 'error' : ''}`}
                >
                  <option value="">Select title...</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
                {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
              </div>

              <div className="form-group">
                <label className="label">First Name<span className="required">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={`input ${validationErrors.firstName ? 'error' : ''}`}
                />
                {validationErrors.firstName && <span className="error-text">{validationErrors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="label">Last Name<span className="required">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={`input ${validationErrors.lastName ? 'error' : ''}`}
                />
                {validationErrors.lastName && <span className="error-text">{validationErrors.lastName}</span>}
              </div>

              <div className="form-group">
                <label className="label">Email<span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={`input ${validationErrors.email ? 'error' : ''}`}
                />
                {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="label">Mobile<span className="required">*</span></label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="07XXX XXXXXX"
                  className={`input ${validationErrors.mobile ? 'error' : ''}`}
                />
                {validationErrors.mobile && <span className="error-text">{validationErrors.mobile}</span>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="section">
            <h3 className="section-title">
              <span>📍</span> Address
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="label">House No / Name</label>
                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  placeholder="e.g. 160"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. Masons Way"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Solihull"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">County</label>
                <input
                  type="text"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  placeholder="e.g. West Midlands"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Post Code<span className="required">*</span></label>
                <input
                  type="text"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleChange}
                  placeholder="e.g. B92 7JF"
                  className={`input ${validationErrors.postCode ? 'error' : ''}`}
                />
                {validationErrors.postCode && <span className="error-text">{validationErrors.postCode}</span>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer">
            <button type="button" onClick={() => router.push('/donor-bank')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Creating...' : '✅ Create Donor'}
            </button>
          </div>
        </div>
      </form>

      {/* ================================================================= */}
      {/* STYLED-JSX                                                       */}
      {/* ================================================================= */}
      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .page-title {
          font-size: 24px;
          font-weight: bold;
          color: #1e3a5f;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .title-icon {
          font-size: 28px;
        }
        
        .btn-cancel {
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background-color: white;
          font-weight: 500;
        }
        
        .error-banner {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          color: #991b1b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        
        .section {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e3a5f;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        
        .required {
          color: #ef4444;
          margin-left: 2px;
        }
        
        .input, .select {
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        
        .input:focus, .select:focus {
          border-color: #3b82f6;
        }
        
        .input.error, .select.error {
          border: 2px solid #ef4444;
        }
        
        .select {
          background-color: white;
          cursor: pointer;
        }
        
        .error-text {
          font-size: 12px;
          color: #ef4444;
        }
        
        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background-color: #f9fafb;
          cursor: pointer;
        }
        
        .checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
          margin-top: 2px;
        }
        
        .checkbox-label {
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }
        
        .checkbox-hint {
          font-size: 12px;
          color: #6b7280;
        }
        
        .info-box {
          background-color: #eff6ff;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }
        
        .info-box p {
          margin: 0;
          font-size: 13px;
          color: #1e40af;
        }
        
        .form-footer {
          padding: 20px 24px;
          background-color: #f9fafb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background-color: white;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .btn-primary {
          padding: 12px 32px;
          border-radius: 8px;
          border: none;
          background-color: #22c55e;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-primary:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        
        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </>
  );
}