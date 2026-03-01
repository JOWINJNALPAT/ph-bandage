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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [scanHistory, setScanHistory] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'N';

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

      // Format scan data for display
      const resultData = {
        ...scan,
        _id: scan._id || Math.random().toString(36).substr(2, 9),
        timestamp: scan.timestamp || new Date().toISOString(),
      };

      setLatestResult(resultData);
      setShowResult(true);
      setMessage({
        text: `✅ Scan analyzed successfully! ${scan.infectionLevel}`,
        type: 'success',
      });
      setScanHistory(prev => [resultData, ...prev]);
      setBandageId('');
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to submit scan.',
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
      // Create a simulated form compatible with existing backend
      const formData = new FormData();
      formData.append('bandageId', bandageId.trim());
      formData.append('color', scanData.colorDetected);

      const response = await scanAPI.submitScan(formData);
      const scan = response.data.scan;

      const resultData = {
        ...scan,
        _id: scan._id || Math.random().toString(36).substr(2, 9),
        timestamp: scan.timestamp || new Date().toISOString(),
        confidence: scanData.confidence // Use camera's confidence
      };

      setLatestResult(resultData);
      setShowResult(true);
      setMessage({
        text: `✅ Scan analyzed successfully! ${scan.infectionLevel}`,
        type: 'success',
      });
      setScanHistory(prev => [resultData, ...prev]);
      setBandageId('');
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to submit scan.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (color) => {
    // Color selected, ready to submit
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-layout">

        {/* ── Topbar ─────────────────────────────── */}
        <header className="topbar">
          <div>
            <h1 className="topbar-title">🏥 Nurse Workstation</h1>
            <p className="topbar-subtitle">Smart Bandage Analysis — Submit scans for real-time infection detection</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Nursing Staff</div>
            </div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg,#22d3ee,#10b981)', fontSize: 12 }}>
              {initials}
            </div>
          </div>
        </header>

        {/* ── Scan Tab ─────────────────────────────── */}
        {activeTab === 'scan' && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1400 }}>
            {/* Left: Upload Component */}
            <div>
              <ScanUpload
                onScanSubmit={handleScanSubmit}
                onColorSelect={handleColorSelect}
                onCameraOpen={() => {
                  if (!bandageId.trim()) { alert('Please enter a Bandage ID first.'); return; }
                  setIsScanning(true);
                }}
                isLoading={loading}
                bandageId={bandageId}
                setBandageId={setBandageId}
              />
            </div>

            {isScanning && (
              <CameraScanner
                onScanComplete={handleManualScanFromCamera}
                onCancel={() => setIsScanning(false)}
              />
            )}

            {/* Right: Result Display */}
            <div>
              {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
                  <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                  {message.text}
                </div>
              )}
              {loading ? (
                <AnalysisResult isLoading={true} />
              ) : showResult && latestResult ? (
                <AnalysisResult
                  scan={latestResult}
                  onClose={() => setShowResult(false)}
                />
              ) : (
                <div className="glass-card" style={{
                  padding: 40,
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, rgba(79,142,247,0.05), rgba(34,211,238,0.05))',
                  border: '1px dashed var(--border)',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Analysis Results
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    Submit a bandage scan and the analysis results will appear here in real-time
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── History Tab ──────────────────────────── */}
        {activeTab === 'history' && (
          <div className="fade-in">
            <div className="section-header">
              <div>
                <div className="section-title">📋 Scan History</div>
                <div className="section-subtitle">{scanHistory.length} scan{scanHistory.length !== 1 ? 's' : ''} submitted this session</div>
              </div>
            </div>

            {scanHistory.length === 0 ? (
              <div className="glass-card">
                <div className="empty-state">
                  <span className="empty-state-icon">🔍</span>
                  <div className="empty-state-title">No scans yet</div>
                  <div className="empty-state-text">
                    Scans you submit during this session will appear here.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {scanHistory.map((scan, i) => {
                  const color = COLORS.find(c => c.id === scan.colorDetected) || COLORS[0];
                  return (
                    <div key={i} className="scan-row fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                      {/* Color dot */}
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: color.dot,
                        flexShrink: 0,
                        boxShadow: `0 0 18px ${color.dot}55`,
                      }} />
                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text-primary)', marginBottom: 3 }}>
                          {scan.colorDetected} Bandage
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                          pH: <span style={{ fontWeight: 700, color: 'var(--blue)' }}>
                            {typeof scan.phValue === 'number' ? scan.phValue.toFixed(2) : scan.phValue}
                          </span>
                          {' · '}Bandage ID: <span style={{ fontFamily: 'monospace' }}>{scan.bandageId}</span>
                        </div>
                      </div>
                      <span className={`badge ${getBadgeClass(scan.infectionLevel)}`}>
                        {scan.infectionLevel}
                      </span>
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
