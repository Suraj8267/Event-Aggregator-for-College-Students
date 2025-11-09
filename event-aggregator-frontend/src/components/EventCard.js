import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import { formatDate, isRegistrationOpen } from '../utils';
import EventDetailsModal from './EventDetailsModal';

const EventCard = ({ event, onUpdate, showActions = true }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(event.is_registered || false);
  const [showModal, setShowModal] = useState(false);

  const handleRegister = async () => {
    // If user not logged in, redirect to register page with event info
    if (!user) {
      navigate('/register', { state: { eventId: event.id, eventTitle: event.title } });
      return;
    }

    // If logged in, register directly for the event
    setLoading(true);
    try {
      await eventAPI.register(event.id);
      setIsRegistered(true);
      if (onUpdate) onUpdate();
      alert('Successfully registered for the event!');
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      await eventAPI.unregister(event.id);
      setIsRegistered(false);
      if (onUpdate) onUpdate();
      alert('Successfully unregistered from the event!');
    } catch (error) {
      alert(error.response?.data?.message || 'Unregistration failed');
    } finally {
      setLoading(false);
    }
  };

  const canRegister = isRegistrationOpen(event) && !isRegistered;

  return (
    <>
      <div className="event-card">
        <div className="event-image">
          <img 
            src={event.image_url || 'https://via.placeholder.com/300x200/3498db/FFFFFF?text=Event+Image'} 
            alt={event.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/3498db/FFFFFF?text=Event+Image';
            }}
          />
          {event.is_featured && <span className="featured-badge">Featured</span>}
        </div>

        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-description">
            {event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description
            }
          </p>

          <div className="event-details">
            <div className="event-detail">
              <i className="fas fa-calendar"></i>
              <span>{formatDate(event.date_time)}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.venue}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-tag"></i>
              <span>{event.category}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-users"></i>
              <span>
                {event.current_participants} / {event.max_participants || '∞'} participants
              </span>
            </div>
          </div>

          <div className="event-organizer">
            <i className="fas fa-building"></i>
            <span>Organized by: {event.organizer || event.department}</span>
          </div>

          {showActions && (
            <div className="event-actions">
              {user && event.created_by === user.id ? (
                <div className="owner-actions">
                  <button className="btn btn-edit">Edit Event</button>
                  <button className="btn btn-danger">Delete</button>
                </div>
              ) : (
                <>
                  {isRegistered ? (
                    <button 
                      className="btn btn-warning"
                      onClick={handleUnregister}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Unregister'}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={handleRegister}
                      disabled={loading || !canRegister}
                    >
                      {loading ? 'Processing...' : 
                       canRegister ? 'Register for Event' : 'Registration Closed'}
                    </button>
                  )}
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-info-circle"></i> View Details
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showModal && (
        <EventDetailsModal
          event={event}
          onClose={() => setShowModal(false)}
          onRegister={handleRegister}
          isRegistered={isRegistered}
        />
      )}
    </>
  );
};

export default EventCard;
