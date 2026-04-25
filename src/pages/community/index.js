// ===================================================================
// 🐪 Camel Community Page - Members Management
// ===================================================================
// Location: src/pages/community/index.js
// Route: /community
// Description: Manage volunteers, beneficiaries, attendees, subscribers
// ===================================================================

import { useState } from 'react';
import { useRouter } from 'next/router';


export default function Community() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample members data
  const members = [
    { id: '001', name: 'Nawaz Mohammed', email: 'nawaz5124@gmail.com', type: 'volunteer', status: 'active', since: '01/2024', dbs: 'verified', phone: '07879921917' },
    { id: '002', name: 'Moin Bhavikatti', email: 'moinsary@gmail.com', type: 'subscriber', status: 'active', since: '03/2023', dbs: null, phone: '07123456789' },
    { id: '003', name: 'Ibrahim Khan', email: 'ibrahim@gmail.com', type: 'volunteer', status: 'active', since: '06/2022', dbs: 'verified', phone: '07111222333' },
    { id: '004', name: 'Farooq Khan', email: 'farooq.khan@gmail.com', type: 'beneficiary', status: 'open', since: '06/2025', dbs: null, phone: '07444555666' },
    { id: '005', name: 'Khaja Miya', email: 'khaja@gmail.com', type: 'attendee', status: 'Iftar 2025', since: '03/2025', dbs: null, phone: '07777888999' },
    { id: '006', name: 'Fayaz Ahmed', email: 'fayaz@gmail.com', type: 'volunteer', status: 'active', since: '09/2023', dbs: 'verified', phone: '07222333444' },
    { id: '007', name: 'Safyan Ali', email: 'safyan@gmail.com', type: 'subscriber', status: 'active', since: '11/2024', dbs: null, phone: '07555666777' },
    { id: '008', name: 'Riyaz Bhai', email: 'riyaz@gmail.com', type: 'volunteer', status: 'pending', since: '11/2025', dbs: 'pending', phone: '07888999000' },
    { id: '009', name: 'Ahmed Hassan', email: 'ahmed.h@gmail.com', type: 'beneficiary', status: 'closed', since: '02/2024', dbs: null, phone: '07333444555' },
    { id: '010', name: 'Mustafa Karim', email: 'mustafa@gmail.com', type: 'subscriber', status: 'active', since: '05/2023', dbs: null, phone: '07666777888' },
    { id: '011', name: 'Hamdan Sheikh', email: 'hamdan@gmail.com', type: 'volunteer', status: 'active', since: '08/2022', dbs: 'verified', phone: '07999000111' },
    { id: '012', name: 'Wajahath Ali', email: 'wajahath@gmail.com', type: 'attendee', status: 'Dec 2025 Family', since: '12/2025', dbs: null, phone: '07000111222' },
    { id: '013', name: 'Zakir Hussain', email: 'zakir@gmail.com', type: 'subscriber', status: 'inactive', since: '01/2022', dbs: null, phone: '07111222333' },
    { id: '014', name: 'Sakif Rahman', email: 'sakif@gmail.com', type: 'volunteer', status: 'active', since: '04/2024', dbs: 'verified', phone: '07222333444' },
    { id: '015', name: 'Munif Ahmed', email: 'munif@gmail.com', type: 'beneficiary', status: 'open', since: '09/2025', dbs: null, phone: '07333444555' },
  ];

  // Stats
  const stats = {
    volunteers: { count: 45, dbsVerified: 12 },
    beneficiaries: { count: 120, openCases: 18 },
    attendees: { count: 340, lastEvent: 'Monthly 2025' },
    subscribers: { count: 892, newThisMonth: 23 }
  };

  const totalMembers = stats.volunteers.count + stats.beneficiaries.count + stats.attendees.count + stats.subscribers.count;

  // Tabs
  const tabs = [
    { id: 'all', label: 'All', count: totalMembers },
    { id: 'volunteer', label: '🙋 Volunteers', count: stats.volunteers.count },
    { id: 'beneficiary', label: '🤲 Beneficiaries', count: stats.beneficiaries.count },
    { id: 'attendee', label: '🎉 Attendees', count: stats.attendees.count },
    { id: 'subscriber', label: '📧 Subscribers', count: stats.subscribers.count },
  ];

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesTab = activeTab === 'all' || member.type === activeTab;
    const matchesType = typeFilter === 'all' || member.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || member.status.toLowerCase() === statusFilter;
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.includes(searchQuery);
    
    return matchesTab && matchesType && matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle member selection
  const toggleMember = (id) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Toggle all members
  const toggleAll = () => {
    if (selectedMembers.length === paginatedMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(paginatedMembers.map(m => m.id));
    }
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const badges = {
      volunteer: { bg: '#dbeafe', color: '#1e40af', label: '🙋 Volunteer' },
      beneficiary: { bg: '#fce7f3', color: '#9d174d', label: '🤲 Beneficiary' },
      attendee: { bg: '#fef3c7', color: '#92400e', label: '🎉 Attendee' },
      subscriber: { bg: '#f3e8ff', color: '#7c3aed', label: '📧 Subscriber' }
    };
    return badges[type] || badges.subscriber;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active') return { bg: '#f0fdf4', color: '#166534', label: '✅ Active' };
    if (statusLower === 'pending') return { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' };
    if (statusLower === 'open') return { bg: '#dbeafe', color: '#1e40af', label: '📂 Open' };
    if (statusLower === 'closed') return { bg: '#f3f4f6', color: '#6b7280', label: '✓ Closed' };
    if (statusLower === 'inactive') return { bg: '#fef2f2', color: '#991b1b', label: '❌ Inactive' };
    // For event names (attendees)
    return { bg: '#fef3c7', color: '#92400e', label: status };
  };

  // Get DBS badge
  const getDBSBadge = (dbs) => {
    if (dbs === 'verified') return { bg: '#f0fdf4', color: '#166534', label: 'DBS ✅' };
    if (dbs === 'pending') return { bg: '#fef3c7', color: '#92400e', label: 'DBS ⏳' };
    return null;
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
    statCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden'
    },
    statIcon: {
      fontSize: '36px'
    },
    statContent: {
      flex: 1
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1e3a5f'
    },
    statLabel: {
      fontSize: '13px',
      color: '#6b7280'
    },
    statExtra: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      fontSize: '11px',
      padding: '4px 8px',
      borderRadius: '12px'
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
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    },
    searchInput: {
      flex: 1,
      minWidth: '250px',
      padding: '12px 16px',
      paddingLeft: '40px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      outline: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '12px center',
      backgroundSize: '20px'
    },
    select: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'white',
      minWidth: '130px',
      cursor: 'pointer'
    },
    actionButton: (bg, color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 20px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: bg,
      color: color,
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer'
    }),
    tableCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '14px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    td: {
      padding: '14px 16px',
      fontSize: '13px',
      color: '#374151',
      borderBottom: '1px solid #f3f4f6'
    },
    rowHighlight: {
      backgroundColor: '#fffbeb'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    idLink: {
      color: '#3b82f6',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    nameCell: {
      fontWeight: '600',
      color: '#1e3a5f'
    },
    badge: (bg, color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '12px',
      backgroundColor: bg,
      color: color,
      fontSize: '11px',
      fontWeight: '600'
    }),
    actionIcon: {
      padding: '6px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: '16px',
      marginRight: '4px'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      backgroundColor: '#f9fafb',
      borderTop: '1px solid #e5e7eb'
    },
    pageInfo: {
      fontSize: '13px',
      color: '#6b7280'
    },
    pageButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    pageButton: (isActive) => ({
      minWidth: '36px',
      height: '36px',
      padding: '0 12px',
      borderRadius: '8px',
      border: isActive ? 'none' : '1px solid #d1d5db',
      backgroundColor: isActive ? '#1e3a5f' : 'white',
      color: isActive ? 'white' : '#374151',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    })
  };

  return (
    <>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.pageTitle}>🐪 Camel Community</h1>
          <span style={styles.totalBadge}>{totalMembers.toLocaleString()} total members</span>
        </div>
        <button
          onClick={() => alert('Add Member feature coming soon!')}
          style={styles.addButton}
        >
          <span>+</span> Add Member
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {/* Volunteers */}
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🙋</span>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.volunteers.count}</div>
            <div style={styles.statLabel}>Volunteers</div>
          </div>
          <span style={{ ...styles.statExtra, backgroundColor: '#f0fdf4', color: '#166534' }}>
            {stats.volunteers.dbsVerified} DBS verified ✅
          </span>
        </div>

        {/* Beneficiaries */}
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🤲</span>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.beneficiaries.count}</div>
            <div style={styles.statLabel}>Beneficiaries (students)</div>
          </div>
          <span style={{ ...styles.statExtra, backgroundColor: '#dbeafe', color: '#1e40af' }}>
            {stats.beneficiaries.openCases} open cases 📂
          </span>
        </div>

        {/* Attendees */}
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🎉</span>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.attendees.count}</div>
            <div style={styles.statLabel}>Event Attendees</div>
          </div>
          <span style={{ ...styles.statExtra, backgroundColor: '#fef3c7', color: '#92400e' }}>
            Last: {stats.attendees.lastEvent}
          </span>
        </div>

        {/* Subscribers */}
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📧</span>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.subscribers.count}</div>
            <div style={styles.statLabel}>Subscribers</div>
          </div>
          <span style={{ ...styles.statExtra, backgroundColor: '#f0fdf4', color: '#166534' }}>
            ↑ {stats.subscribers.newThisMonth} this month
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsRow}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            style={styles.tab(activeTab === tab.id)}
          >
            {tab.label}
            <span style={styles.tabCount(activeTab === tab.id)}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div style={styles.filterRow}>
        <input
          type="text"
          placeholder="🔍 Search by name, email, case ID..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.searchInput}
        />

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value="all">All Types ▼</option>
          <option value="volunteer">Volunteer</option>
          <option value="beneficiary">Beneficiary</option>
          <option value="attendee">Attendee</option>
          <option value="subscriber">Subscriber</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value="all">All Status ▼</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="inactive">Inactive</option>
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button
            style={styles.actionButton('#1e3a5f', 'white')}
            onClick={() => alert('Export feature coming soon!')}
          >
            📊 Export
          </button>
          <button
            style={styles.actionButton('#3b82f6', 'white')}
            onClick={() => alert('Bulk email feature coming soon!')}
          >
            ✉️ Email
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '40px' }}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th style={styles.th}>ID ↕</th>
              <th style={styles.th}>Name ↕</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Since</th>
              <th style={styles.th}></th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map(member => {
              const typeBadge = getTypeBadge(member.type);
              const statusBadge = getStatusBadge(member.status);
              const dbsBadge = getDBSBadge(member.dbs);
              const isHighlighted = member.status === 'pending' || member.dbs === 'pending';

              return (
                <tr 
                  key={member.id}
                  style={isHighlighted ? styles.rowHighlight : {}}
                >
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                    />
                  </td>
                  <td style={styles.td}>
                    <span style={styles.idLink}>{member.id}</span>
                  </td>
                  <td style={{ ...styles.td, ...styles.nameCell }}>
                    {member.name}
                  </td>
                  <td style={styles.td}>{member.email}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(typeBadge.bg, typeBadge.color)}>
                      {typeBadge.label}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(statusBadge.bg, statusBadge.color)}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td style={styles.td}>{member.since}</td>
                  <td style={styles.td}>
                    {dbsBadge && (
                      <span style={styles.badge(dbsBadge.bg, dbsBadge.color)}>
                        {dbsBadge.label}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.actionIcon}
                      title="View"
                      onClick={() => alert(`View member ${member.id}`)}
                    >
                      👁️
                    </button>
                    <button
                      style={styles.actionIcon}
                      title="Edit"
                      onClick={() => alert(`Edit member ${member.id}`)}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={styles.pagination}>
          <span style={styles.pageInfo}>
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
          </span>
          <div style={styles.pageButtons}>
            <button
              style={styles.pageButton(false)}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                style={styles.pageButton(currentPage === page)}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            {totalPages > 3 && (
              <>
                <span style={{ margin: '0 4px', color: '#6b7280' }}>...</span>
                <button
                  style={styles.pageButton(currentPage === totalPages)}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              style={{ ...styles.pageButton(false), backgroundColor: '#f3f4f6' }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Selected Members Actions */}
      {selectedMembers.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1e3a5f',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <span>{selectedMembers.length} member(s) selected</span>
          <button
            style={{ ...styles.actionButton('#3b82f6', 'white'), padding: '8px 16px' }}
            onClick={() => alert(`Send email to ${selectedMembers.length} members`)}
          >
            ✉️ Email Selected
          </button>
          <button
            style={{ ...styles.actionButton('#22c55e', 'white'), padding: '8px 16px' }}
            onClick={() => alert(`Export ${selectedMembers.length} members`)}
          >
            📊 Export
          </button>
          <button
            style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}
            onClick={() => setSelectedMembers([])}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}