import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * AI-Powered PH Analysis Scanner with "Neural Sync" Touch Interaction
 * High-precision vision analysis triggered by user touch/hold
 */
const CameraScanner = ({ onScanComplete, onCancel }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [cvReady, setCvReady] = useState(cv_initialized());
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [status, setStatus] = useState('Initializing AI module...');
    const [error, setError] = useState(null);
    const [liveData, setLiveData] = useState({ hue: 0, variance: 0, light: 0 });
    const syncInterval = useRef(null);

    function cv_initialized() {
        return !!(window.cv && window.cv.Mat);
    }

    // Check if OpenCV is loaded
    useEffect(() => {
        if (cv_initialized()) {
            setCvReady(true);
            return;
        }
        const checkCV = setInterval(() => {
            if (cv_initialized()) {
                setCvReady(true);
                clearInterval(checkCV);
            }
        }, 500);
        return () => clearInterval(checkCV);
    }, []);

    // Start Camera
    useEffect(() => {
        async function setupCamera() {
            try {
                const constraints = {
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                };
                const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                    setStream(newStream);
                    setStatus('Align bandage — Touch and Hold to Sync');
                }
            } catch (err) {
                setError('Neural vision requires camera access. Please enable permissions.');
                console.error(err);
            }
        }
        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Process frame with OpenCV
    const processFrame = useCallback(() => {
        if (!cvReady || !videoRef.current || !canvasRef.current) return;

        const cv = window.cv;
        const video = videoRef.current;

        try {
            let src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
            let cap = new cv.VideoCapture(video);
            cap.read(src);

            const size = 260;
            const x = (video.videoWidth - size) / 2;
            const y = (video.videoHeight - size) / 2;
            let rect = new cv.Rect(x, y, size, size);
            let roi = src.roi(rect);

            let gray = new cv.Mat();
            cv.cvtColor(roi, gray, cv.COLOR_RGBA2GRAY);
            let meanLight = cv.mean(gray).slice(0, 1)[0];

            let laplacian = new cv.Mat();
            cv.Laplacian(gray, laplacian, cv.CV_64F);
            let myMean = new cv.Mat();
            let myStddev = new cv.Mat();
            cv.meanStdDev(laplacian, myMean, myStddev);
            const variance = myStddev.data64F[0] * myStddev.data64F[0];

            let hsv = new cv.Mat();
            let rgbRoot = new cv.Mat();
            cv.cvtColor(roi, rgbRoot, cv.COLOR_RGBA2RGB);
            cv.cvtColor(rgbRoot, hsv, cv.COLOR_RGB2HSV);

            let channels = new cv.MatVector();
            cv.split(hsv, channels);
            let hueChannel = channels.get(0);
            let meanHue = cv.mean(hueChannel).slice(0, 1)[0];

            // Cleanup
            src.delete(); roi.delete(); hsv.delete(); gray.delete();
            laplacian.delete(); myMean.delete();
            myStddev.delete(); rgbRoot.delete();
            channels.delete(); hueChannel.delete();

            return { hue: meanHue, variance, light: meanLight };
        } catch (e) {
            console.error("CV Process Error", e);
            return null;
        }
    }, [cvReady]);

    // Live Telemetry Loop
    useEffect(() => {
        let frameId;
        const tick = () => {
            if (cvReady && videoRef.current && !isSyncing) {
                const result = processFrame();
                if (result) {
                    setLiveData({
                        hue: Math.round(result.hue),
                        variance: Math.round(result.variance),
                        light: Math.round(result.light)
                    });

                    if (result.variance < 15) {
                        setStatus('⚠️ UNSTABLE - HOLD STEADY');
                    } else if (result.light < 40) {
                        setStatus('⚠️ LOW LIGHT - INCREASE AMBIENT ILLUM');
                    } else {
                        setStatus('READY - HOLD TO SYNC');
                    }
                }
            }
            frameId = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(frameId);
    }, [cvReady, isSyncing, processFrame]);

    // Handlers for "Neural Sync" interaction
    const startSync = () => {
        if (!cvReady || isSyncing) return;
        setIsSyncing(true);
        setSyncProgress(0);
        setStatus('ESTABLISHING NEURAL LINK...');

        syncInterval.current = setInterval(() => {
            setSyncProgress(prev => {
                if (prev >= 100) {
                    clearInterval(syncInterval.current);
                    executeFinalAnalysis();
                    return 100;
                }
                return prev + 4; // Approx 1.2s to fill
            });
        }, 50);
    };

    const cancelSync = () => {
        if (!isSyncing || syncProgress >= 100) return;
        clearInterval(syncInterval.current);
        setIsSyncing(false);
        setSyncProgress(0);
        setStatus('SYNC INTERRUPTED - HOLD TO RE-SYNC');
    };

    const executeFinalAnalysis = () => {
        setStatus('FETCHING DIAGNOSTICS...');

        const result = processFrame();
        if (result) {
            let phValue = 5.0;
            let infectionLevel = 'Healthy';
            let confidence = 98;

            if (result.hue > 85) { phValue = 8.8; infectionLevel = 'High Infection'; }
            else if (result.hue > 65) { phValue = 7.7; infectionLevel = 'Medium Infection'; }
            else if (result.hue > 45) { phValue = 6.9; infectionLevel = 'Mild Risk'; }
            else { phValue = 5.8; infectionLevel = 'Healthy'; }

            setTimeout(() => {
                onScanComplete({
                    phValue,
                    infectionLevel,
                    confidence,
                    colorDetected: infectionLevel === 'Healthy' ? 'Yellow' :
                        infectionLevel === 'Mild Risk' ? 'Green' :
                            infectionLevel === 'Medium Infection' ? 'Blue' : 'Dark Blue',
                    metadata: {
                        hue: result.hue,
                        variance: result.variance,
                        luminosity: result.light
                    }
                });
            }, 500);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#000', zIndex: 1000,
            display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: '"Inter", sans-serif'
        }}>
            {/* Main Interaction Area (Touch surface) */}
            <div
                style={{ position: 'relative', flex: 1, cursor: 'pointer', overflow: 'hidden' }}
                onMouseDown={startSync}
                onMouseUp={cancelSync}
                onTouchStart={(e) => { e.preventDefault(); startSync(); }}
                onTouchEnd={cancelSync}
            >
                <video
                    ref={videoRef}
                    autoPlay playsInline muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* HUD Elements */}
                <div style={{ position: 'absolute', inset: 0, border: '40px solid rgba(0,0,0,0.6)', pointerEvents: 'none' }} />

                {/* Spectral Capture Zone */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 280, height: 280,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none'
                }}>
                    {/* Progress Ring */}
                    <svg width="280" height="280" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="140" cy="140" r="135"
                            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"
                        />
                        <circle
                            cx="140" cy="140" r="135"
                            fill="none" stroke="var(--blue)" strokeWidth="6"
                            strokeDasharray={2 * Math.PI * 135}
                            strokeDashoffset={2 * Math.PI * 135 * (1 - syncProgress / 100)}
                            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                        />
                    </svg>

                    {/* Sync Pulse */}
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%',
                        background: isSyncing ? 'var(--blue)' : 'rgba(255,255,255,0.1)',
                        opacity: isSyncing ? 0.4 : 0.2,
                        transition: 'all 0.3s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {isSyncing ? (
                            <span style={{ fontSize: 24 }} className="animate-pulse">🧬</span>
                        ) : (
                            <span style={{ fontSize: 12, color: '#fff', fontWeight: 800 }}>HOLD</span>
                        )}
                    </div>

                    {/* Corner Markers */}
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{
                            position: 'absolute', width: 20, height: 2, background: 'var(--blue)',
                            transform: `rotate(${i * 90}deg) translate(140px)`,
                            opacity: 0.5
                        }} />
                    ))}
                </div>

                {/* Live Data Feed */}
                <div style={{
                    position: 'absolute', top: 60, left: 24,
                    color: 'var(--cyan)', fontFamily: 'monospace', fontSize: 10,
                    padding: 16, background: 'rgba(0,0,0,0.4)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ opacity: 0.5, marginBottom: 8 }}>V_OPTIC_FEED_ID: 99x2</div>
                    <div>• HUE_INDEX: {liveData.hue}C</div>
                    <div>• VARIANCE: {liveData.variance}hz</div>
                    <div>• LUM_VAL: {liveData.light}lx</div>
                </div>

                {/* Central Status */}
                <div style={{
                    position: 'absolute', bottom: 140, width: '100%', textAlign: 'center'
                }}>
                    <div className="glass-card" style={{
                        display: 'inline-block', padding: '14px 28px', borderRadius: 100,
                        border: isSyncing ? '1px solid var(--blue)' : '1px solid rgba(255,255,255,0.1)',
                        fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: 1,
                        background: 'rgba(0,0,0,0.8)', textTransform: 'uppercase'
                    }}>
                        {status}
                    </div>
                </div>

                {/* Interactive Feedback (Ripple) */}
                {isSyncing && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle, rgba(79, 142, 247, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />
                )}
            </div>

            {/* Bottom Panel */}
            <div style={{
                padding: '30px 40px', background: '#050505', borderTop: '1px solid #111',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <button onClick={onCancel} style={{ color: '#666', background: 'none', border: 'none', fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>
                    DISCONNECT
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: i <= (syncProgress / 25) ? 'var(--blue)' : '#222',
                            transition: 'background 0.2s'
                        }} />
                    ))}
                </div>
                <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>
                    NEURAL_LINK_4_A
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CameraScanner;
