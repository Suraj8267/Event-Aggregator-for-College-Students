import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import '../styles/AdminDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's registered events
      const eventsResponse = await eventAPI.getMyEvents();
      const events = eventsResponse.data.registered_events || [];
      
      setMyEvents(events);
      
      // Separate upcoming and past events
      const now = new Date();
      setUpcomingEvents(events.filter(e => new Date(e.date_time) > now));
      setPastEvents(events.filter(e => new Date(e.date_time) <= now));
      
      // Mock certificates for now
      setCertificates([
        { id: 1, eventName: 'AI Hackathon', issueDate: '2024-11-15', status: 'Completed' },
        { id: 2, eventName: 'Web Workshop', issueDate: '2024-10-20', status: 'Completed' }
      ]);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1>👨‍🎓 My Dashboard</h1>
            <p>Welcome back, {user?.username}! Track your events and achievements</p>
            <div className="admin-user-info">
              <i className="fas fa-user-circle"></i>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card stat-primary">
            <div className="stat-header">
              <div className="stat-icon icon-primary">
                <i className="fas fa-calendar-check"></i>
              </div>
            </div>
            <div className="stat-value">{myEvents.length}</div>
            <div className="stat-label">Total Registrations</div>
          </div>

          <div className="admin-stat-card stat-success">
            <div className="stat-header">
              <div className="stat-icon icon-success">
                <i className="fas fa-clock"></i>
              </div>
            </div>
            <div className="stat-value">{upcomingEvents.length}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>

          <div className="admin-stat-card stat-warning">
            <div className="stat-header">
              <div className="stat-icon icon-warning">
                <i className="fas fa-certificate"></i>
              </div>
            </div>
            <div className="stat-value">{certificates.length}</div>
            <div className="stat-label">Certificates Earned</div>
          </div>

          <div className="admin-stat-card stat-danger">
            <div className="stat-header">
              <div className="stat-icon icon-danger">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <div className="stat-value">{pastEvents.length}</div>
            <div className="stat-label">Completed Events</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #e5e7eb' }}>
          {['overview', 'upcoming', 'past', 'certificates'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === tab ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                color: activeTab === tab ? 'white' : '#6b7280',
                fontWeight: '600',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>📊 Quick Overview</h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="admin-table-container">
                <h3>🔜 Next Events</h3>
                <div className="certificates-grid-enhanced">
                  {upcomingEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="certificate-card-enhanced">
                      <div className="certificate-content-enhanced">
                        <h3>{event.title}</h3>
                        <p><i className="fas fa-calendar"></i> {new Date(event.date_time).toLocaleDateString()}</p>
                        <p><i className="fas fa-map-marker-alt"></i> {event.venue}</p>
                        <button 
                          className="certificate-btn btn-download"
                          onClick={() => navigate(`/events`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <h3>No upcoming events</h3>
                <p>Browse and register for events</p>
                <button 
                  className="certificate-btn btn-download"
                  onClick={() => navigate('/events')}
                >
                  Browse Events
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="admin-table-container">
            <h2>🔜 Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map(event => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td><span className="event-category-badge">{event.category}</span></td>
                      <td>{new Date(event.date_time).toLocaleDateString()}</td>
                      <td>{event.venue}</td>
                      <td><span className="status-badge badge-active">Registered</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <h3>No upcoming events</h3>
                <p>Register for events to see them here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="admin-table-container">
            <h2>✅ Past Events</h2>
            {pastEvents.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Attendance</th>
                    <th>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {pastEvents.map(event => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td><span className="event-category-badge">{event.category}</span></td>
                      <td>{new Date(event.date_time).toLocaleDateString()}</td>
                      <td><span className="status-badge badge-completed">Attended</span></td>
                      <td>
                        <button className="btn-icon btn-view">
                          <i className="fas fa-download"></i> Get Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <h3>No past events</h3>
                <p>Your completed events will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>🏆 My Certificates</h2>
            <button 
              className="certificate-btn btn-download"
              onClick={() => navigate('/certificates')}
              style={{ marginBottom: '20px' }}
            >
              <i className="fas fa-certificate"></i> View All Certificates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
