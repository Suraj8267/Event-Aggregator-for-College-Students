import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { utilAPI, eventAPI } from '../services/api';

const Register = () => {
  const location = useLocation();
  const eventInfo = location.state; // Get event info if coming from event registration
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    department: '',
    year: '',
    is_organizer: false
  });
  
  // Complete department list matching backend
  const [departments, setDepartments] = useState([
    'Computer Science and Engineering',
    'Computer Science and Engineering (Artifcial Intelligence and Machine Learning)',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics and Communication Engineering'
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await utilAPI.getDepartments();
      const deptList = response.data.departments.filter(dept => dept !== 'All Departments');
      if (deptList.length > 0) {
        setDepartments(deptList);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Using fallback departments already set in state
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
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.department || !formData.year) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccess('Registration successful!');
      
      // If registering for an event, register for it automatically
      if (eventInfo && eventInfo.eventId) {
        try {
          await eventAPI.register(eventInfo.eventId);
          setSuccess(`Account created and registered for ${eventInfo.eventTitle}!`);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } catch (error) {
          console.error('Event registration error:', error);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      } else {
        // Regular registration, redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create New Account</h2>
        
        {eventInfo && (
          <div style={{
            background: '#e0e7ff',
            border: '1px solid #6366f1',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#4338ca'
          }}>
            <strong>📅 Registering for Event</strong>
            <p style={{ margin: '5px 0 0 0' }}>
              {eventInfo.eventTitle}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              Create an account to register for this event
            </p>
          </div>
        )}
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="At least 6 characters"
            />
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
            <label>Year *</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : eventInfo ? 'Create Account & Register for Event' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
