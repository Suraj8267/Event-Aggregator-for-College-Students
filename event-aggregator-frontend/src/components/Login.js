import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [loginType, setLoginType] = useState('student'); // 'student' or 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Get user data to check if admin
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Validate login type matches user role
      if (loginType === 'admin' && !userData.is_admin) {
        setError('Invalid admin credentials. Please use Student/User login.');
        setLoading(false);
        return;
      }
      
      if (loginType === 'student' && userData.is_admin) {
        setError('This is an admin account. Please use Admin login.');
        setLoading(false);
        return;
      }
      
      // Redirect based on user type
      if (userData && userData.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        
        {/* Login Type Selection */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '25px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            type="button"
            onClick={() => setLoginType('student')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: loginType === 'student' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
              color: loginType === 'student' ? 'white' : '#6b7280',
              fontWeight: '600',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '15px'
            }}
          >
            👨‍🎓 Student / User
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: loginType === 'admin' ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'transparent',
              color: loginType === 'admin' ? 'white' : '#6b7280',
              fontWeight: '600',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '15px'
            }}
          >
            🛡️ Admin
          </button>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{
              background: loginType === 'admin' 
                ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
                : 'linear-gradient(135deg, #6366f1, #818cf8)'
            }}
          >
            {loading ? 'Logging in...' : `Login as ${loginType === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        {loginType === 'student' && (
          <div className="auth-footer">
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '15px' }}>
              New user? Register through event registration
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
