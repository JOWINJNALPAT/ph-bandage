import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      login(response.data.token, response.data.user);
      navigate(`/${response.data.user.role}-dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    const creds = {
      admin: { email: 'admin@hospital.com', password: 'password123' },
      doctor: { email: 'sarah@hospital.com', password: 'password123' },
      nurse: { email: 'emily@hospital.com', password: 'password123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #4f8ef7, #22d3ee)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            margin: '0 auto 16px'
          }}>🩹</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            pH Bandage
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
            Smart Wound Infection Detection System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@hospital.com"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 16
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn-primary pulse-glow"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
          >
            {loading ? <><span className="spinner"></span> Signing in...</> : 'Sign In →'}
          </button>
        </form>

        {/* Quick Login */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Quick Demo Login</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { role: 'admin', label: 'Admin', icon: '⚙️', color: 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.3)', textColor: '#a855f7' },
              { role: 'doctor', label: 'Doctor', icon: '👨‍⚕️', color: 'rgba(79,142,247,0.15)', borderColor: 'rgba(79,142,247,0.3)', textColor: '#4f8ef7' },
              { role: 'nurse', label: 'Nurse', icon: '👩‍⚕️', color: 'rgba(34,211,238,0.15)', borderColor: 'rgba(34,211,238,0.3)', textColor: '#22d3ee' },
            ].map(({ role, label, icon, color, borderColor, textColor }) => (
              <button
                key={role}
                id={`quick-login-${role}`}
                type="button"
                onClick={() => quickLogin(role)}
                style={{
                  background: color,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 10,
                  padding: '10px 8px',
                  cursor: 'pointer',
                  color: textColor,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 18 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
