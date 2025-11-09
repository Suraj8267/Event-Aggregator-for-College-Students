import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import Notification from './Notification';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll(true);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fas fa-calendar-alt"></i>
          Event Aggregator
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/events" className="nav-link">Events</Link>
          
          {user ? (
            <>
              {/* Show different links based on user role */}
              {user.is_admin ? (
                <>
                  <Link to="/admin" className="nav-link" style={{ color: '#f59e0b', fontWeight: '600' }}>
                    <i className="fas fa-shield-alt"></i> Admin Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-link">
                    <i className="fas fa-th-large"></i> My Dashboard
                  </Link>
                  <Link to="/certificates" className="nav-link">
                    <i className="fas fa-certificate"></i> Certificates
                  </Link>
                </>
              )}
              
              <div className="nav-user">
                <div className="notification-container">
                  <button 
                    className="notification-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="fas fa-bell"></i>
                    {notifications.length > 0 && (
                      <span className="notification-badge">{notifications.length}</span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h4>Notifications</h4>
                        {notifications.length > 0 && (
                          <button 
                            className="mark-read-btn"
                            onClick={markAllAsRead}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="notification-list">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <Notification 
                              key={notification.id} 
                              notification={notification}
                              onRead={fetchNotifications}
                            />
                          ))
                        ) : (
                          <p className="no-notifications">No new notifications</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/profile" className="nav-link">
                  <i className="fas fa-user"></i>
                  {user.username}
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Login</Link>
              {/* Register button removed - users register through events */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
