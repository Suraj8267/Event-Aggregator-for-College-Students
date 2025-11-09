import React from 'react';
import { formatDate } from '../utils';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose, onRegister, isRegistered }) => {
  if (!event) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {/* Event Poster */}
        <div className="modal-header">
          <img 
            src={event.image_url || 'https://via.placeholder.com/800x400/3498db/FFFFFF?text=Event+Poster'} 
            alt={event.title}
            className="modal-poster"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400/3498db/FFFFFF?text=Event+Poster';
            }}
          />
          {event.is_featured && (
            <span className="modal-featured-badge">
              <i className="fas fa-star"></i> Featured
            </span>
          )}
        </div>

        {/* Event Details */}
        <div className="modal-body">
          <h2 className="modal-title">{event.title}</h2>
          
          <div className="modal-category">
            <span className="category-badge">{event.category}</span>
          </div>

          <div className="modal-info-grid">
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Date & Time</div>
                <div className="info-value">{formatDate(event.date_time)}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Venue</div>
                <div className="info-value">{event.venue}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Organized By</div>
                <div className="info-value">{event.organizer}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Department</div>
                <div className="info-value">{event.department}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Participants</div>
                <div className="info-value">
                  {event.current_participants} / {event.max_participants || '∞'}
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Registration Deadline</div>
                <div className="info-value">
                  {event.registration_deadline 
                    ? formatDate(event.registration_deadline)
                    : 'Open'}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-description">
            <h3>About This Event</h3>
            <p>{event.description}</p>
          </div>

          {event.organizer && (
            <div className="modal-organizer-info">
              <i className="fas fa-info-circle"></i>
              <span>Organized by <strong>{event.organizer}</strong></span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-footer">
          {isRegistered ? (
            <button className="modal-btn btn-registered" disabled>
              <i className="fas fa-check-circle"></i>
              Already Registered
            </button>
          ) : (
            <button className="modal-btn btn-register" onClick={() => onRegister(event)}>
              <i className="fas fa-user-plus"></i>
              Register for Event
            </button>
          )}
          <button className="modal-btn btn-close-modal" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
