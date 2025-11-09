import React, { useState, useEffect } from 'react';
import { utilAPI } from '../services/api';

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    department: '',
    venue: '',
    date_time: '',
    end_time: '',
    max_participants: '',
    contact_email: '',
    contact_phone: '',
    registration_deadline: '',
    is_featured: false
  });
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFormData();
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || '',
        department: event.department || '',
        venue: event.venue || '',
        date_time: event.date_time ? event.date_time.slice(0, 16) : '',
        end_time: event.end_time ? event.end_time.slice(0, 16) : '',
        max_participants: event.max_participants || '',
        contact_email: event.contact_email || '',
        contact_phone: event.contact_phone || '',
        registration_deadline: event.registration_deadline ? event.registration_deadline.slice(0, 16) : '',
        is_featured: event.is_featured || false
      });
    }
  }, [event]);

  const fetchFormData = async () => {
    try {
      const [categoriesRes, departmentsRes] = await Promise.all([
        utilAPI.getCategories(),
        utilAPI.getDepartments()
      ]);
      setCategories(categoriesRes.data.categories);
      setDepartments(departmentsRes.data.departments);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Venue *</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date & Time *</label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date & Time *</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Registration Deadline</label>
          <input
            type="datetime-local"
            name="registration_deadline"
            value={formData.registration_deadline}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Maximum Participants</label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Contact Email *</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Phone</label>
          <input
            type="tel"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          required
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleChange}
          />
          Feature this event
        </label>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : (event ? 'Update Event' : 'Create Event')}
        </button>
      </div>
    </form>
  );
};

export default EventForm;