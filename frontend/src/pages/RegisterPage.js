import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

const roleOptions = [
  { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️', desc: 'Submit bandage scans' },
  { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️', desc: 'View patient analytics' },
  { value: 'admin', label: 'Admin', icon: '⚙️', desc: 'Manage the system' },
];

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

  return (
    <div className="auth-bg">

      {/* ── Left Panel ──────────────────────────────── */}
      <div className="auth-panel-left">
        {/* Floating orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[
            { size: 220, color: 'rgba(168,85,247,0.1)', top: '15%', left: '25%', dur: '9s' },
            { size: 160, color: 'rgba(79,142,247,0.08)', top: '60%', left: '55%', dur: '12s' },
          ].map((orb, i) => (
            <div key={i} style={{
              position: 'absolute', width: orb.size, height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              top: orb.top, left: orb.left, borderRadius: '50%',
              animation: `float ${orb.dur} ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 380 }}>
          <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Logo size={48} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>pH Bandage</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Smart Wound Care System</div>
            </div>
          </div>

          <h1 style={{
            fontSize: 30, fontWeight: 900, color: 'var(--text-primary)',
            lineHeight: 1.25, letterSpacing: '-0.7px', marginBottom: 12,
          }}>
            Join the clinical<br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #4f8ef7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>care platform</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
            Create your account to start monitoring wound infections
            with advanced pH analysis.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 12 }}>
            {['HIPAA Ready', 'Role Based', 'Smart Scan'].map((t, i) => (
              <div key={i} style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600,
                background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.18)',
                borderRadius: 'var(--radius-full)', color: 'var(--blue)',
              }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────── */}
      <div className="auth-panel-right">
        <div className="auth-card fade-in" style={{ maxWidth: 440 }}>
          <div className="auth-card-inner">

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 4 }}>
                Create Account
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                Fill in your details to get started
              </p>
            </div>

            {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  id="register-name" className="form-input" type="text"
                  name="name" value={formData.name} onChange={handleChange}
                  required placeholder="Dr. Jane Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  id="register-email" className="form-input" type="email"
                  name="email" value={formData.email} onChange={handleChange}
                  required placeholder="jane@hospital.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  id="register-password" className="form-input" type="password"
                  name="password" value={formData.password} onChange={handleChange}
                  required placeholder="Min. 6 characters"
                />
              </div>

              {/* Role picker */}
              <div className="form-group">
                <label className="form-label">Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {roleOptions.map(opt => (
                    <button
                      key={opt.value} type="button" id={`role-${opt.value}`}
                      onClick={() => setFormData(f => ({ ...f, role: opt.value }))}
                      style={{
                        background: formData.role === opt.value ? 'rgba(79,142,247,0.12)' : 'rgba(255,255,255,0.025)',
                        border: `1.5px solid ${formData.role === opt.value ? 'rgba(79,142,247,0.45)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)', padding: '10px 8px',
                        cursor: 'pointer', color: formData.role === opt.value ? 'var(--blue)' : 'var(--text-secondary)',
                        fontSize: 12, fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>
                      {opt.label}
                      <span style={{ fontSize: 10, opacity: 0.7, textAlign: 'center' }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Department <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></label>
                <input
                  id="register-department" className="form-input" type="text"
                  name="department" value={formData.department} onChange={handleChange}
                  placeholder="e.g. Wound Care Unit"
                />
              </div>

              <button
                id="register-submit" type="submit" className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}
              >
                {loading
                  ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating account...</>
                  : <>Create Account <span style={{ opacity: 0.8 }}>→</span></>
                }
              </button>
            </form>

            <div className="divider" style={{ marginTop: 20, marginBottom: 14 }} />
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
