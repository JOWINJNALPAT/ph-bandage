import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';



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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 24px',
      position: 'relative'
    }}>
      {/* ── Top Navigation / Badge ────────────────── */}
      <div style={{
        position: 'fixed', top: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 16, zIndex: 100
      }}>
        <div style={{
          padding: '6px 16px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 12,
          fontWeight: 600,
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'pulse 2s infinite' }} />
          Live Neural System — v4.2.0 Active
        </div>
      </div>

      {/* ── Hero Content ──────────────────────────── */}
      <div style={{
        textAlign: 'center',
        maxWidth: 800,
        marginTop: 60,
        marginBottom: 60,
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Logo size={64} />
        </div>
        <h1 style={{
          fontSize: 'clamp(42px, 8vw, 72px)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: 24
        }}>
          Smart Healing,<br />
          <span style={{
            background: 'linear-gradient(to right, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Accelerated.
          </span>
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 18px)',
          color: '#94a3b8',
          lineHeight: 1.6,
          maxWidth: 500,
          margin: '0 auto'
        }}>
          Proactive wound care empowered by real-time pH analysis
          and surgical-grade AI diagnostics.
        </p>
      </div>

      {/* ── Login Card ────────────────────────────── */}
      <div className="glass-card premium" style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 40,
        borderRadius: 24,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'fadeInUp 1s ease-out'
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0ea5e9', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            — Staff Portal
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Clinical Authentication</h2>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px 16px',
            borderRadius: 12,
            color: '#f87171',
            fontSize: 13,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="name@hospital.com"
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shimmer-btn"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(to right, #0ea5e9, #2563eb)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxShadow: '0 10px 20px -10px rgba(14, 165, 233, 0.5)',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : <>Access Portal <span style={{ opacity: 0.6 }}>→</span></>}
          </button>
        </form>

        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
            Authorized Personnel Only. All session data is hardware-encrypted and logged for HIPAA audit compliance.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        input:focus {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
