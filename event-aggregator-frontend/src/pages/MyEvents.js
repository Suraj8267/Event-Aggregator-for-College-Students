import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';

const MyEvents = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState({
    created_events: [],
    registered_events: []
  });
  const [activeTab, setActiveTab] = useState('created');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await eventAPI.getMyEvents();
      setMyEvents(response.data);
    } catch (error) {
      console.error('Error fetching my events:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventsToShow = activeTab === 'created' 
    ? myEvents.created_events 
    : myEvents.registered_events;

  return (
    <div className="my-events-page">
      <div className="container">
        <div className="page-header">
          <h1>My Events</h1>
          <p>Manage events you've created and view events you've registered for</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            <i className="fas fa-plus-circle"></i>
            Created Events ({myEvents.created_events.length})
          </button>
          <button
            className={`tab ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            <i className="fas fa-ticket-alt"></i>
            Registered Events ({myEvents.registered_events.length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading your events...</div>
        ) : (
          <>
            {activeTab === 'created' && (
              <div className="created-events">
                <div className="section-header">
                  <h2>Events You've Created</h2>
                  {myEvents.created_events.length === 0 && (
                    <p className="empty-state">
                      You haven't created any events yet.{' '}
                      <a href="/create-event">Create your first event!</a>
                    </p>
                  )}
                </div>

                {myEvents.created_events.length > 0 && (
                  <div className="events-grid">
                    {myEvents.created_events.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event}
                        onUpdate={fetchMyEvents}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'registered' && (
              <div className="registered-events">
                <div className="section-header">
                  <h2>Events You've Registered For</h2>
                  {myEvents.registered_events.length === 0 && (
                    <p className="empty-state">
                      You haven't registered for any events yet.{' '}
                      <a href="/events">Browse events to get started!</a>
                    </p>
                  )}
                </div>

                {myEvents.registered_events.length > 0 && (
                  <div className="events-grid">
                    {myEvents.registered_events.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event}
                        onUpdate={fetchMyEvents}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyEvents;