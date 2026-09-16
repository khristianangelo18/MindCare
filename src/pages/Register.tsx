import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Register: React.FC = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullname || !email || !password) {
      setError('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await signUp({
      email,
      password,
      fullname,
      age: age ? parseInt(age) : undefined,
      gender,
      role: 'Patient'
    });
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="register-page">
      {/* Floating Theme Toggle Button */}
      <button className="theme-toggle-btn" id="themeToggle" onClick={toggleTheme}>
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
        <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>

      {/* Left Side: Logo + Pre-Assessment */}
      <div className="info-side">
        <img
          src="/images/MindCare.png"
          alt="MindCare Logo"
          className="logo-img"
        />
        <p className="fst-italic">Where healing meets understanding.</p>
        <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Take a Quick Pre-Assessment</p>
        <Link to="/pre-assessment" className="btn-outline-primary">
          Start Here
        </Link>
      </div>

      {/* Right Side: Registration Form */}
      <div className="login-form-side" style={{ overflowY: 'auto' }}>
        <div className="login-container" style={{ margin: 'auto 0' }}>
          <h3 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0' }}>Create Account</h3>
          <small style={{ display: 'block', marginBottom: '24px', color: 'var(--muted)', fontSize: '14px' }}>
            Join the MindCare Community
          </small>

          {error && (
            <div style={{
              background: '#ffe6e8',
              color: '#9b1c1f',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                min="1"
                max="120"
                style={{ width: '40%' }}
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ width: '60%' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                style={{ paddingRight: '48px' }}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#99A3AE'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                style={{ paddingRight: '48px' }}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#99A3AE'
                }}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
            <span>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--teal-2)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
