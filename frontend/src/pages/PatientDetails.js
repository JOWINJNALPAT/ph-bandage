import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientAPI, scanAPI } from '../utils/api';

import { formatDate, timeAgo } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function getInfectionBadge(level) {
  if (level === 'Healthy') return { cls: 'badge-healthy', color: '#10b981' };
  if (level === 'Mild Risk') return { cls: 'badge-mild', color: '#f59e0b' };
  if (level === 'Medium Infection') return { cls: 'badge-medium', color: '#f97316' };
  return { cls: 'badge-high', color: '#ef4444' };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,22,40,0.96)', border: '1px solid rgba(79,142,247,0.3)',
        borderRadius: 10, padding: '10px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#4f8ef7', fontWeight: 700 }}>pH {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function PatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPatientData(); }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const [patientRes, scansRes] = await Promise.all([
        patientAPI.getPatientDetails(patientId),
        scanAPI.getScanHistory(patientId)
      ]);
      setPatient(patientRes.data.patient);
      setScans(scansRes.data.scans);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patient data');
    } finally { setLoading(false); }
  };

  const handleAddNotes = async () => {
    setSavingNotes(true);
    try {
      await patientAPI.updatePatient(patientId, { medicalNotes: notes });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) { alert('Failed to save notes.'); }
    finally { setSavingNotes(false); }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
        <div style={{ color: 'var(--text-secondary)' }}>Loading patient data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{error}</div>
        <button onClick={() => navigate('/doctor-dashboard')} className="btn-ghost">← Back to Dashboard</button>
      </div>
    );
  }

  const chartData = [...scans].reverse().map(scan => ({
    date: new Date(scan.timestamp).toLocaleDateString(),
    ph: scan.phValue,
  }));

  const latestScan = scans[0];
  const avgpH = scans.length ? (scans.reduce((a, s) => a + s.phValue, 0) / scans.length).toFixed(2) : '-';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 32, maxWidth: 1100, margin: '0 auto' }}>

      {/* Back + header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button
          id="back-to-dashboard"
          onClick={() => navigate('/doctor-dashboard')}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
        >
          ← Back
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Patient Details</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Full scan history and analytics</p>
        </div>
      </div>

      {/* Patient Info Card */}
      {patient && (
        <div className="glass-card fade-in" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg,#4f8ef7,#a855f7)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30
            }}>
              {patient.gender === 'Female' ? '👩' : '👨'}
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{patient.name}</h2>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{patient.patientId}</div>
            </div>
            {latestScan && (
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Latest Status</div>
                <span className={`badge ${getInfectionBadge(latestScan.infectionLevel).cls}`} style={{ fontSize: 14 }}>
                  {latestScan.infectionLevel}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Age', value: `${patient.age} yrs` },
              { label: 'Gender', value: patient.gender },
              { label: 'Wound Status', value: patient.woundStatus || 'Active' },
              { label: 'Total Scans', value: scans.length },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 16px'
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* pH Chart */}
      {scans.length > 0 && (
        <div className="glass-card fade-in-1" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>📊 pH Trend Analysis</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Average pH: <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{avgpH}</span></p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ label: 'Healthy', color: '#10b981', range: '< 7.0' }, { label: 'Infected', color: '#ef4444', range: '> 7.4' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }}></div>
                  {l.label} ({l.range})
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis domain={[5, 10]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={7.0} stroke="rgba(16,185,129,0.4)" strokeDasharray="4 4" label={{ value: 'Normal', fill: '#10b981', fontSize: 11 }} />
              <ReferenceLine y={7.4} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 4" label={{ value: 'Caution', fill: '#ef4444', fontSize: 11 }} />
              <Line type="monotone" dataKey="ph" stroke="#4f8ef7" strokeWidth={2.5}
                dot={{ fill: '#4f8ef7', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#22d3ee', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Medical Notes */}
      <div className="glass-card fade-in-2" style={{ padding: 28, marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>📝 Medical Notes</h3>
        <textarea
          id="medical-notes"
          className="form-input"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add clinical observations, treatment plan, or follow-up notes..."
          rows={4}
          style={{ resize: 'vertical' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <button
            id="save-notes-btn"
            onClick={handleAddNotes}
            className="btn-primary"
            disabled={savingNotes || !notes.trim()}
          >
            {savingNotes ? <><span className="spinner" style={{ width: 14, height: 14 }}></span> Saving...</> : '💾 Save Notes'}
          </button>
          {notesSaved && <span className="alert alert-success" style={{ margin: 0, padding: '6px 14px' }}>✅ Saved!</span>}
        </div>
      </div>

      {/* Scan History */}
      <div className="glass-card fade-in-3" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>🩹 Scan History</h3>
        {scans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>No scans recorded yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {scans.map((scan, i) => {
              const { cls, color } = getInfectionBadge(scan.infectionLevel);
              return (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(255,255,255,0.06)`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 10,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'background 0.15s',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatDate(scan.timestamp)}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(scan.timestamp)}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                      {[
                        { label: 'Color', value: scan.colorDetected },
                        { label: 'pH Value', value: scan.phValue?.toFixed(2) },
                        { label: 'Scanned by', value: scan.nurseId?.name || 'Unknown' },
                      ].map(f => (
                        <div key={f.label}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className={`badge ${cls}`}>{scan.infectionLevel}</span>
                  {scan.imageUrl && (
                    <img src={`http://localhost:5000${scan.imageUrl}`} alt="Scan" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;
