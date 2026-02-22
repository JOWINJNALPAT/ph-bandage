import React, { useState } from 'react';
import { scanAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

const COLORS = [
  { id: 'Yellow', label: 'Yellow', dot: '#EAB308', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)', text: '#eab308', ph: '5.5–6.0', status: 'Healthy' },
  { id: 'Green', label: 'Green', dot: '#22C55E', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', text: '#22c55e', ph: '6.5–7.0', status: 'Mild Risk' },
  { id: 'Blue', label: 'Blue', dot: '#3B82F6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#3b82f6', ph: '7.5–8.0', status: 'Medium Infection' },
  { id: 'Dark Blue', label: 'Dark Blue', dot: '#1E3A8A', bg: 'rgba(30,58,138,0.3)', border: 'rgba(30,58,138,0.6)', text: '#93c5fd', ph: '8.5–9.0', status: 'High Infection' },
];

function getBadgeClass(level) {
  if (level === 'Healthy') return 'badge-healthy';
  if (level === 'Mild Risk') return 'badge-mild';
  if (level === 'Medium Infection') return 'badge-medium';
  return 'badge-high';
}

function NurseDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('scan');
  const [bandageId, setBandageId] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [scanHistory, setScanHistory] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setSelectedColor('');
    }
  };

  const handleSubmitScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const formData = new FormData();
      formData.append('bandageId', bandageId);
      if (image) {
        formData.append('image', image);
      } else if (selectedColor) {
        formData.append('color', selectedColor);
      } else {
        setMessage({ text: 'Please select a color or upload an image.', type: 'error' });
        setLoading(false);
        return;
      }
      const response = await scanAPI.submitScan(formData);
      const scan = response.data.scan;
      setMessage({ text: `Scan submitted! Infection Level: ${scan.infectionLevel} · pH ${scan.phValue}`, type: 'success' });
      setScanHistory(prev => [scan, ...prev]);
      setBandageId(''); setSelectedColor(''); setImage(null); setPreview(null);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to submit scan.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-layout">
        {/* Topbar */}
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Nurse Workstation</h1>
            <p className="topbar-subtitle">Submit bandage scans and track infection status in real time.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Nursing Staff</div>
            </div>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg,#22d3ee,#10b981)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18
            }}>👩‍⚕️</div>
          </div>
        </header>

        {activeTab === 'scan' && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

            {/* Scan Form */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  📸 Submit Bandage Scan
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Enter the bandage ID and either upload a photo or select the observed color.
                </p>
              </div>

              {message.text && (
                <div className={message.type === 'success' ? 'alert alert-success' : 'alert alert-error'}>
                  {message.type === 'success' ? '✅' : '⚠'} {message.text}
                </div>
              )}

              <form onSubmit={handleSubmitScan}>
                {/* Bandage ID */}
                <div style={{ marginBottom: 20 }}>
                  <label className="form-label">Bandage ID</label>
                  <input
                    id="bandage-id-input"
                    className="form-input"
                    type="text"
                    value={bandageId}
                    onChange={e => setBandageId(e.target.value)}
                    required
                    placeholder="e.g. BANDAGE-001"
                  />
                </div>

                {/* Image Upload */}
                <div style={{ marginBottom: 20 }}>
                  <label className="form-label">Upload Bandage Photo</label>
                  <label style={{
                    display: 'block',
                    border: '2px dashed var(--border)',
                    borderRadius: 12,
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: preview ? 'rgba(79,142,247,0.05)' : 'transparent',
                  }}
                    onDragOver={e => { e.preventDefault(); }}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" style={{ maxHeight: 160, margin: '0 auto', borderRadius: 8, display: 'block' }} />
                    ) : (
                      <>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Click to upload or drag & drop</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>PNG, JPG, JPEG up to 10MB</div>
                      </>
                    )}
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                  {preview && (
                    <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                      style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      ✕ Remove image
                    </button>
                  )}
                </div>

                {/* Color Selector */}
                {!image && (
                  <div style={{ marginBottom: 28 }}>
                    <label className="form-label">Or Select Color Manually</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {COLORS.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          id={`color-btn-${c.id.replace(' ', '-').toLowerCase()}`}
                          onClick={() => setSelectedColor(c.id)}
                          style={{
                            background: selectedColor === c.id ? c.bg : 'rgba(255,255,255,0.03)',
                            border: `2px solid ${selectedColor === c.id ? c.border : 'var(--border)'}`,
                            borderRadius: 12,
                            padding: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            transform: selectedColor === c.id ? 'translateY(-2px)' : 'none',
                          }}
                        >
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.dot, flexShrink: 0, boxShadow: selectedColor === c.id ? `0 0 12px ${c.dot}` : 'none' }} />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: selectedColor === c.id ? c.text : 'var(--text-primary)' }}>{c.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>pH {c.ph}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  id="submit-scan-btn"
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
                >
                  {loading ? <><span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }}></span>Submitting...</> : '✓ Submit Scan'}
                </button>
              </form>
            </div>

            {/* Right panel: Color Guide */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>🎨 pH Color Guide</h3>
                {COLORS.map(c => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 8,
                    background: c.bg, border: `1px solid ${c.border}`
                  }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.status} · pH {c.ph}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>📋 Workflow Steps</h3>
                {['Enter the Bandage ID', 'Upload photo or pick color', 'Submit the scan', 'Doctor reviews results'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0
                    }}>{i + 1}</div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="fade-in">
            <div className="section-header">
              <div>
                <h2 className="section-title">📋 Scan History (Session)</h2>
                <p className="section-subtitle">{scanHistory.length} scans submitted this session</p>
              </div>
            </div>
            {scanHistory.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>No scans yet</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>Submitted scans will appear here.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {scanHistory.map((scan, i) => {
                  const color = COLORS.find(c => c.id === scan.colorDetected) || COLORS[0];
                  return (
                    <div key={i} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: color.dot, flexShrink: 0, boxShadow: `0 0 20px ${color.dot}50` }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>
                          Bandage Scan
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          Color: {scan.colorDetected} · pH: {typeof scan.phValue === 'number' ? scan.phValue.toFixed(2) : scan.phValue}
                        </div>
                      </div>
                      <span className={`badge ${getBadgeClass(scan.infectionLevel)}`}>{scan.infectionLevel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default NurseDashboard;
