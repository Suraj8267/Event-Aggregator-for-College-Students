import React from 'react';
import { notificationAPI } from '../services/api';
import { formatDate } from '../utils';

const Notification = ({ notification, onRead }) => {
  const handleMarkAsRead = async () => {
    try {
      await notificationAPI.markAsRead(notification.id);
      if (onRead) onRead();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.notification_type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'error':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
      <div className="notification-icon">
        <i className={getNotificationIcon()}></i>
      </div>
      <div className="notification-content">
        <h5>{notification.title}</h5>
        <p>{notification.message}</p>
        <span className="notification-time">
          {formatDate(notification.created_at)}
        </span>
      </div>
      {!notification.is_read && (
        <button 
          className="mark-read-btn"
          onClick={handleMarkAsRead}
          title="Mark as read"
        >
          <i className="fas fa-check"></i>
        </button>
      )}
    </div>
  );
};

export default Notification;