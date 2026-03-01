import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

function getBadgeClass(status) {
  if (status === 'Active') return 'badge-active';
  if (status === 'Healed') return 'badge-healthy';
  return 'badge-mild';
}

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

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'Dr';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-layout">

        {/* ── Topbar ─────────────────────────────── */}
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Doctor Dashboard</h1>
            <p className="topbar-subtitle">Monitor your patients and review infection analytics</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Physician · Wound Care Unit</div>
            </div>
            <div className="user-avatar" style={{
              background: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
              fontSize: 12,
            }}>
              {initials}
            </div>
          </div>
        </header>

        {/* ── Stats ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Patients', value: patients.length, color: 'blue', icon: '🏥', trend: 'All assigned patients' },
            { label: 'Active Cases', value: activeCount, color: 'green', icon: '✅', trend: 'Currently under care' },
            { label: 'Needs Attention', value: criticalCount, color: 'red', icon: '⚠️', trend: 'Requires immediate review' },
          ].map((s, i) => (
            <div key={i} className={`glass-card stat-card ${s.color} fade-in-${i + 1}`}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{loading ? '—' : s.value}</div>
              <div className="stat-trend">{s.trend}</div>
            </div>
          ))}
        </div>

        {/* ── Patient list ────────────────────────── */}
        <div className="section-header">
          <div>
            <div className="section-title">🏥 My Patients</div>
            <div className="section-subtitle">
              {loading ? 'Loading...' : `${filtered.length} patient${filtered.length !== 1 ? 's' : ''} found`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, pointerEvents: 'none',
              }}>🔍</span>
              <input
                id="patient-search"
                className="form-input"
                type="text"
                placeholder="Search name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36, width: 220 }}
              />
            </div>
            <button className="btn-icon" onClick={fetchPatients} title="Refresh">↻</button>
          </div>
        </div>

        {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div className="spinner" style={{ width: 38, height: 38 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card">
            <div className="empty-state">
              <span className="empty-state-icon">🏥</span>
              <div className="empty-state-title">No patients found</div>
              <div className="empty-state-text">
                {search ? 'Try adjusting your search terms.' : 'No patients have been assigned to you yet.'}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map((patient, i) => (
              <div
                key={patient._id}
                className="glass-card interactive fade-in"
                style={{ padding: 22, animationDelay: `${i * 40}ms`, cursor: 'default' }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Patient avatar */}
                    <div style={{
                      width: 44, height: 44, flexShrink: 0,
                      background: patient.gender === 'Female'
                        ? 'linear-gradient(135deg,#a855f7,#f97316)'
                        : 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: '#fff',
                      letterSpacing: '-0.5px',
                    }}>
                      {patient.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>
                        {patient.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {patient.patientId}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${getBadgeClass(patient.woundStatus)}`}>
                    {patient.woundStatus || 'Active'}
                  </span>
                </div>

                {/* Info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
                  {[
                    { label: 'Age', value: `${patient.age} yrs` },
                    { label: 'Gender', value: patient.gender },
                  ].map(item => (
                    <div key={item.label} className="info-cell">
                      <div className="info-cell-label">{item.label}</div>
                      <div className="info-cell-value">{item.value}</div>
                    </div>
                  ))}
                </div>

                <Link
                  id={`view-patient-${patient._id}`}
                  to={`/patient/${patient._id}`}
                  className="btn-primary"
                  style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', padding: '10px' }}
                >
                  View Scans & Analysis →
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
