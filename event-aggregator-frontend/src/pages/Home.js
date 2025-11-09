import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';

const Home = () => {
  const { user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalParticipants: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredResponse, eventsResponse] = await Promise.all([
        eventAPI.getFeatured(),
        eventAPI.getAll({ upcoming: true, limit: 1 })
      ]);

      setFeaturedEvents(featuredResponse.data.events);
      
      // Calculate basic stats
      if (eventsResponse.data.events.length > 0) {
        setStats({
          totalEvents: eventsResponse.data.pagination?.total || 0,
          upcomingEvents: eventsResponse.data.events.length,
          totalParticipants: eventsResponse.data.events.reduce(
            (sum, event) => sum + event.current_participants, 0
          )
        });
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to College Event Aggregator</h1>
          <p>Discover, register, and manage all college events in one place</p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-large">
              Browse Events
            </Link>
            {user && user.is_organizer && (
              <Link to="/create-event" className="btn btn-secondary btn-large">
                Create Event
              </Link>
            )}
            {!user && (
              <Link to="/register" className="btn btn-secondary btn-large">
                Join Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <i className="fas fa-calendar"></i>
            <h3>{stats.totalEvents}+</h3>
            <p>Total Events</p>
          </div>
          <div className="stat-item">
            <i className="fas fa-users"></i>
            <h3>{stats.totalParticipants}+</h3>
            <p>Participants</p>
          </div>
          <div className="stat-item">
            <i className="fas fa-rocket"></i>
            <h3>{stats.upcomingEvents}+</h3>
            <p>Upcoming Events</p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="featured-events">
        <div className="container">
          <h2>Featured Events</h2>
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : featuredEvents.length > 0 ? (
            <div className="events-grid">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No featured events at the moment.</p>
              <Link to="/events" className="btn btn-primary">
                Browse All Events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Use Event Aggregator?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-search"></i>
              <h3>Discover Events</h3>
              <p>Find all college events in one centralized platform</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-ticket-alt"></i>
              <h3>Easy Registration</h3>
              <p>Register for events with just one click</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-bell"></i>
              <h3>Get Notified</h3>
              <p>Receive notifications for events you're interested in</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-plus-circle"></i>
              <h3>Create Events</h3>
              <p>Organizers can easily create and manage events</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;