import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'nurse', department: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      login(response.data.token, response.data.user);
      navigate(`/${response.data.user.role}-dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const roleOptions = [
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️', desc: 'Submit bandage scans' },
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️', desc: 'View patient analytics' },
    { value: 'admin', label: 'Admin', icon: '⚙️', desc: 'Manage the system' },
  ];

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24,
            margin: '0 auto 14px'
          }}>🩹</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Join the pH Bandage Medical Platform</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Full Name</label>
            <input
              id="register-name"
              className="form-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Dr. Jane Doe"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Email Address</label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="jane@hospital.com"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Password</label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Min. 6 characters"
            />
          </div>

          {/* Role Picker */}
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {roleOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  id={`role-${opt.value}`}
                  onClick={() => setFormData(f => ({ ...f, role: opt.value }))}
                  style={{
                    background: formData.role === opt.value
                      ? 'rgba(79,142,247,0.15)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${formData.role === opt.value ? 'rgba(79,142,247,0.5)' : 'var(--border)'}`,
                    borderRadius: 10,
                    padding: '10px 8px',
                    cursor: 'pointer',
                    color: formData.role === opt.value ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{opt.icon}</span>
                  {opt.label}
                  <span style={{ fontSize: 10, opacity: 0.7, textAlign: 'center' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="form-label">Department <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></label>
            <input
              id="register-department"
              className="form-input"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Wound Care Unit"
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }}
          >
            {loading ? <><span className="spinner"></span> Creating account...</> : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
