import React, { useRef, useState, useEffect } from 'react';

/**
 * Advanced OpenCV.js Powered Camera Module
 * Handles real-time capture, region detection, and HSV color extraction
 */
const CameraScanner = ({ onScanComplete, onCancel }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [cvReady, setCvReady] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [status, setStatus] = useState('Initializing camera...');
    const [error, setError] = useState(null);

    // Check if OpenCV is loaded
    useEffect(() => {
        const checkCV = setInterval(() => {
            if (window.cv && window.cv.Mat) {
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
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                };
                const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                    setStream(newStream);
                    setStatus('Camera active. Align bandage in center.');
                }
            } catch (err) {
                setError('Camera access denied. Please enable camera permissions.');
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
    const processFrame = () => {
        if (!cvReady || !videoRef.current || !canvasRef.current) return;

        const cv = window.cv;
        const video = videoRef.current;

        // Create Mats
        let src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
        cap.read(src);

        // 0. Region Detection (Center 220x220)
        const size = 220;
        const x = (video.videoWidth - size) / 2;
        const y = (video.videoHeight - size) / 2;
        let rect = new cv.Rect(x, y, size, size);
        let roi = src.roi(rect);

        // 1. Lighting Normalization (CLAHE)
        let gray = new cv.Mat();
        cv.cvtColor(roi, gray, cv.COLOR_RGBA2GRAY);

        let clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
        let normalizedGray = new cv.Mat();
        clahe.apply(gray, normalizedGray);

        // 2. Blur Detection (Laplacian Variance)
        let laplacian = new cv.Mat();
        cv.Laplacian(normalizedGray, laplacian, cv.CV_64F);
        let myMean = new cv.Mat();
        let myStddev = new cv.Mat();
        cv.meanStdDev(laplacian, myMean, myStddev);
        const variance = myStddev.data64F[0] * myStddev.data64F[0];

        if (variance < 15) {
            setStatus('⚠️ Image blurry. Please hold steady.');
        } else {
            setStatus('Ready to scan');
        }

        // Convert to HSV for color extraction
        let hsv = new cv.Mat();
        let rgbRoot = new cv.Mat();
        cv.cvtColor(roi, rgbRoot, cv.COLOR_RGBA2RGB);
        cv.cvtColor(rgbRoot, hsv, cv.COLOR_RGB2HSV);

        // Extract Average Hue
        let channels = new cv.MatVector();
        cv.split(hsv, channels);
        let hueChannel = channels.get(0);
        let meanHue = cv.mean(hueChannel).slice(0, 1)[0];

        // Cleanup
        src.delete(); roi.delete(); hsv.delete(); gray.delete();
        normalizedGray.delete(); laplacian.delete(); myMean.delete();
        myStddev.delete(); rgbRoot.delete(); clahe.delete();
        channels.delete(); hueChannel.delete();

        return { hue: meanHue, variance, hsv };
    };

    const captureAndAnalyze = () => {
        setIsCapturing(true);
        const result = processFrame();

        if (result) {
            // Map Hue (0-180 in OpenCV) to pH
            // Simple mapping logic based on standard indicators
            // Yellow: ~25-35 Hue, Green: ~40-70 Hue, Blue: ~90-120 Hue
            let phValue = 5.0;
            let infectionLevel = 'Healthy';
            let confidence = 90;

            if (result.hue > 80) {
                phValue = 8.8;
                infectionLevel = 'High Infection';
            } else if (result.hue > 60) {
                phValue = 7.8;
                infectionLevel = 'Medium Infection';
            } else if (result.hue > 40) {
                phValue = 6.8;
                infectionLevel = 'Mild Risk';
            } else {
                phValue = 5.8;
                infectionLevel = 'Healthy';
            }

            // Final callback
            setTimeout(() => {
                onScanComplete({
                    phValue,
                    infectionLevel,
                    confidence: Math.round(confidence - (result.variance < 30 ? 10 : 0)),
                    colorDetected: infectionLevel === 'Healthy' ? 'Yellow' :
                        infectionLevel === 'Mild Risk' ? 'Green' :
                            infectionLevel === 'Medium Infection' ? 'Blue' : 'Dark Blue'
                });
                setIsCapturing(false);
            }, 800);
        }
    };

    return (
        <div className="camera-module" style={{
            position: 'fixed', inset: 0, background: '#000', zIndex: 1000,
            display: 'flex', flexDirection: 'column'
        }}>
            {/* Viewport */}
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                <video
                    ref={videoRef}
                    autoPlay playsInline muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Detection Overlay */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 200, height: 200,
                    border: '2px solid #4f8ef7',
                    borderRadius: 20,
                    boxShadow: '0 0 0 4000px rgba(0,0,0,0.5)',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        position: 'absolute', top: -30, width: '100%', textAlign: 'center',
                        color: '#fff', fontSize: 12, fontWeight: 700, textTransform: 'uppercase'
                    }}>
                        Align Bandage Region
                    </div>
                </div>

                {/* Status Toast */}
                <div style={{
                    position: 'absolute', bottom: 40, width: '100%', textAlign: 'center'
                }}>
                    <div style={{
                        display: 'inline-block', padding: '10px 20px',
                        background: 'rgba(0,0,0,0.7)', borderRadius: 30,
                        color: '#fff', fontSize: 13, fontWeight: 500
                    }}>
                        {status}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{
                padding: '30px', background: 'var(--bg-secondary)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <button className="btn-ghost" onClick={onCancel}>Cancel</button>

                <button
                    onClick={captureAndAnalyze}
                    disabled={isCapturing || !cvReady}
                    style={{
                        width: 70, height: 70, borderRadius: '50%',
                        background: '#fff', border: '5px solid var(--blue)',
                        padding: 0, cursor: 'pointer', outline: 'none'
                    }}
                >
                    <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        background: isCapturing ? 'var(--blue)' : 'transparent',
                        transition: 'all 0.2s'
                    }} />
                </button>

                <div style={{ width: 60 }} /> {/* Spacer */}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CameraScanner;
