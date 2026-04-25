// ===================================================================
// ➕ Create New Ijthema Event Page
// ===================================================================
// Location: src/pages/events/new.js
// Route: /events/new
// Description: Form to create a new Men's or Family Ijthema event
// ===================================================================

import { useState } from 'react';
import { useRouter } from 'next/router';


export default function CreateEvent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'mens',
    title: '',
    date: '',
    time: '18:00',
    venue: 'Community Hall',
    ameerName: '',
    ameerContact: '',
    expectedAttendance: 50,
    notes: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate title based on type and date
    if (name === 'date' || name === 'type') {
      const dateValue = name === 'date' ? value : formData.date;
      const typeValue = name === 'type' ? value : formData.type;
      
      if (dateValue) {
        const dateObj = new Date(dateValue);
        const month = dateObj.toLocaleString('en-GB', { month: 'long' });
        const year = dateObj.getFullYear();
        const typeLabel = typeValue === 'mens' ? "Men's" : 'Family';
        
        setFormData(prev => ({
          ...prev,
          [name]: value,
          title: `${month} ${year} ${typeLabel} Ijthema`
        }));
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate event ID
    const dateObj = new Date(formData.date);
    const month = dateObj.toLocaleString('en-GB', { month: 'short' }).toLowerCase();
    const year = dateObj.getFullYear();
    const eventId = `${month}-${year}-${formData.type}`;

    // Simulate API call
    setTimeout(() => {
      alert(`Event created successfully!\nID: ${eventId}`);
      setIsSubmitting(false);
      router.push(`/events/${eventId}`);
    }, 1000);
  };

  // Styles
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1e3a5f',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    cancelButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '10px 20px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white'
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      maxWidth: '800px'
    },
    section: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e3a5f',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    formGroupFull: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      gridColumn: 'span 2'
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151'
    },
    required: {
      color: '#ef4444',
      marginLeft: '2px'
    },
    input: {
      padding: '12px 14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      outline: 'none'
    },
    select: {
      padding: '12px 14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'white'
    },
    textarea: {
      padding: '12px 14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical'
    },
    typeSelector: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    typeCard: (isSelected, color) => ({
      padding: '20px',
      borderRadius: '12px',
      border: `2px solid ${isSelected ? color : '#e5e7eb'}`,
      backgroundColor: isSelected ? `${color}10` : 'white',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s'
    }),
    typeIcon: {
      fontSize: '40px',
      marginBottom: '8px'
    },
    typeLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e3a5f',
      marginBottom: '4px'
    },
    typeDesc: {
      fontSize: '12px',
      color: '#6b7280'
    },
    helpText: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    footer: {
      padding: '20px 24px',
      backgroundColor: '#f9fafb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    footerHint: {
      fontSize: '13px',
      color: '#6b7280'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px'
    },
    cancelBtn: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    submitBtn: {
      padding: '12px 32px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#22c55e',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>
          <span>➕</span>
          Create New Ijthema Event
        </h1>
        <button
          onClick={() => router.push('/events')}
          style={styles.cancelButton}
        >
          ✕ Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.formCard}>
          {/* Event Type Selection */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span>🗓️</span> Event Type
            </h3>
            
            <div style={styles.typeSelector}>
              <div
                style={styles.typeCard(formData.type === 'mens', '#3b82f6')}
                onClick={() => handleChange({ target: { name: 'type', value: 'mens' } })}
              >
                <div style={styles.typeIcon}>👨</div>
                <div style={styles.typeLabel}>Men's Ijthema</div>
                <div style={styles.typeDesc}>Monthly gathering for brothers</div>
              </div>
              
              <div
                style={styles.typeCard(formData.type === 'family', '#ec4899')}
                onClick={() => handleChange({ target: { name: 'type', value: 'family' } })}
              >
                <div style={styles.typeIcon}>👨‍👩‍👧</div>
                <div style={styles.typeLabel}>Family Ijthema</div>
                <div style={styles.typeDesc}>Monthly gathering for families</div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span>📋</span> Event Details
            </h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Date<span style={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <span style={styles.helpText}>Usually 2nd Saturday of the month</span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Time<span style={styles.required}>*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>
                  Event Title<span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. January 2026 Men's Ijthema"
                  style={styles.input}
                  required
                />
                <span style={styles.helpText}>Auto-generated from date and type, or enter custom title</span>
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>
                  Venue<span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. Community Hall"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Expected Attendance</label>
                <input
                  type="number"
                  name="expectedAttendance"
                  value={formData.expectedAttendance}
                  onChange={handleChange}
                  min="1"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Ameer (Event Lead) */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span>👤</span> Ameer (Event Lead)
            </h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Ameer Name<span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="ameerName"
                  value={formData.ameerName}
                  onChange={handleChange}
                  placeholder="e.g. Farooq Bhai"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Number</label>
                <input
                  type="tel"
                  name="ameerContact"
                  value={formData.ameerContact}
                  onChange={handleChange}
                  placeholder="e.g. 07XXX XXXXXX"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span>📝</span> Additional Notes
            </h3>
            
            <div style={styles.formGroup}>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions, theme, or notes for this event..."
                style={styles.textarea}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <span style={styles.footerHint}>
              💡 You can add setup tasks, program, and food items after creating the event
            </span>
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => router.push('/events')}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={styles.submitBtn}
              >
                {isSubmitting ? (
                  <>⏳ Creating...</>
                ) : (
                  <>✅ Create Event</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}