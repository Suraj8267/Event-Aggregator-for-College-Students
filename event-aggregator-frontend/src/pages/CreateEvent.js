import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import EventForm from '../components/EventForm';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is not an organizer
  React.useEffect(() => {
    if (!user || !user.is_organizer) {
      navigate('/events');
    }
  }, [user, navigate]);

  const handleSubmit = async (eventData) => {
    try {
      await eventAPI.create(eventData);
      alert('Event created successfully!');
      navigate('/my-events');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating event');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  if (!user || !user.is_organizer) {
    return null;
  }

  return (
    <div className="create-event-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Event</h1>
          <p>Fill in the details below to create a new event</p>
        </div>
        
        <EventForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateEvent;