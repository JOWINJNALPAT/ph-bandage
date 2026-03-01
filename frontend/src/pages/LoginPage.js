import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

const FEATURES = [
  { icon: '🩺', title: 'Real-time pH Monitoring', desc: 'Detect wound infection levels instantly via smart bandage color analysis.' },
  { icon: '📊', title: 'Clinical Analytics', desc: 'Trend charts and historical pH data for evidence-based wound care decisions.' },
  { icon: '🔒', title: 'HIPAA-Compliant Security', desc: 'Role-based access for nurses, doctors, and administrators.' },
];

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
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">

      {/* ── Left Panel ─────────────────────────────── */}
      <div className="auth-panel-left">
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        }}>
          {[
            { size: 240, color: 'rgba(79,142,247,0.1)', top: '10%', left: '20%', dur: '8s' },
            { size: 180, color: 'rgba(168,85,247,0.08)', top: '55%', left: '60%', dur: '11s' },
            { size: 130, color: 'rgba(34,211,238,0.07)', top: '75%', left: '15%', dur: '9s' },
          ].map((orb, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: orb.size, height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              top: orb.top, left: orb.left,
              borderRadius: '50%',
              animation: `float ${orb.dur} ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 400 }}>
          {/* Logo */}
          <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Logo size={52} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                pH Bandage
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                Smart Wound Care System
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 34, fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            letterSpacing: '-0.8px',
            marginBottom: 14,
          }}>
            Advanced wound<br />
            <span style={{
              background: 'var(--grad-blue)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              infection detection
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 40 }}>
            Advanced pH analysis for proactive wound care,
            empowering clinical staff with real-time infection insights.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="fade-in" style={{
                animationDelay: `${i * 0.12}s`,
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{
                  fontSize: 20, width: 36, height: 36,
                  background: 'rgba(79,142,247,0.1)',
                  border: '1px solid rgba(79,142,247,0.15)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tag */}
          <div style={{
            marginTop: 36,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 'var(--radius-full)',
            fontSize: 11.5, color: 'var(--green)', fontWeight: 600,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-glow 2s infinite' }} />
            System Operational — All services running
          </div>
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────── */}
      <div className="auth-panel-right">
        <div className="auth-card fade-in">

          {/* Portal badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
          }}>
            <div style={{
              padding: '4px 12px',
              background: 'rgba(79,142,247,0.1)',
              border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: 'var(--radius-full)',
              fontSize: 11, color: 'var(--blue)', fontWeight: 700,
              letterSpacing: '0.4px', textTransform: 'uppercase',
            }}>
              🏥 Hospital Staff Portal
            </div>
          </div>

          <div className="auth-card-inner">
            {/* Heading */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 4 }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                Sign in to your clinical account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error">
                <span style={{ fontSize: 16 }}>⚠</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@hospital.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                className="btn-primary pulse-glow"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 14 }}
              >
                {loading
                  ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in...</>
                  : <>Sign In <span style={{ opacity: 0.8 }}>→</span></>
                }
              </button>
            </form>

            {/* Divider + footer */}
            <div className="divider" style={{ marginTop: 24, marginBottom: 16 }} />
            <p style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              Secure access for authorised clinical staff only.<br />
              Contact your administrator for account issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
