import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientAPI, scanAPI } from '../utils/api';
import { formatDate, timeAgo } from '../utils/helpers';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';

function getInfectionBadge(level) {
  if (level === 'Healthy') return { cls: 'badge-healthy', color: '#10b981' };
  if (level === 'Mild Risk') return { cls: 'badge-mild', color: '#f59e0b' };
  if (level === 'Medium Infection') return { cls: 'badge-medium', color: '#f97316' };
  return { cls: 'badge-high', color: '#ef4444' };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const level = val < 7.0 ? 'Healthy' : val < 7.4 ? 'Borderline' : 'Infected';
    const color = val < 7.0 ? '#10b981' : val < 7.4 ? '#f59e0b' : '#ef4444';
    return (
      <div style={{
        background: 'rgba(11,17,32,0.96)',
        border: '1px solid rgba(79,142,247,0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        minWidth: 140,
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 11.5, marginBottom: 6, fontWeight: 500 }}>
          {label}
        </p>
        <p style={{ color: '#7eb0ff', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
          pH {val}
        </p>
        <span style={{
          display: 'inline-block', padding: '2px 8px', borderRadius: '999px',
          fontSize: 11, fontWeight: 600, background: `${color}20`, color,
          border: `1px solid ${color}35`,
        }}>
          {level}
        </span>
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
        scanAPI.getScanHistory(patientId),
      ]);
      setPatient(patientRes.data.patient);
      setNotes(patientRes.data.patient.medicalNotes || '');
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
    } catch { alert('Failed to save notes.'); }
    finally { setSavingNotes(false); }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
        background: 'var(--bg-primary)',
      }}>
        <div className="spinner" style={{ width: 44, height: 44 }} />
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading patient data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 16,
        background: 'var(--bg-primary)',
      }}>
        <div style={{ fontSize: 52 }}>⚠️</div>
        <div style={{ color: 'var(--red)', fontWeight: 700, fontSize: 16 }}>{error}</div>
        <button onClick={() => navigate('/doctor-dashboard')} className="btn-ghost">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const chartData = [...scans].reverse().map(scan => ({
    date: new Date(scan.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    ph: scan.phValue,
  }));

  const latestScan = scans[0];
  const avgpH = scans.length ? (scans.reduce((a, s) => a + s.phValue, 0) / scans.length).toFixed(2) : null;
  const maxpH = scans.length ? Math.max(...scans.map(s => s.phValue)).toFixed(2) : null;
  const minpH = scans.length ? Math.min(...scans.map(s => s.phValue)).toFixed(2) : null;

  const patientInitials = patient?.name
    ? patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Back + Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button
          id="back-to-dashboard"
          onClick={() => navigate('/doctor-dashboard')}
          className="btn-ghost"
          style={{ padding: '8px 14px' }}
        >
          ← Back
        </button>
        <div className="divider" style={{ width: 1, height: 24, margin: 0 }} />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            Patient Details
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Full scan history and pH analytics</p>
        </div>
      </div>

      {/* ── Patient Info Card ──────────────────────── */}
      {patient && (
        <div className="glass-card fade-in" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 68, height: 68, flexShrink: 0,
              background: patient.gender === 'Female'
                ? 'linear-gradient(135deg,#a855f7,#f97316)'
                : 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: '#fff',
              letterSpacing: '-0.5px',
            }}>
              {patientInitials}
            </div>
            {/* Name & ID */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 3, letterSpacing: '-0.4px' }}>
                {patient.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <code style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  {patient.patientId}
                </code>
                {latestScan && (
                  <span className={`badge ${getInfectionBadge(latestScan.infectionLevel).cls}`}>
                    {latestScan.infectionLevel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginTop: 20 }}>
            {[
              { label: 'Age', value: `${patient.age} yrs` },
              { label: 'Gender', value: patient.gender },
              { label: 'Wound Status', value: patient.woundStatus || 'Active' },
              { label: 'Total Scans', value: scans.length },
            ].map(item => (
              <div key={item.label} className="info-cell">
                <div className="info-cell-label">{item.label}</div>
                <div className="info-cell-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── pH Chart ────────────────────────────────── */}
      {scans.length > 0 && (
        <div className="glass-card fade-in-1" style={{ padding: 24, marginBottom: 20 }}>
          {/* Chart header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                📈 pH Trend Analysis
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                Wound pH over time — Normal range: 5.5–7.4
              </p>
            </div>
            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { label: 'Average', value: avgpH, color: 'var(--blue)' },
                { label: 'Max', value: maxpH, color: 'var(--red)' },
                { label: 'Min', value: minpH, color: 'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{
                  textAlign: 'center', padding: '8px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="phGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11.5 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis domain={[5, 10]} tick={{ fill: 'var(--text-secondary)', fontSize: 11.5 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} tickCount={6} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={7.0} stroke="rgba(16,185,129,0.35)" strokeDasharray="4 4"
                label={{ value: 'Normal', fill: '#34d399', fontSize: 10.5, dy: -6 }} />
              <ReferenceLine y={7.4} stroke="rgba(239,68,68,0.35)" strokeDasharray="4 4"
                label={{ value: 'Caution', fill: '#f87171', fontSize: 10.5, dy: -6 }} />
              <Area
                type="monotone" dataKey="ph"
                stroke="#4f8ef7" strokeWidth={2.5}
                fill="url(#phGrad)"
                dot={{ fill: '#4f8ef7', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#22d3ee', strokeWidth: 0, boxShadow: '0 0 8px #22d3ee' }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
            {[
              { label: 'Healthy', color: '#34d399', range: '< 7.0' },
              { label: 'Borderline', color: '#fbbf24', range: '7.0–7.4' },
              { label: 'Infected', color: '#f87171', range: '> 7.4' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                {l.label} ({l.range})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Medical Notes ──────────────────────────── */}
      <div className="glass-card fade-in-2" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
          📝 Clinical Notes
        </h3>
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
            {savingNotes
              ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving...</>
              : '💾 Save Notes'
            }
          </button>
          {notesSaved && (
            <span className="alert alert-success" style={{ margin: 0, padding: '6px 14px' }}>
              ✅ Saved!
            </span>
          )}
        </div>
      </div>

      {/* ── Scan History ───────────────────────────── */}
      <div className="glass-card fade-in-3" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>🩹 Scan History</h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            {scans.length} scan{scans.length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        {scans.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🩹</span>
            <div className="empty-state-title">No scans recorded yet</div>
            <div className="empty-state-text">Nurse scans will appear here once submitted.</div>
          </div>
        ) : (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scans.map((scan, i) => {
              const { cls, color } = getInfectionBadge(scan.infectionLevel);
              return (
                <div
                  key={i}
                  className="scan-row fade-in"
                  style={{
                    animationDelay: `${i * 40}ms`,
                    borderLeft: `3px solid ${color}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatDate(scan.timestamp)}
                      </span>
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        {timeAgo(scan.timestamp)}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      {[
                        { label: 'Color', value: scan.colorDetected },
                        { label: 'pH Value', value: scan.phValue?.toFixed(2) },
                        { label: 'Scanned by', value: scan.nurseId?.name || 'Unknown' },
                      ].map(f => (
                        <div key={f.label}>
                          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                            {f.label}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span className={`badge ${cls}`}>{scan.infectionLevel}</span>
                    {scan.imageUrl && (
                      <img
                        src={`http://localhost:5000${scan.imageUrl}`}
                        alt="Scan"
                        style={{
                          width: 52, height: 52,
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          border: '1px solid var(--border)',
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: 40 }} />
    </div>
  );
}

export default PatientDetails;
