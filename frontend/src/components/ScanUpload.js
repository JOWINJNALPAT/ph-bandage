import React, { useState, useRef } from 'react';

/**
 * Professional Scan Upload Component
 * Features: Real-time preview, drag-and-drop, analysis feedback
 */
function ScanUpload({ onScanSubmit, onColorSelect, onCameraOpen, isLoading, bandageId, setBandageId }) {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const COLORS = [
    { id: 'Yellow', label: 'Yellow', dot: '#EAB308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.4)', text: '#fbbf24', ph: '5.5–6.0', status: 'Healthy' },
    { id: 'Green', label: 'Green', dot: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)', text: '#34d399', ph: '6.5–7.0', status: 'Mild Risk' },
    { id: 'Blue', label: 'Blue', dot: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', text: '#7eb0ff', ph: '7.5–8.0', status: 'Medium Infection' },
    { id: 'Dark Blue', label: 'Dark Blue', dot: '#1E3A8A', bg: 'rgba(30,58,138,0.25)', border: 'rgba(30,58,138,0.55)', text: '#93c5fd', ph: '8.5–9.0', status: 'High Infection' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setSelectedColor('');
    };
    reader.readAsDataURL(file);
  };

  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
    setImage(null);
    setPreview(null);
    onColorSelect?.(colorId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bandageId.trim()) {
      alert('Please enter a Bandage ID');
      return;
    }
    if (!image && !selectedColor) {
      alert('Please upload an image or select a color');
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 30;
        return Math.min(next, 95);
      });
    }, 300);

    try {
      await onScanSubmit({
        bandageId: bandageId.trim(),
        image,
        color: selectedColor,
      });
    } finally {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const clearUpload = () => {
    setPreview(null);
    setImage(null);
    setSelectedColor('');
    setUploadProgress(0);
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(34,211,238,0.05), rgba(79,142,247,0.05))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 24 }}>🔬</span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Smart Bandage Analysis
            </h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Upload a bandage photo or select observed color for instant infection assessment
          </p>
        </div>

        <div style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>
            {/* Bandage ID Input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                🏷️ Bandage Identifier
              </label>
              <input
                type="text"
                value={bandageId}
                onChange={(e) => setBandageId(e.target.value.toUpperCase())}
                placeholder="Enter bandage ID (e.g. BANDAGE-001)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 13,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--blue)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 142, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Camera Capture Button */}
            <div style={{ marginBottom: 24 }}>
              <button
                type="button"
                onClick={onCameraOpen}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(79, 142, 247, 0.1)',
                  border: '2px solid var(--blue)',
                  color: 'var(--blue)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 24 }}>📸</span>
                Open Real-time Scanner
              </button>
            </div>

            {/* Upload Area or Preview */}
            {preview ? (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(34,211,238,0.1))',
                  border: '2px solid var(--blue)',
                  aspectRatio: '1',
                }}>
                  <img src={preview} alt="Preview" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }} />
                  <button
                    type="button"
                    onClick={clearUpload}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: 'none',
                      color: 'white',
                      fontSize: 18,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                    }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, textAlign: 'center' }}>
                  Image ready for analysis
                </p>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px dashed ${dragActive ? 'var(--blue)' : 'var(--border)'}`,
                  background: dragActive ? 'rgba(79, 142, 247, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  padding: 30,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>📁</div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                  Choose a Photo
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
                  Or drag and drop files here
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>
            )}

            {/* Color Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Or Select Observed Color
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {COLORS.map(color => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorSelect(color.id)}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      border: `2px ${selectedColor === color.id ? 'solid' : 'solid'} ${color.border}`,
                      background: selectedColor === color.id ? color.bg : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: selectedColor === color.id ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: color.dot,
                        boxShadow: `0 0 8px ${color.dot}80`,
                      }} />
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: color.text }}>
                          {color.label}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          pH {color.ph}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  width: '100%',
                  height: 6,
                  background: 'var(--bg-input)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #4f8ef7, #22d3ee)',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, textAlign: 'center' }}>
                  {uploadProgress < 100 ? 'Analyzing...' : 'Complete!'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || uploadProgress > 0}
              style={{
                width: '100%',
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #4f8ef7, #22d3ee)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(79, 142, 247, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {isLoading ? '🔄 Analyzing...' : '🚀 Submit Scan for Analysis'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ScanUpload;
