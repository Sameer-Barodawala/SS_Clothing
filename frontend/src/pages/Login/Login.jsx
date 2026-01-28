import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted:', formData.email);
    setLoading(true);

    try {
      console.log('Attempting login...');
      const user = await login(formData.email, formData.password);
      console.log('Login successful, user:', user);
      
      toast.success('Welcome back!');
      
      // Redirect based on user role
      const from = location.state?.from?.pathname || '/';
      
      if (user.role === 'admin') {
        console.log('Admin user detected, redirecting to dashboard...');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('Regular user, redirecting to:', from);
        navigate(from, { replace: true });
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        <div className="auth-banner">
          <div className="banner-content">
            <h2>Start Your Fashion Journey</h2>
            <p>Discover the latest trends and exclusive deals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;