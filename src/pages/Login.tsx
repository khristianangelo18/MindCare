import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const res = await signIn(email, password, 'Patient');
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      {/* Floating Theme Toggle Button */}
      <button className="theme-toggle-btn" id="themeToggle" onClick={toggleTheme}>
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="2" x2="12" y2="3"></line>
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

      {/* Right Side: Login Form */}
      <div className="login-form-side">
        <div className="login-container">
          <h3 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0' }}>Hello Again!</h3>
          <small style={{ display: 'block', marginBottom: '24px', color: 'var(--muted)', fontSize: '14px' }}>Welcome Back</small>

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
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <span style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#99A3AE',
                pointerEvents: 'none'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                  <polyline points="22,7 12,13 2,7"></polyline>
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{ paddingLeft: '52px' }}
                required
              />
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <span style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#99A3AE',
                pointerEvents: 'none'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{ paddingLeft: '52px', paddingRight: '48px' }}
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

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#7c8a99', textDecoration: 'none', fontSize: '14px' }}>
              Forgot Password?
            </Link>
            <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--muted)' }}>
              <span>No account yet? </span>
              <Link to="/register" style={{ color: 'var(--teal-2)', fontWeight: 600, textDecoration: 'none' }}>
                Sign up!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
