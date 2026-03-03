import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

function DoctorDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('patients');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await patientAPI.getMyPatients();
      setPatients(res.data.patients);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
    } finally { setLoading(false); }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.patientId?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = patients.filter(p => p.woundStatus === 'Active').length;
  const criticalCount = patients.filter(p => p.woundStatus === 'Critical').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-layout" style={{ flex: 1 }}>

        {/* ── Topbar ─────────────────────────────── */}
        <header className="topbar" style={{ border: 'none', paddingBottom: 0, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className="ai-data-tag">Physician Portal</span>
              <span className="ai-data-tag" style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}>Unit 4-B Diagnostics</span>
            </div>
            <h1 className="topbar-title text-gradient-ai" style={{ fontSize: 32 }}>Medical Unit Dashboard</h1>
            <p className="topbar-subtitle">System-wide patient monitoring and telemetry analysis</p>
          </div>

          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Wound Care Specialist</div>
            </div>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: 'var(--grad-purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
            }}>
              👨‍⚕️
            </div>
          </div>
        </header>

        {/* ── Stats ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 40 }}>
          {[
            { label: 'Active Roster', value: patients.length, color: 'blue', icon: '🫂', desc: 'Total tracked cases' },
            { label: 'Heal Progression', value: activeCount, color: 'green', icon: '📈', desc: 'Patients in recovery' },
            { label: 'Anomalies Detected', value: criticalCount, color: 'red', icon: '⚠️', desc: 'Requiring review' },
          ].map((s, i) => (
            <div key={i} className="glass-card premium" style={{ padding: 24, position: 'relative' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontSize: 36, fontWeight: 900, marginTop: 4, letterSpacing: -1 }} className={`text-${s.color}`}>{loading ? '...' : s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Patient list  ────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24 }} className="text-gradient-ai">Patient Registry</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {loading ? 'Initializing roster...' : `${filtered.length} patients under clinical observation`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <input
                id="doctor-search"
                className="form-input"
                type="text"
                placeholder="Search telemetry ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, paddingLeft: 40, width: 260 }}
              />
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            </div>
            <button className="btn-icon" style={{ borderRadius: 12, width: 42, height: 42 }} onClick={fetchPatients}>↻</button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={{ padding: 100, textAlign: 'center' }}>
            <div className="animate-spin" style={{ fontSize: 40, marginBottom: 20 }}>🔄</div>
            <p>Accessing medical records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card premium" style={{ padding: 80, textAlign: 'center' }}>
            <div style={{ fontSize: 48, opacity: 0.5 }}>🗃️</div>
            <p style={{ marginTop: 20 }}>No matching telemetry found in the active unit database.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filtered.map((patient, i) => (
              <div
                key={patient._id}
                className="glass-card premium interactive"
                style={{ padding: 28, animationDelay: `${i * 30}ms` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: patient.gender === 'Female' ? 'var(--grad-purple)' : 'var(--grad-blue)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      {patient.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>{patient.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>{patient.patientId}</div>
                    </div>
                  </div>
                  <span className={`badge ${patient.woundStatus === 'Critical' ? 'badge-high' : patient.woundStatus === 'Healthy' ? 'badge-healthy' : 'badge-mild'}`} style={{ borderRadius: 8 }}>
                    {patient.woundStatus}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 4 }}>AGE_VAL</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{patient.age} Yrs</div>
                  </div>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 4 }}>GEN_TYPE</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{patient.gender}</div>
                  </div>
                </div>

                <Link
                  id={`view-patient-${patient._id}`}
                  to={`/patient/${patient._id}`}
                  className="btn-primary shimmer-btn"
                  style={{ width: '100%', justifyContent: 'center', borderRadius: 12, textDecoration: 'none' }}
                >
                  Diagnostic Data Board →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DoctorDashboard;
