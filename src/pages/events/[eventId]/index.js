// ===================================================================
// 🗓️ Event Detail/Planning Page
// ===================================================================
// Location: src/pages/events/[eventId]/index.js
// Route: /events/jan-2026-mens
// Description: Complete event planning with all sections
// ===================================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function EventDetail() {
  const router = useRouter();
  const { eventId } = router.query;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample event data
  const eventsData = {
    'jan-2026-mens': {
      id: 'jan-2026-mens',
      title: "January 2026 Men's Ijthema",
      type: 'mens',
      date: '2026-01-11',
      displayDate: 'Saturday, 11th January 2026',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'planning',
      expectedAttendance: 50,
      ameer: { name: 'Farooq Bhai', contact: '07XXX XXXXXX' },
      
      setup: [
        { id: 1, task: 'Opening venue at 6:00 PM', assignedTo: ['Nawaz', 'Fayaz'], status: 'confirmed' },
        { id: 2, task: 'Arranging chairs/tables', assignedTo: ['Ibrahim'], status: 'pending' },
        { id: 3, task: 'Prayer Mats', assignedTo: [], status: 'needed' },
      ],
      
      program: [
        { id: 1, activity: 'Quran Reflections', speaker: 'Mujtaba & Munif', duration: 20, status: 'confirmed' },
        { id: 2, activity: 'CFT Bayan', speaker: 'Safyan/Hamdan', duration: 30, status: 'confirmed' },
        { id: 3, activity: 'CFT Updates', speaker: 'Fayaz/Moin', duration: 15, status: 'pending' },
      ],
      
      salah: { isha: '7:00 PM', azaan: '', imamat: '' },
      
      food: [
        { id: 1, category: 'Biryani', item: 'Biryani 2kg', contributor: 'Rizwana (Mrs Mustafa)', status: 'confirmed' },
        { id: 2, category: 'Biryani', item: 'Biryani 2kg', contributor: 'Mumtaz (Mrs Ibrahim)', status: 'confirmed' },
        { id: 3, category: 'Curry', item: 'Mutton Curry', contributor: 'Mubeen', status: 'confirmed' },
        { id: 4, category: 'Curry', item: 'Chicken Korma', contributor: '', status: 'needed' },
        { id: 5, category: 'Roti', item: 'Roti 50 pcs', contributor: 'Nasima', status: 'confirmed' },
        { id: 6, category: 'Salad', item: 'Raita', contributor: 'Renata', status: 'confirmed' },
        { id: 7, category: 'Dessert', item: 'Gulab Jamun', contributor: 'Javeria', status: 'confirmed' },
        { id: 8, category: 'Drinks', item: 'Water 300ml x50', contributor: 'Gazala (Mrs Sakif)', status: 'confirmed' },
        { id: 9, category: 'Drinks', item: 'Soft Drinks', contributor: '', status: 'needed' },
      ],
      
      cleaning: [
        { id: 1, area: 'Kitchen / Floor', volunteer: 'Moin', status: 'confirmed' },
        { id: 2, area: 'Washroom', volunteer: '', status: 'needed' },
      ],
      
      logistics: [
        { id: 1, item: 'Cutlery (Plates/Spoons)', responsible: 'Ibrahim', status: 'ready' },
        { id: 2, item: 'Table Covers', responsible: 'Ibrahim', status: 'ready' },
        { id: 3, item: 'Dustbins & Bags', responsible: '', status: 'needed' },
      ]
    },
    'dec-2025-family': {
      id: 'dec-2025-family',
      title: "December 2025 Family Ijthema",
      type: 'family',
      date: '2025-12-14',
      displayDate: 'Saturday, 14th December 2025',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'completed',
      actualAttendance: 72,
      ameer: { name: 'Ibrahim Bhai', contact: '07XXX XXXXXX' },
      
      setup: [
        { id: 1, task: 'Opening venue at 6:00 PM', assignedTo: ['Ibrahim', 'Fayaz'], status: 'confirmed' },
        { id: 2, task: 'Arranging chairs/tables', assignedTo: ['Ibrahim'], status: 'confirmed' },
        { id: 3, task: 'Prayer Mats', assignedTo: ['Ibrahim'], status: 'confirmed' },
      ],
      
      program: [
        { id: 1, activity: 'Quran Reflections (Men)', speaker: 'Mujtaba & Munif', duration: 20, status: 'confirmed' },
        { id: 2, activity: 'CFT Bayan (Men)', speaker: 'Safyan/Hamdan', duration: 30, status: 'confirmed' },
        { id: 3, activity: 'CFT Updates (Men)', speaker: 'Fayaz/Moin', duration: 15, status: 'confirmed' },
        { id: 4, activity: 'Quran Reflections (Women)', speaker: 'Khadija Moinudden', duration: 20, status: 'confirmed' },
        { id: 5, activity: 'CFT Bayan (Women)', speaker: 'Mumtaz (Mrs Ibrahim)', duration: 30, status: 'confirmed' },
        { id: 6, activity: 'CFT Updates (Women)', speaker: 'Nasima (Mrs Moin)', duration: 15, status: 'confirmed' },
      ],
      
      salah: { isha: '7:00 PM', azaan: 'TBC', imamat: 'TBC' },
      
      food: [
        { id: 1, category: 'Biryani', item: 'Biryani 2kg', contributor: 'Rizwana (Mrs Mustafa)', status: 'confirmed' },
        { id: 2, category: 'Biryani', item: 'Biryani 2kg', contributor: 'Mumtaz (Mrs Ibrahim)', status: 'confirmed' },
        { id: 3, category: 'Biryani', item: 'Biryani 2kg', contributor: 'Nasima (Mrs Moin)', status: 'confirmed' },
        { id: 4, category: 'Curry', item: 'Mutton Curry', contributor: 'Mubeen', status: 'confirmed' },
        { id: 5, category: 'Curry', item: 'Mutton Curry', contributor: 'Sana Shireen', status: 'confirmed' },
        { id: 6, category: 'Curry', item: 'Chicken Curry', contributor: 'Saba', status: 'confirmed' },
        { id: 7, category: 'Curry', item: 'Delhi Chicken Korma', contributor: 'Salma Abdul', status: 'confirmed' },
        { id: 8, category: 'Roti', item: 'Roti', contributor: 'Nasima', status: 'confirmed' },
        { id: 9, category: 'Salad', item: 'Raita', contributor: 'Renata', status: 'confirmed' },
        { id: 10, category: 'Salad', item: 'Salad', contributor: 'Renata', status: 'confirmed' },
        { id: 11, category: 'Dessert', item: 'Gulab Jamun', contributor: 'Javeria', status: 'confirmed' },
        { id: 12, category: 'Dessert', item: 'Sheer Khurma', contributor: 'Mumtaz (Mrs Ibrahim)', status: 'confirmed' },
        { id: 13, category: 'Drinks', item: 'Water Bottles', contributor: 'Gazala (Mrs Sakif)', status: 'confirmed' },
        { id: 14, category: 'Drinks', item: 'Soft Drinks', contributor: 'Gazala (Mrs Sakif)', status: 'confirmed' },
        { id: 15, category: 'Starters', item: 'Paneer Puff Pastries', contributor: 'Anjum (Mrs Fayaz)', status: 'confirmed' },
        { id: 16, category: 'Starters', item: 'Pasta', contributor: 'Humaira (Mrs Wajahath)', status: 'confirmed' },
        { id: 17, category: 'Starters', item: 'Samosa', contributor: 'Gazala (Mrs Sakif)', status: 'confirmed' },
        { id: 18, category: 'Starters', item: 'Keema Puff Pastries', contributor: 'Waheeda (Mrs Zakir)', status: 'confirmed' },
        { id: 19, category: 'Starters', item: 'Grilled Chicken', contributor: 'Aafreen (Mrs Riyaz)', status: 'confirmed' },
      ],
      
      cleaning: [
        { id: 1, area: 'Kitchen / Floor / Washroom', volunteer: 'Moin', status: 'confirmed' },
      ],
      
      logistics: [
        { id: 1, item: 'Cutlery (Plates/Spoons/Table Covers)', responsible: 'Ibrahim', status: 'ready' },
      ]
    }
  };

  useEffect(() => {
    if (eventId) {
      setTimeout(() => {
        setEvent(eventsData[eventId] || null);
        setLoading(false);
      }, 300);
    }
  }, [eventId]);

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { bg: '#f0fdf4', color: '#166534', icon: '✅' },
      pending: { bg: '#fef3c7', color: '#92400e', icon: '⏳' },
      needed: { bg: '#fef2f2', color: '#991b1b', icon: '❌' },
      ready: { bg: '#f0fdf4', color: '#166534', icon: '✅' }
    };
    return badges[status] || badges.pending;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Biryani': '🍚',
      'Curry': '🍛',
      'Roti': '🫓',
      'Salad': '🥗',
      'Dessert': '🍮',
      'Drinks': '🥤',
      'Starters': '🥟'
    };
    return icons[category] || '🍽️';
  };

  // Styles
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#1e3a5f',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '10px 20px',
      borderRadius: '8px',
      border: '1px solid #1e3a5f',
      backgroundColor: 'white',
      fontWeight: '600',
      marginBottom: '16px'
    },
    titleSection: {
      flex: 1
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e3a5f',
      margin: '0 0 8px 0'
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '14px',
      color: '#6b7280'
    },
    statusBadge: (bg, color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px',
      borderRadius: '20px',
      backgroundColor: bg,
      color: color,
      fontSize: '14px',
      fontWeight: '600'
    }),
    actionsRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
    },
    actionBtn: (isPrimary) => ({
      padding: '10px 20px',
      borderRadius: '8px',
      border: isPrimary ? 'none' : '1px solid #d1d5db',
      backgroundColor: isPrimary ? '#3b82f6' : 'white',
      color: isPrimary ? 'white' : '#374151',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }),
    section: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      backgroundColor: '#1e3a5f',
      color: 'white'
    },
    sectionTitle: {
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    addButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '12px 20px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    td: {
      padding: '14px 20px',
      fontSize: '13px',
      color: '#374151',
      borderBottom: '1px solid #f3f4f6'
    },
    badge: (bg, color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '12px',
      backgroundColor: bg,
      color: color,
      fontSize: '11px',
      fontWeight: '600'
    }),
    assignBtn: {
      color: '#3b82f6',
      cursor: 'pointer',
      fontSize: '12px',
      textDecoration: 'underline'
    },
    salahCard: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      padding: '20px'
    },
    salahItem: {
      textAlign: 'center',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px'
    },
    salahLabel: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '6px'
    },
    salahValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e3a5f'
    },
    summaryCard: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    summaryItem: (borderColor) => ({
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      borderLeft: `4px solid ${borderColor}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }),
    summaryValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e3a5f'
    },
    summaryLabel: {
      fontSize: '12px',
      color: '#6b7280'
    }
  };

  if (loading) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <div>Loading event details...</div>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Event Not Found</div>
            <button onClick={() => router.push('/events')} style={styles.backButton}>
              ← Back to Events
            </button>
          </div>
        </div>
      </>
    );
  }

  // Calculate stats
  const confirmedFood = event.food.filter(f => f.status === 'confirmed').length;
  const neededFood = event.food.filter(f => f.status === 'needed').length;
  const confirmedSetup = event.setup.filter(s => s.status === 'confirmed').length;
  const confirmedProgram = event.program.filter(p => p.status === 'confirmed').length;

  const statusInfo = event.status === 'planning' 
    ? { bg: '#fef3c7', color: '#92400e', label: '🟡 Planning' }
    : { bg: '#f0fdf4', color: '#166534', label: '✅ Completed' };

  return (
    <>
      {/* Back Button */}
      <button onClick={() => router.push('/events')} style={styles.backButton}>
        ← Back to Events
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.pageTitle}>🗓️ {event.title}</h1>
          <div style={styles.metaRow}>
            <span>📅 {event.displayDate}</span>
            <span>⏰ {event.time}</span>
            <span>📍 {event.venue}</span>
            <span>👤 Ameer: {event.ameer.name}</span>
          </div>
          {event.status === 'planning' && (
            <div style={styles.actionsRow}>
              <button style={styles.actionBtn(false)} onClick={() => alert('Edit feature coming soon!')}>
                ✏️ Edit Details
              </button>
              <button style={styles.actionBtn(false)} onClick={() => alert('Share feature coming in Phase 2!')}>
                📤 Share
              </button>
              <button style={styles.actionBtn(true)} onClick={() => alert('Print feature coming in Phase 2!')}>
                🖨️ Print Planning Sheet
              </button>
            </div>
          )}
        </div>
        <span style={styles.statusBadge(statusInfo.bg, statusInfo.color)}>
          {statusInfo.label}
        </span>
      </div>

      {/* Summary Stats */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryItem('#22c55e')}>
          <div style={styles.summaryValue}>{confirmedSetup}/{event.setup.length}</div>
          <div style={styles.summaryLabel}>Setup Tasks</div>
        </div>
        <div style={styles.summaryItem('#3b82f6')}>
          <div style={styles.summaryValue}>{confirmedProgram}/{event.program.length}</div>
          <div style={styles.summaryLabel}>Program Items</div>
        </div>
        <div style={styles.summaryItem('#f59e0b')}>
          <div style={styles.summaryValue}>{confirmedFood}/{event.food.length}</div>
          <div style={styles.summaryLabel}>Food Items</div>
        </div>
        <div style={styles.summaryItem('#ec4899')}>
          <div style={styles.summaryValue}>{event.actualAttendance || event.expectedAttendance}</div>
          <div style={styles.summaryLabel}>{event.status === 'completed' ? 'Attended' : 'Expected'}</div>
        </div>
      </div>

      {/* Setup & Preparations */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>🏠 SETUP & PREPARATIONS</span>
          {event.status === 'planning' && (
            <button style={styles.addButton} onClick={() => alert('Add task feature coming soon!')}>
              + Add Task
            </button>
          )}
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Task</th>
              <th style={styles.th}>Assigned To</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {event.setup.map(task => {
              const badge = getStatusBadge(task.status);
              return (
                <tr key={task.id}>
                  <td style={styles.td}>{task.task}</td>
                  <td style={styles.td}>
                    {task.assignedTo.length > 0 
                      ? task.assignedTo.join(', ')
                      : <span style={styles.assignBtn}>+ Assign</span>
                    }
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(badge.bg, badge.color)}>
                      {badge.icon} {task.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Program Activities */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>📖 PROGRAM ACTIVITIES</span>
          {event.status === 'planning' && (
            <button style={styles.addButton} onClick={() => alert('Add activity feature coming soon!')}>
              + Add Activity
            </button>
          )}
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Activity</th>
              <th style={styles.th}>Speaker / Lead</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {event.program.map(item => {
              const badge = getStatusBadge(item.status);
              return (
                <tr key={item.id}>
                  <td style={styles.td}>{item.activity}</td>
                  <td style={styles.td}>
                    {item.speaker || <span style={styles.assignBtn}>+ Assign</span>}
                  </td>
                  <td style={styles.td}>{item.duration} mins</td>
                  <td style={styles.td}>
                    <span style={styles.badge(badge.bg, badge.color)}>
                      {badge.icon} {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Salah Timings */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>🕌 SALAH TIMINGS</span>
        </div>
        <div style={styles.salahCard}>
          <div style={styles.salahItem}>
            <div style={styles.salahLabel}>Isha Salah</div>
            <div style={styles.salahValue}>{event.salah.isha || 'TBC'}</div>
          </div>
          <div style={styles.salahItem}>
            <div style={styles.salahLabel}>Azaan</div>
            <div style={styles.salahValue}>
              {event.salah.azaan || <span style={{ color: '#3b82f6', cursor: 'pointer' }}>+ Assign</span>}
            </div>
          </div>
          <div style={styles.salahItem}>
            <div style={styles.salahLabel}>Imamat</div>
            <div style={styles.salahValue}>
              {event.salah.imamat || <span style={{ color: '#3b82f6', cursor: 'pointer' }}>+ Assign</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Food Contributions */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>🍛 FOOD CONTRIBUTIONS</span>
          {event.status === 'planning' && (
            <button style={styles.addButton} onClick={() => alert('Add food item feature coming soon!')}>
              + Add Item
            </button>
          )}
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Item</th>
              <th style={styles.th}>Contributor</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {event.food.map(item => {
              const badge = getStatusBadge(item.status);
              return (
                <tr key={item.id}>
                  <td style={styles.td}>
                    {getCategoryIcon(item.category)} {item.category}
                  </td>
                  <td style={styles.td}>{item.item}</td>
                  <td style={styles.td}>
                    {item.contributor || <span style={styles.assignBtn}>+ Volunteer</span>}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(badge.bg, badge.color)}>
                      {badge.icon} {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cleaning & Logistics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Cleaning */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>🧹 CLEANING</span>
            {event.status === 'planning' && (
              <button style={styles.addButton} onClick={() => alert('Add volunteer feature coming soon!')}>
                + Add
              </button>
            )}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Area</th>
                <th style={styles.th}>Volunteer</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {event.cleaning.map(item => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.area}</td>
                    <td style={styles.td}>
                      {item.volunteer || <span style={styles.assignBtn}>+ Assign</span>}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(badge.bg, badge.color)}>
                        {badge.icon}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Logistics */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>📦 LOGISTICS</span>
            {event.status === 'planning' && (
              <button style={styles.addButton} onClick={() => alert('Add item feature coming soon!')}>
                + Add
              </button>
            )}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Responsible</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {event.logistics.map(item => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.item}</td>
                    <td style={styles.td}>
                      {item.responsible || <span style={styles.assignBtn}>+ Assign</span>}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(badge.bg, badge.color)}>
                        {badge.icon}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Notes */}
      <div style={{ ...styles.section, backgroundColor: '#fef3c7', border: '2px solid #f59e0b' }}>
        <div style={{ padding: '20px' }}>
          <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 Important Notes
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e', fontSize: '13px', lineHeight: '1.8' }}>
            <li>All food items are examples. Please feel free to contribute your own item.</li>
            <li>For Bayan & Reflection – Please consult Farooq Bhai.</li>
            <li>Food Arrangements – Please contact Ibrahim from the Men's group.</li>
            <li>Jazakallahu Khairun Kaseera for your contributions! 🤲</li>
          </ul>
        </div>
      </div>
    </>
  );
}