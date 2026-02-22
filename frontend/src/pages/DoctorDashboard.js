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
      const response = await patientAPI.getMyPatients();
      setPatients(response.data.patients);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.patientId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-layout">
        {/* Topbar */}
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Doctor Dashboard</h1>
            <p className="topbar-subtitle">Monitor your patients and review infection analytics.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Physician · Wound Care Unit</div>
            </div>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}>👨‍⚕️</div>
          </div>
        </header>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
          <div className="glass-card stat-card blue" style={{ padding: 20 }}>
            <div className="stat-label">Total Patients</div>
            <div className="stat-value" style={{ fontSize: 28 }}>{patients.length}</div>
          </div>
          <div className="glass-card stat-card green" style={{ padding: 20 }}>
            <div className="stat-label">Active Cases</div>
            <div className="stat-value" style={{ fontSize: 28 }}>{patients.filter(p => p.woundStatus === 'Active').length}</div>
          </div>
          <div className="glass-card stat-card red" style={{ padding: 20 }}>
            <div className="stat-label">Needs Attention</div>
            <div className="stat-value" style={{ fontSize: 28 }}>{patients.filter(p => p.woundStatus === 'Critical').length}</div>
          </div>
        </div>

        {/* Search + Patient List */}
        <div className="section-header">
          <div>
            <h2 className="section-title">🏥 My Patients</h2>
            <p className="section-subtitle">Click a patient card to view full scan history</p>
          </div>
          <input
            id="patient-search"
            className="form-input"
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 36, height: 36 }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏥</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>No patients found</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
              {search ? 'Try a different search.' : 'No patients have been assigned yet.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map((patient, i) => (
              <div
                key={patient._id}
                className="glass-card fade-in"
                style={{ padding: 24, animationDelay: `${i * 50}ms`, cursor: 'default' }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44,
                      background: 'linear-gradient(135deg,#4f8ef7,#a855f7)',
                      borderRadius: 12,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 20, flexShrink: 0
                    }}>
                      {patient.gender === 'Female' ? '👩' : '👨'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{patient.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{patient.patientId}</div>
                    </div>
                  </div>
                  <span className={`badge ${getBadgeClass(patient.woundStatus)}`}>{patient.woundStatus || 'Active'}</span>
                </div>

                {/* Patient info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                  {[
                    { label: 'Age', value: `${patient.age} yrs` },
                    { label: 'Gender', value: patient.gender },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px 12px'
                    }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                      <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <Link
                  id={`view-patient-${patient._id}`}
                  to={`/patient/${patient._id}`}
                  className="btn-primary"
                  style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
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
