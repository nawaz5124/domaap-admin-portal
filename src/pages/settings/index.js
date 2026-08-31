// ===================================================================
// ⚙️ Settings Page - Admin Configuration
// ===================================================================
// Location: src/pages/settings/index.js
// Route: /settings
// Description: Central hub for all admin settings and configuration
// Status: Design ready - Features for future enhancement
// ===================================================================

import { useState } from 'react';
import { useRouter } from 'next/router';


export default function Settings() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(null);

  // Settings sections
  const sections = [
    {
      id: 'organization',
      icon: '🏢',
      title: 'Organization',
      description: 'Charity details, logo, contact information',
      status: 'coming-soon',
      color: '#3b82f6',
      items: ['Charity Name', 'Registration Number', 'Logo', 'Address', 'Contact Details']
    },
    {
      id: 'users',
      icon: '👥',
      title: 'User Management',
      description: 'Admin users, roles, and permissions',
      status: 'coming-soon',
      color: '#8b5cf6',
      items: ['Admin Users', 'Roles & Permissions', 'Invite User', 'Access Logs']
    },
    {
      id: 'payments',
      icon: '💳',
      title: 'Payment Settings',
      description: 'Stripe configuration, bank details, fees',
      status: 'coming-soon',
      color: '#22c55e',
      items: ['Stripe API Keys', 'Live/Test Mode', 'Bank Details', 'Fee Settings']
    },
    {
      id: 'email',
      icon: '📧',
      title: 'Email Settings',
      description: 'SMTP configuration, email templates',
      status: 'coming-soon',
      color: '#f59e0b',
      items: ['SMTP Config', 'Sender Details', 'Email Templates', 'Test Email']
    },
    {
      id: 'donations',
      icon: '🎁',
      title: 'Donation Settings',
      description: 'Fund types, Gift Aid settings', 
      status: 'available',
      color: '#ec4899',
      items: ['Fund Types (Zakat, Sadaqah, Lillah)', 'Gift Aid Rate', 'Receipt Settings'] 
    },
    {
      id: 'notifications',
      icon: '🔔',
      title: 'Notifications',
      description: 'Alert preferences, reminders',
      status: 'coming-soon',
      color: '#ef4444',
      items: ['Email Alerts', 'Event Reminders', 'System Notifications', 'Digest Settings']
    },
    {
      id: 'data',
      icon: '💾',
      title: 'Data & Backup',
      description: 'Export data, backups, GDPR tools',
      status: 'coming-soon',
      color: '#06b6d4',
      items: ['Export Donors', 'Export Donations', 'Backup Now', 'GDPR Requests']
    },
    {
      id: 'about',
      icon: 'ℹ️',
      title: 'About',
      description: 'App version, support, documentation',
      status: 'available',
      color: '#6b7280',
      items: ['Version Info', 'Support Contact', 'Documentation', 'Changelog']
    }
  ];

  // App info
  const appInfo = {
    name: 'DOMAAP',
    fullName: 'Donor Management Application Platform',
    version: '1.0.0',
    lastUpdated: 'January 2026',
    organization: 'Camel Foundation Trust',
    charityNumber: 'Registered Charity',
    support: 'info@camelfoundation.org',
    docs: 'https://docs.camelfoundation.org'
  };

  // Styles
  const styles = {
    header: {
      marginBottom: '32px'
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1e3a5f',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    },
    card: (color, isActive) => ({
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: isActive ? '0 4px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: isActive ? `2px solid ${color}` : '2px solid transparent',
      transform: isActive ? 'scale(1.02)' : 'scale(1)'
    }),
    cardHeader: (color) => ({
      padding: '20px',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      borderBottom: '1px solid #f3f4f6'
    }),
    cardIcon: {
      fontSize: '32px',
      marginBottom: '12px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e3a5f',
      margin: '0 0 4px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    cardDescription: {
      fontSize: '13px',
      color: '#6b7280',
      margin: 0
    },
    cardBody: {
      padding: '16px 20px'
    },
    itemList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    item: {
      fontSize: '13px',
      color: '#374151',
      padding: '6px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    itemDot: (color) => ({
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: color
    }),
    statusBadge: (status) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '600',
      backgroundColor: status === 'available' ? '#f0fdf4' : '#fef3c7',
      color: status === 'available' ? '#166534' : '#92400e'
    }),
    aboutSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: '24px',
      marginTop: '32px'
    },
    aboutHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e5e7eb'
    },
    aboutLogo: {
      fontSize: '48px'
    },
    aboutTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e3a5f',
      margin: 0
    },
    aboutSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '4px 0 0 0'
    },
    aboutGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px'
    },
    aboutItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    aboutLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    aboutValue: {
      fontSize: '15px',
      color: '#1e3a5f',
      fontWeight: '500'
    },
    aboutLink: {
      fontSize: '15px',
      color: '#3b82f6',
      fontWeight: '500',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    versionBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '20px',
      backgroundColor: '#f0fdf4',
      color: '#166534',
      fontSize: '14px',
      fontWeight: '600'
    },
    comingSoonOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    },
    comingSoonModal: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      textAlign: 'center',
      maxWidth: '400px',
      margin: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    modalIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e3a5f',
      margin: '0 0 8px 0'
    },
    modalText: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px',
      lineHeight: '1.6'
    },
    modalButton: {
      backgroundColor: '#1e3a5f',
      color: 'white',
      border: 'none',
      padding: '12px 32px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    quickLinks: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb',
      flexWrap: 'wrap'
    },
    quickLinkBtn: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '8px',
      backgroundColor: `${color}15`,
      color: color,
      border: 'none',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    })
  };

  return (
    <>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>
          <span>⚙️</span>
          Settings
        </h1>
        <p style={styles.subtitle}>
          Manage your application settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div style={styles.grid}>
        {sections.map(section => (
          <div
            key={section.id}
            style={styles.card(section.color, activeSection === section.id)}
            onClick={() => {
              if (section.id === 'donations') {
                router.push('/settings/donation-types');
                return;
              }
              setActiveSection(section.id);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }
            }}
          >
            <div style={styles.cardHeader(section.color)}>
              <div style={styles.cardIcon}>{section.icon}</div>
              <h3 style={styles.cardTitle}>
                {section.title}
                <span style={styles.statusBadge(section.status)}>
                  {section.status === 'available' ? '✅ Available' : '🚧 Coming Soon'}
                </span>
              </h3>
              <p style={styles.cardDescription}>{section.description}</p>
            </div>
            <div style={styles.cardBody}>
              <ul style={styles.itemList}>
                {section.items.slice(0, 4).map((item, idx) => (
                  <li key={idx} style={styles.item}>
                    <span style={styles.itemDot(section.color)}></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* About Section - Always Visible */}
      <div style={styles.aboutSection}>
        <div style={styles.aboutHeader}>
          <span style={styles.aboutLogo}>🐪</span>
          <div>
            <h2 style={styles.aboutTitle}>{appInfo.name}</h2>
            <p style={styles.aboutSubtitle}>{appInfo.fullName}</p>
          </div>
          <span style={{ ...styles.versionBadge, marginLeft: 'auto' }}>
            ✅ v{appInfo.version}
          </span>
        </div>

        <div style={styles.aboutGrid}>
          <div style={styles.aboutItem}>
            <span style={styles.aboutLabel}>Organization</span>
            <span style={styles.aboutValue}>{appInfo.organization}</span>
          </div>
          <div style={styles.aboutItem}>
            <span style={styles.aboutLabel}>Status</span>
            <span style={styles.aboutValue}>{appInfo.charityNumber}</span>
          </div>
          <div style={styles.aboutItem}>
            <span style={styles.aboutLabel}>Last Updated</span>
            <span style={styles.aboutValue}>{appInfo.lastUpdated}</span>
          </div>
          <div style={styles.aboutItem}>
            <span style={styles.aboutLabel}>Support</span>
            <span style={styles.aboutLink}>{appInfo.support}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.quickLinks}>
          <button 
            style={styles.quickLinkBtn('#3b82f6')}
            onClick={() => window.open(appInfo.docs, '_blank')}
          >
            📚 Documentation
          </button>
          <button 
            style={styles.quickLinkBtn('#22c55e')}
            onClick={() => alert('Feature request form coming soon!')}
          >
            💡 Request Feature
          </button>
          <button 
            style={styles.quickLinkBtn('#f59e0b')}
            onClick={() => alert('Bug report form coming soon!')}
          >
            🐛 Report Bug
          </button>
          <button 
            style={styles.quickLinkBtn('#8b5cf6')}
            onClick={() => alert('Changelog coming soon!')}
          >
            📋 Changelog
          </button>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {activeSection && sections.find(s => s.id === activeSection)?.status === 'coming-soon' && (
        <div 
          style={styles.comingSoonOverlay}
          onClick={() => setActiveSection(null)}
        >
          <div 
            style={styles.comingSoonModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalIcon}>
              {sections.find(s => s.id === activeSection)?.icon}
            </div>
            <h3 style={styles.modalTitle}>
              {sections.find(s => s.id === activeSection)?.title}
            </h3>
            <p style={styles.modalText}>
              This feature is coming soon, Insha Allah! 🤲
              <br /><br />
              We're working hard to bring you:
              <br />
              <strong>{sections.find(s => s.id === activeSection)?.items.join(', ')}</strong>
            </p>
            <button 
              style={styles.modalButton}
              onClick={() => setActiveSection(null)}
            >
              Got it, Jazakallah!
            </button>
          </div>
        </div>
      )}
    </>
  );
}