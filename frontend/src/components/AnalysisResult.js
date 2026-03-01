
/**
 * Professional Analysis Results Component
 * Displays detailed infection analysis
 */
function AnalysisResult({
  scan,
  isLoading = false,
  onClose
}) {
  if (isLoading) {
    return (
      <div className="analysis-result">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            🔬 Analyzing your bandage scan...
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>
            Processing image...
          </p>
        </div>
      </div>
    );
  }

  if (!scan) return null;

  const getStatusColor = (level) => {
    if (level === 'Healthy') return { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', icon: '✅' };
    if (level === 'Mild Risk') return { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', icon: '⚠️' };
    if (level === 'Medium Infection') return { bg: 'rgba(249, 115, 22, 0.12)', color: '#fb923c', icon: '🔴' };
    return { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', icon: '🚨' };
  };

  const status = getStatusColor(scan.infectionLevel);

  return (
    <div className="analysis-result">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {status.icon} Analysis Complete
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            {new Date().toLocaleString()}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 8,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Status */}
      <div style={{
        padding: 16,
        borderRadius: 'var(--radius-md)',
        background: status.bg,
        border: `1px solid ${status.color}33`,
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: status.color, marginBottom: 4 }}>
              Infection Level
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: status.color }}>
              {scan.infectionLevel}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
              pH Value
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--blue)' }}>
              {scan.phValue}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Bandage ID', value: scan.bandageId, icon: '🏷️' },
          { label: 'Color Detected', value: scan.detectedColor || scan.colorDetected || scan.color, icon: '🎨' },
          { label: 'Scan Confidence', value: `${scan.confidence || 0}%`, icon: '🎯' },
          { label: 'Method', value: scan.method || 'OpenCV Scan', icon: '💻' },
        ].map((metric, i) => (
          <div key={i} style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{metric.icon}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              {metric.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Recommendation */}
      <div className="clinical-note">
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', marginBottom: 8 }}>
          💡 Clinical Recommendation
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {scan.infectionLevel === 'Healthy' && (
            <>Wound shows <strong>healthy</strong> pH levels. Continue monitoring. No intervention required at this time.</>
          )}
          {scan.infectionLevel === 'Mild Risk' && (
            <>Wound shows <strong>elevated</strong> pH. Increase monitoring frequency. Consider topical antimicrobial treatment.</>
          )}
          {scan.infectionLevel === 'Medium Infection' && (
            <>Wound shows <strong>infection risk</strong>. Recommend clinical evaluation. Consider antibiotic treatment.</>
          )}
          {scan.infectionLevel === 'High Infection' && (
            <>Wound shows <strong>high infection risk</strong>. URGENT: Immediate clinical intervention recommended.</>
          )}
        </div>
      </div>

      {/* pH Reference */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          📊 pH Reference Scale
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { range: '<7.0', label: 'Healthy', color: '#10b981' },
            { range: '7.0-7.4', label: 'Mild', color: '#f59e0b' },
            { range: '7.4-8.0', label: 'Medium', color: '#f97316' },
            { range: '>8.0', label: 'High', color: '#ef4444' },
          ].map((ref, i) => (
            <div key={i} style={{
              flex: 1,
              padding: 10,
              borderRadius: 'var(--radius-sm)',
              background: `${ref.color}15`,
              border: `1px solid ${ref.color}35`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ref.color, marginBottom: 2 }}>
                {ref.range}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                {ref.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        Analysis ID: {scan._id?.slice(-8) || 'N/A'} · {new Date(scan.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

export default AnalysisResult;
