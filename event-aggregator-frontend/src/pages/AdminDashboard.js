import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    totalUsers: 0
  });
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.is_admin) {
      fetchAdminData();
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, categoryFilter, events]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const eventsResponse = await eventAPI.getAll({ limit: 100 });
      const eventsData = eventsResponse.data.events || [];
      
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      
      // Calculate stats
      const activeEventsCount = eventsData.filter(e => 
        e.is_active && new Date(e.date_time) > new Date()
      ).length;
      
      const totalRegistrations = eventsData.reduce((sum, e) => 
        sum + (e.current_participants || 0), 0
      );
      
      setStats({
        totalEvents: eventsData.length,
        activeEvents: activeEventsCount,
        totalRegistrations: totalRegistrations,
        totalUsers: 150 // Mock data
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }
    
    setFilteredEvents(filtered);
  };

  const handleMarkAttendance = (event) => {
    setSelectedEvent(event);
    // Mock attendance data
    setAttendanceData([
      { id: 1, name: 'John Doe', email: 'john@example.com', department: 'CSE', attended: false },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'ECE', attended: false },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', department: 'ME', attended: true },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', department: 'CSE', attended: false },
      { id: 5, name: 'David Brown', email: 'david@example.com', department: 'EE', attended: true },
    ]);
    setShowAttendanceModal(true);
  };

  const toggleAttendance = (userId) => {
    setAttendanceData(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, attended: !user.attended } : user
      )
    );
  };

  const saveAttendance = () => {
    console.log('Saving attendance for event:', selectedEvent.id);
    console.log('Attendance data:', attendanceData);
    alert('Attendance saved successfully!');
    setShowAttendanceModal(false);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(eventId);
        alert('Event deleted successfully!');
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const getStatusBadge = (event) => {
    const eventDate = new Date(event.date_time);
    const now = new Date();
    
    if (eventDate < now) {
      return <span className="status-badge badge-completed">Completed</span>;
    } else if (event.is_active) {
      return <span className="status-badge badge-active">Active</span>;
    } else {
      return <span className="status-badge badge-cancelled">Cancelled</span>;
    }
  };

  if (!user || !user.is_admin) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="empty-state">
            <i className="fas fa-lock"></i>
            <h3>Access Denied</h3>
            <p>You need administrator privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1><i className="fas fa-shield-alt"></i> Admin Dashboard</h1>
            <p>Manage events, track attendance, and monitor platform activity</p>
            <div className="admin-user-info">
              <i className="fas fa-user-circle"></i>
              <span>Welcome back, {user.username}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card stat-primary">
            <div className="stat-header">
              <div className="stat-icon icon-primary">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-trend trend-up">
                <i className="fas fa-arrow-up"></i> 12%
              </div>
            </div>
            <div className="stat-value">{stats.totalEvents}</div>
            <div className="stat-label">Total Events</div>
            <div className="stat-change">+8 this month</div>
          </div>

          <div className="admin-stat-card stat-success">
            <div className="stat-header">
              <div className="stat-icon icon-success">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-trend trend-up">
                <i className="fas fa-arrow-up"></i> 8%
              </div>
            </div>
            <div className="stat-value">{stats.activeEvents}</div>
            <div className="stat-label">Active Events</div>
            <div className="stat-change">Happening now</div>
          </div>

          <div className="admin-stat-card stat-warning">
            <div className="stat-header">
              <div className="stat-icon icon-warning">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-trend trend-up">
                <i className="fas fa-arrow-up"></i> 25%
              </div>
            </div>
            <div className="stat-value">{stats.totalRegistrations}</div>
            <div className="stat-label">Registrations</div>
            <div className="stat-change">+45 this week</div>
          </div>

          <div className="admin-stat-card stat-danger">
            <div className="stat-header">
              <div className="stat-icon icon-danger">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="stat-trend trend-up">
                <i className="fas fa-arrow-up"></i> 15%
              </div>
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-change">+12 new users</div>
          </div>
        </div>

        {/* Events Management Table */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <div className="admin-table-title">
              <i className="fas fa-list"></i>
              <h2>Event Management</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search events..."
              className="filter-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
              <option value="Seminar">Seminar</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          {/* Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <tr key={event.id}>
                      <td className="event-title-cell">{event.title}</td>
                      <td>
                        <span className="event-category-badge">{event.category}</span>
                      </td>
                      <td>{new Date(event.date_time).toLocaleDateString()}</td>
                      <td>
                        <div className="participant-count">
                          <i className="fas fa-user"></i>
                          <span>{event.current_participants}/{event.max_participants || '∞'}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(event)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-mark-attendance"
                            onClick={() => handleMarkAttendance(event)}
                            title="Mark Attendance"
                          >
                            <i className="fas fa-check"></i> Attendance
                          </button>
                          <button
                            className="btn-icon btn-view"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteEvent(event.id)}
                            title="Delete Event"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <i className="fas fa-inbox"></i>
                        <h3>No events found</h3>
                        <p>Try adjusting your filters or create a new event</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Modal */}
        {showAttendanceModal && (
          <div className="modal-overlay" onClick={() => setShowAttendanceModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <i className="fas fa-clipboard-check"></i>
                  Mark Attendance - {selectedEvent?.title}
                </h2>
                <button className="modal-close" onClick={() => setShowAttendanceModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="attendance-list">
                {attendanceData.map(student => (
                  <div key={student.id} className="attendance-item">
                    <div className="attendance-info">
                      <h4>{student.name}</h4>
                      <p>
                        <i className="fas fa-envelope"></i>
                        {student.email} | {student.department}
                      </p>
                    </div>
                    <label className="attendance-toggle">
                      <input
                        type="checkbox"
                        checked={student.attended}
                        onChange={() => toggleAttendance(student.id)}
                      />
                      <span className="attendance-slider"></span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button className="modal-btn modal-btn-secondary" onClick={() => setShowAttendanceModal(false)}>
                  Cancel
                </button>
                <button className="modal-btn modal-btn-primary" onClick={saveAttendance}>
                  <i className="fas fa-save"></i> Save Attendance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
