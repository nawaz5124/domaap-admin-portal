// ===================================================================
// 🗓️ Ijthema Events List Page
// ===================================================================
// Location: src/pages/events/index.js
// Route: /events
// Description: View all Ijthema events with filtering and stats
// ===================================================================

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function EventsList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Sample events data
  const events = [
    {
      id: 'jan-2026-mens',
      title: "January 2026 Men's Ijthema",
      type: 'mens',
      date: '2026-01-11',
      displayDate: 'Sat, 11 Jan 2026',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'planning',
      volunteers: 8,
      foodItems: 12,
      expectedAttendance: 50,
      ameer: 'Farooq Bhai'
    },
    {
      id: 'mar-2026-family',
      title: "March 2026 Family Ijthema",
      type: 'family',
      date: '2026-03-14',
      displayDate: 'Sat, 14 Mar 2026',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'planning',
      volunteers: 4,
      foodItems: 5,
      expectedAttendance: 80,
      ameer: 'Ibrahim Bhai'
    },
    {
      id: 'dec-2025-family',
      title: "December 2025 Family Ijthema",
      type: 'family',
      date: '2025-12-14',
      displayDate: 'Sat, 14 Dec 2025',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'completed',
      volunteers: 24,
      foodItems: 32,
      actualAttendance: 72,
      ameer: 'Ibrahim Bhai'
    },
    {
      id: 'nov-2025-mens',
      title: "November 2025 Men's Ijthema",
      type: 'mens',
      date: '2025-11-09',
      displayDate: 'Sat, 9 Nov 2025',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'completed',
      volunteers: 18,
      foodItems: 20,
      actualAttendance: 45,
      ameer: 'Farooq Bhai'
    },
    {
      id: 'oct-2025-family',
      title: "October 2025 Family Ijthema",
      type: 'family',
      date: '2025-10-11',
      displayDate: 'Sat, 11 Oct 2025',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'completed',
      volunteers: 22,
      foodItems: 28,
      actualAttendance: 68,
      ameer: 'Ibrahim Bhai'
    },
    {
      id: 'sep-2025-mens',
      title: "September 2025 Men's Ijthema",
      type: 'mens',
      date: '2025-09-13',
      displayDate: 'Sat, 13 Sep 2025',
      time: '6:00 PM',
      venue: 'Community Hall',
      status: 'completed',
      volunteers: 16,
      foodItems: 18,
      actualAttendance: 42,
      ameer: 'Farooq Bhai'
    },
  ];

  // Stats
  const stats = {
    totalEvents: events.length,
    totalVolunteers: 45,
    totalContributors: 28,
    totalAttendees: 340
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return event.status === 'planning';
    if (activeTab === 'mens') return event.type === 'mens';
    if (activeTab === 'family') return event.type === 'family';
    if (activeTab === 'completed') return event.status === 'completed';
    return true;
  });

  // Tabs
  const tabs = [
    { id: 'all', label: 'All', count: events.length },
    { id: 'upcoming', label: 'Upcoming', count: events.filter(e => e.status === 'planning').length },
    { id: 'mens', label: "👨 Men's", count: events.filter(e => e.type === 'mens').length },
    { id: 'family', label: '👨‍👩‍👧 Family', count: events.filter(e => e.type === 'family').length },
    { id: 'completed', label: '✅ Completed', count: events.filter(e => e.status === 'completed').length },
  ];

  // Get status badge style
  const getStatusBadge = (status) => {
    const badges = {
      planning: { bg: '#fef3c7', color: '#92400e', label: '🟡 Planning' },
      active: { bg: '#dbeafe', color: '#1e40af', label: '🔵 Active' },
      completed: { bg: '#f0fdf4', color: '#166534', label: '✅ Completed' }
    };
    return badges[status] || badges.planning;
  };

  // Get type badge style
  const getTypeBadge = (type) => {
    const badges = {
      mens: { bg: '#dbeafe', color: '#1e40af', label: "👨 Men's" },
      family: { bg: '#fce7f3', color: '#9d174d', label: '👨‍👩‍👧 Family' }
    };
    return badges[type] || badges.mens;
  };

  // Styles
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1e3a5f',
      margin: 0
    },
    totalBadge: {
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '14px'
    },
    addButton: {
      backgroundColor: '#22c55e',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: (borderColor) => ({
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderLeft: `4px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }),
    statIcon: {
      fontSize: '32px'
    },
    statValue: (color) => ({
      fontSize: '28px',
      fontWeight: 'bold',
      color: color
    }),
    statLabel: {
      fontSize: '13px',
      color: '#6b7280'
    },
    tabsRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    tab: (isActive) => ({
      padding: '10px 20px',
      borderRadius: '20px',
      border: isActive ? 'none' : '1px solid #d1d5db',
      backgroundColor: isActive ? '#1e3a5f' : 'white',
      color: isActive ? 'white' : '#374151',
      fontSize: '13px',
      fontWeight: isActive ? '600' : '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }),
    tabCount: (isActive) => ({
      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px'
    }),
    eventsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    eventCard: (status) => ({
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: status === 'planning' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }),
    eventCardInner: {
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    eventInfo: {
      flex: 1
    },
    eventTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e3a5f',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    eventMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '10px'
    },
    eventStats: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '13px'
    },
    eventStatItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#374151'
    },
    eventActions: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '10px'
    },
    badge: (bg, color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: '20px',
      backgroundColor: bg,
      color: color,
      fontSize: '12px',
      fontWeight: '600'
    }),
    actionButton: (isPrimary) => ({
      padding: '8px 16px',
      borderRadius: '6px',
      border: isPrimary ? 'none' : '1px solid #d1d5db',
      backgroundColor: isPrimary ? '#3b82f6' : 'white',
      color: isPrimary ? 'white' : '#374151',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }),
    emptyState: {
      textAlign: 'center',
      padding: '60px 40px',
      backgroundColor: 'white',
      borderRadius: '16px',
      color: '#6b7280'
    }
  };

  return (
    <>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.pageTitle}>🗓️ Ijthema Events</h1>
          <span style={styles.totalBadge}>{stats.totalEvents} total events</span>
        </div>
        <button
          onClick={() => router.push('/events/new')}
          style={styles.addButton}
        >
          <span>+</span> Create Event
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard('#f59e0b')}>
          <span style={styles.statIcon}>📅</span>
          <div>
            <div style={styles.statValue('#f59e0b')}>{stats.totalEvents}</div>
            <div style={styles.statLabel}>Total Events</div>
          </div>
        </div>

        <div style={styles.statCard('#3b82f6')}>
          <span style={styles.statIcon}>👥</span>
          <div>
            <div style={styles.statValue('#3b82f6')}>{stats.totalVolunteers}</div>
            <div style={styles.statLabel}>Volunteers</div>
          </div>
        </div>

        <div style={styles.statCard('#22c55e')}>
          <span style={styles.statIcon}>🍛</span>
          <div>
            <div style={styles.statValue('#22c55e')}>{stats.totalContributors}</div>
            <div style={styles.statLabel}>Food Contributors</div>
          </div>
        </div>

        <div style={styles.statCard('#ec4899')}>
          <span style={styles.statIcon}>🎉</span>
          <div>
            <div style={styles.statValue('#ec4899')}>{stats.totalAttendees}</div>
            <div style={styles.statLabel}>Total Attendees</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsRow}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={styles.tab(activeTab === tab.id)}
          >
            {tab.label}
            <span style={styles.tabCount(activeTab === tab.id)}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div style={styles.eventsContainer}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => {
            const statusBadge = getStatusBadge(event.status);
            const typeBadge = getTypeBadge(event.type);

            return (
              <div
                key={event.id}
                style={styles.eventCard(event.status)}
                onClick={() => router.push(`/events/${event.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
              >
                <div style={styles.eventCardInner}>
                  <div style={styles.eventInfo}>
                    <div style={styles.eventTitle}>
                      🗓️ {event.title}
                      <span style={styles.badge(typeBadge.bg, typeBadge.color)}>
                        {typeBadge.label}
                      </span>
                    </div>
                    <div style={styles.eventMeta}>
                      <span>📍 {event.venue}</span>
                      <span>📅 {event.displayDate}</span>
                      <span>⏰ {event.time}</span>
                      <span>👤 Ameer: {event.ameer}</span>
                    </div>
                    <div style={styles.eventStats}>
                      <span style={styles.eventStatItem}>
                        👥 <strong>{event.volunteers}</strong> volunteers
                      </span>
                      <span style={styles.eventStatItem}>
                        🍛 <strong>{event.foodItems}</strong> food items
                      </span>
                      {event.status === 'completed' ? (
                        <span style={styles.eventStatItem}>
                          🎉 <strong>{event.actualAttendance}</strong> attended
                        </span>
                      ) : (
                        <span style={styles.eventStatItem}>
                          📊 <strong>{event.expectedAttendance}</strong> expected
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={styles.eventActions}>
                    <span style={styles.badge(statusBadge.bg, statusBadge.color)}>
                      {statusBadge.label}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {event.status === 'planning' ? (
                        <>
                          <button
                            style={styles.actionButton(false)}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/events/${event.id}`);
                            }}
                          >
                            👁️ View
                          </button>
                          <button
                            style={styles.actionButton(true)}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/events/${event.id}`);
                            }}
                          >
                            ✏️ Plan
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            style={styles.actionButton(false)}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/events/${event.id}`);
                            }}
                          >
                            📋 Summary
                          </button>
                          <button
                            style={styles.actionButton(true)}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Report feature coming in Phase 2!');
                            }}
                          >
                            📊 Report
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗓️</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              No events found
            </div>
            <div style={{ marginBottom: '16px' }}>
              {activeTab !== 'all' ? 'Try selecting a different filter' : 'Create your first event to get started'}
            </div>
            {activeTab === 'all' && (
              <button
                onClick={() => router.push('/events/new')}
                style={styles.addButton}
              >
                + Create Event
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}