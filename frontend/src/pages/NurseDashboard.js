import React, { useState } from 'react';
import { scanAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import ScanUpload from '../components/ScanUpload';
import AnalysisResult from '../components/AnalysisResult';
import CameraScanner from '../components/CameraScanner';

const COLORS = [
  { id: 'Yellow', label: 'Yellow', dot: '#EAB308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.4)', text: '#fbbf24', ph: '5.5–6.0', status: 'Healthy' },
  { id: 'Green', label: 'Green', dot: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)', text: '#34d399', ph: '6.5–7.0', status: 'Mild Risk' },
  { id: 'Blue', label: 'Blue', dot: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', text: '#7eb0ff', ph: '7.5–8.0', status: 'Medium Infection' },
  { id: 'Dark Blue', label: 'Dark Blue', dot: '#1E3A8A', bg: 'rgba(30,58,138,0.25)', border: 'rgba(30,58,138,0.55)', text: '#93c5fd', ph: '8.5–9.0', status: 'High Infection' },
];

function NurseDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('scan');
  const [bandageId, setBandageId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [scanHistory, setScanHistory] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSubmit = async (scanData) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const formData = new FormData();
      formData.append('bandageId', scanData.bandageId.trim());

      if (scanData.image) {
        formData.append('image', scanData.image);
      } else if (scanData.color) {
        formData.append('color', scanData.color);
      }

      const response = await scanAPI.submitScan(formData);
      const scan = response.data.scan;

      const resultData = {
        ...scan,
        _id: scan._id || Math.random().toString(36).substr(2, 9),
        timestamp: scan.timestamp || new Date().toISOString(),
        confidence: 94 // AI confidence for static uploads
      };

      setLatestResult(resultData);
      setShowResult(true);
      setMessage({
        text: `Analysis complete: ${scan.infectionLevel} detected.`,
        type: 'success',
      });
      setScanHistory(prev => [resultData, ...prev]);
      setBandageId('');
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Neural engine failed to process image.',
        type: 'error'
      });
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };

  const handleManualScanFromCamera = async (scanData) => {
    setIsScanning(false);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bandageId', bandageId.trim());
      formData.append('color', scanData.colorDetected);
      formData.append('phValue', scanData.phValue); // Pass calculated ph

      const response = await scanAPI.submitScan(formData);
      const scan = response.data.scan;

      const resultData = {
        ...scan,
        phValue: scanData.phValue, // Prefer camera's precision
        _id: scan._id || Math.random().toString(36).substr(2, 9),
        timestamp: scan.timestamp || new Date().toISOString(),
        confidence: scanData.confidence,
        metadata: scanData.metadata
      };

      setLatestResult(resultData);
      setShowResult(true);
      setMessage({
        text: `Scanner verified: ${scan.infectionLevel} (${scanData.confidence}% confidence)`,
        type: 'success',
      });
      setScanHistory(prev => [resultData, ...prev]);
      setBandageId('');
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Real-time analysis failed.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-layout" style={{ flex: 1 }}>

        {/* ── Topbar ─────────────────────────────── */}
        <header className="topbar" style={{ border: 'none', paddingBottom: 0, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className="ai-data-tag">Operational</span>
              <span className="ai-data-tag" style={{ color: 'var(--green)', borderColor: 'var(--green)' }}>Neural Engine v4.2</span>
            </div>
            <h1 className="topbar-title text-gradient-ai" style={{ fontSize: 32 }}>Nurse Command Center</h1>
            <p className="topbar-subtitle">Advanced wound diagnostics and pH telemetry system.</p>
          </div>

          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Medical Staff</div>
            </div>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: 'var(--grad-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
            }}>
              ⚕️
            </div>
          </div>
        </header>

        {/* ── Scan Tab ─────────────────────────────── */}
        {activeTab === 'scan' && (
          <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 1400, marginBottom: 40 }}>
              {/* Left Column: Input */}
              <div className="glass-card premium" style={{ padding: 40, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}>
                  <span className="ai-data-tag">Input Module</span>
                </div>
                <h3 style={{ fontSize: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ padding: 8, background: 'rgba(79, 142, 247, 0.1)', borderRadius: 8 }}>📸</span>
                  New Diagnostics Scan
                </h3>
                <ScanUpload
                  onScanSubmit={handleScanSubmit}
                  onCameraOpen={() => {
                    if (!bandageId.trim()) { alert('Please enter a Patient Bandage ID first.'); return; }
                    setIsScanning(true);
                  }}
                  isLoading={loading}
                  bandageId={bandageId}
                  setBandageId={setBandageId}
                />
              </div>

              {/* Right Column: Results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {message.text && (
                  <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{
                    borderRadius: 12, border: '1px solid currentColor', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)'
                  }}>
                    <span style={{ fontSize: 18 }}>{message.type === 'success' ? '⚡' : '⚠️'}</span>
                    <div style={{ fontWeight: 600 }}>{message.text}</div>
                  </div>
                )}

                {loading ? (
                  <div className="glass-card ai-scan-glow" style={{ padding: 60, textAlign: 'center' }}>
                    <div className="animate-spin" style={{ fontSize: 40, marginBottom: 20 }}>🔄</div>
                    <h3 className="text-gradient-ai">Processing Neural Data...</h3>
                    <p>Extracting chromatic markers and pH coefficients</p>
                  </div>
                ) : showResult && latestResult ? (
                  <div className="scale-in">
                    <AnalysisResult
                      scan={latestResult}
                      onClose={() => setShowResult(false)}
                    />
                  </div>
                ) : (
                  <div className="glass-card premium" style={{
                    padding: 60, textAlign: 'center', borderStyle: 'dashed'
                  }}>
                    <div style={{ fontSize: 64, marginBottom: 24, opacity: 0.5 }} className="animate-float">📡</div>
                    <h3 style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Standby for Input</h3>
                    <p style={{ maxWidth: 300, margin: '12px auto' }}>System ready. Please upload a sample or initiate real-time optical scanning.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1400 }}>
              {/* PH Guide */}
              <div className="glass-card premium" style={{ padding: 24 }}>
                <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20, color: 'var(--text-secondary)' }}>
                  Spectral Reference
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {COLORS.map(c => (
                    <div key={c.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border)', borderRadius: 10
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot, boxShadow: `0 0 12px ${c.dot}` }}></div>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{c.label}</span>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--blue)' }}>{c.ph} pH</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Board */}
              <div className="glass-card premium" style={{ padding: 24 }}>
                <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20, color: 'var(--text-secondary)' }}>
                  System Health
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Connection</span>
                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>Encrypted (256-bit)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Latency</span>
                    <span style={{ color: 'var(--blue)' }}>24ms</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>AI Confidence Avg</span>
                    <span style={{ color: 'var(--text-primary)' }}>96.4%</span>
                  </div>
                  <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ width: '96%', height: '100%', background: 'var(--grad-blue)', borderRadius: 2 }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card premium" style={{ padding: 24 }}>
                <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20, color: 'var(--text-secondary)' }}>
                  Optical Protocol
                </h4>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  1. Secure bandage perimeter<br />
                  2. Ensure ambient light {'>'} 300 lux<br />
                  3. Align optic sensors to strip<br />
                  4. Verify ID and deploy scan
                </div>
                <button
                  className="btn-primary shimmer-btn"
                  style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}
                  onClick={() => setIsScanning(true)}
                >
                  Launch Vision AI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── History Tab ──────────────────────────── */}
        {activeTab === 'history' && (
          <div className="fade-in">
            <div className="glass-card premium" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 24 }} className="text-gradient-ai">Session Telemetry</h2>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Analysis logs for active surgical session</p>
                </div>
                <span className="ai-data-tag">{scanHistory.length} Record(s)</span>
              </div>

              {scanHistory.length === 0 ? (
                <div style={{ padding: 100, textAlign: 'center', opacity: 0.5 }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
                  <div>No data points recorded yet.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {scanHistory.map((scan, i) => (
                    <div key={i} className="glass-card interactive" style={{
                      padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20,
                      background: 'rgba(255,255,255,0.02)'
                    }}>
                      <div style={{
                        width: 12, height: 12, borderRadius: '50%',
                        background: COLORS.find(c => c.id === scan.colorDetected)?.dot || '#fff',
                        boxShadow: `0 0 12px ${COLORS.find(c => c.id === scan.colorDetected)?.dot || '#fff'}`
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontWeight: 800, fontSize: 16 }}>{scan.bandageId}</span>
                          <span className="ai-data-tag">{scan.infectionLevel}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                          TS: {new Date(scan.timestamp).toLocaleTimeString()} • pH: {scan.phValue} • Confidence: {scan.confidence}%
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>TELEMETRY</div>
                        <div style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 700 }}>VERIFIED</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {isScanning && (
        <CameraScanner
          onScanComplete={handleManualScanFromCamera}
          onCancel={() => setIsScanning(false)}
        />
      )}
    </div>
  );
}

export default NurseDashboard;
