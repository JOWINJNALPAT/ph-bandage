import React from 'react';

/**
 * Professional AI Analysis Results Component
 * Displays refined diagnostic telemetry and infection analysis
 */
function AnalysisResult({
  scan,
  isLoading = false,
  onClose
}) {
  if (isLoading) {
    return (
      <div className="glass-card ai-scan-glow" style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🧬</div>
        <h3 className="text-gradient-ai" style={{ fontSize: 24, marginBottom: 12 }}>Executing Neural Protocols...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Identifying spectral markers and calculating pH coefficients</p>
        <div style={{ marginTop: 24, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, width: 200, margin: '24px auto' }}>
          <div style={{ width: '70%', height: '100%', background: 'var(--grad-blue)', borderRadius: 2 }}></div>
        </div>
      </div>
    );
  }

  if (!scan) return null;

  const getStatusColor = (level) => {
    if (level === 'Healthy') return { bg: 'rgba(16, 185, 129, 0.08)', color: '#34d399', icon: '✅', glow: 'rgba(16, 185, 129, 0.3)' };
    if (level === 'Mild Risk') return { bg: 'rgba(245, 158, 11, 0.08)', color: '#fbbf24', icon: '⚠️', glow: 'rgba(245, 158, 11, 0.3)' };
    if (level === 'Medium Infection') return { bg: 'rgba(249, 115, 22, 0.08)', color: '#fb923c', icon: '🟠', glow: 'rgba(249, 115, 22, 0.3)' };
    return { bg: 'rgba(239, 68, 68, 0.08)', color: '#f87171', icon: '🚨', glow: 'rgba(239, 68, 68, 0.3)' };
  };

  const status = getStatusColor(scan.infectionLevel);

  return (
    <div className="glass-card premium scale-in" style={{ padding: 32, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: 12 }}>
        <span className="ai-data-tag">Verified Result</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h3 className="text-gradient-ai" style={{ fontSize: 22, marginBottom: 4 }}>
            Optical Telemetry Complete
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            ID: {scan._id?.toUpperCase()} • {new Date(scan.timestamp).toLocaleString()}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text-secondary)', padding: 6, cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Primary Result Card */}
      <div style={{
        padding: 24, borderRadius: 16, background: status.bg,
        border: `1px solid ${status.color}33`, marginBottom: 28,
        boxShadow: `0 10px 30px ${status.glow}`, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -10, left: -10, fontSize: 80, opacity: 0.05 }}>
          {status.icon}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: status.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Condition Index
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: status.color, letterSpacing: -1 }}>
              {scan.infectionLevel}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase' }}>
              Spectral ph
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: -2 }}>
              {typeof scan.phValue === 'number' ? scan.phValue.toFixed(2) : scan.phValue}
            </div>
          </div>
        </div>
      </div>

      {/* AI Metadata Tags */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'CONFIDENCE', value: `${scan.confidence || 0}%`, color: 'var(--cyan)' },
          { label: 'LUMINOSITY', value: scan.metadata?.luminosity ? `${Math.round(scan.metadata.luminosity)}lx` : 'CALC...', color: 'var(--blue)' },
          { label: 'HUE_COEF', value: scan.metadata?.hue ? Math.round(scan.metadata.hue) : 'N/A', color: 'var(--purple-light)' },
          { label: 'STABILITY', value: scan.metadata?.variance ? (scan.metadata.variance > 40 ? 'HIGH' : 'LOW') : 'NORM', color: 'var(--green-light)' },
        ].map((tag, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '10px 4px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--text-muted)', marginBottom: 4 }}>{tag.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: tag.color }}>{tag.value}</div>
          </div>
        ))}
      </div>

      {/* Clinical Protocol */}
      <div style={{
        padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.03)',
        borderLeft: `4px solid ${status.color}`, marginBottom: 28
      }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: status.color, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          💡 AI PROTOCOL ADVISORY
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {scan.infectionLevel === 'Healthy' && (
            <>Optical signatures indicate <strong>nominal</strong> wound health. pH within physiological range. No escalation required.</>
          )}
          {scan.infectionLevel === 'Mild Risk' && (
            <>Detected <strong>alkaline shift</strong>. Probability of micro-inflammation detected. Initiate prophylactic cleansing protocol.</>
          )}
          {scan.infectionLevel === 'Medium Infection' && (
            <><strong>Critical pH Variance</strong> detected. Pattern indicates bacterial colonization. immediate specialist review mandated.</>
          )}
          {scan.infectionLevel === 'High Infection' && (
            <><strong>Severe Pathogen Signal</strong>. High alkalinity identified. Emergency debridement or surgical appraisal recommended.</>
          )}
        </div>
      </div>

      {/* User Verification Action */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onClose}
          className="btn-primary shimmer-btn"
          style={{ width: '100%', padding: '14px', borderRadius: 12, textTransform: 'uppercase', fontWeight: 800, fontSize: 12, letterSpacing: 1 }}
        >
          I have reviewed and verified this result →
        </button>
      </div>

      {/* Footer Branding */}
      <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>NEURAL_DIAGNOSTICS_SYS_V4.2.0</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--blue)', opacity: 0.3 * i }}></div>)}
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;
