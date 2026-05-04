// ===================================================================
// 🚧 Coming Soon Modal - Reusable Component
// ===================================================================
// Location: src/components/common/ComingSoonModal.js
// Usage: Import and render with feature config when needed
// Pattern: Config-driven — pass title, icon, features array
// Reference: Settings page modal (Organization, Payment Settings, etc.)
// ===================================================================

import { useEffect } from 'react';

const FEATURE_ICONS = {
  receipts: '🧾',
  'gift-aid': '🎁',
  alerts: '🔔',
  settings: '⚙️',
  reports: '📋',
  email: '✉️',
  community: '🐪',
  events: '🎉',
  default: '🏗️',
};

export default function ComingSoonModal({ isOpen, onClose, feature }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !feature) return null;

  const icon = feature.icon || FEATURE_ICONS[feature.id] || FEATURE_ICONS.default;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '420px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            animation: 'modalSlideIn 0.25s ease-out',
          }}
        >
          {/* Icon */}
          <div style={{
            fontSize: '56px',
            marginBottom: '16px',
            lineHeight: 1,
          }}>
            {icon}
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#1e3a5f',
            margin: '0 0 8px 0',
          }}>
            {feature.title}
          </h2>

          {/* Coming Soon message */}
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            margin: '0 0 20px 0',
          }}>
            This feature is coming soon, Insha Allah! 🤲
          </p>

          {/* Features list (if provided) */}
          {feature.details && feature.details.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                margin: '0 0 8px 0',
              }}>
                We're working hard to bring you:
              </p>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
                lineHeight: 1.6,
              }}>
                {feature.details.join(', ')}
              </p>
            </div>
          )}

          {/* Phase badge */}
          {feature.phase && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#fef3c7',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#92400e',
              marginBottom: '24px',
            }}>
              🗓️ {feature.phase}
            </div>
          )}

          {/* Close button */}
          <div>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#1e3a5f',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#2d4a6f'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1e3a5f'; }}
            >
              Got it, Jazakallah!
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}

// ===================================================================
// FEATURE CONFIGS - Centralised coming soon definitions
// ===================================================================
// Usage: import { COMING_SOON_FEATURES } from './ComingSoonModal';
//        Then pass COMING_SOON_FEATURES.receipts as the feature prop
// ===================================================================
export const COMING_SOON_FEATURES = {
  receipts: {
    id: 'receipts',
    title: 'Generate Receipts',
    icon: '🧾',
    phase: 'Phase 2',
    details: [
      'Automatic Receipt Generation',
      'Bulk PDF Downloads',
      'Email Receipts to Donors',
      'Custom Receipt Templates',
    ],
  },
  giftAid: {
    id: 'gift-aid',
    title: 'Gift Aid Claim',
    icon: '🎁',
    phase: 'Phase 2',
    details: [
      'HMRC Submission',
      'Eligible Donation Tracking',
      'Claim History & Reports',
      'Gift Aid Declaration Management',
    ],
  },
  alerts: {
    id: 'alerts',
    title: 'View Alerts',
    icon: '🔔',
    phase: 'Phase 2',
    details: [
      'DD Cancellation Alerts',
      'Payment Failure Notifications',
      'Large Donation Alerts',
      'Custom Alert Rules',
    ],
  },
};
