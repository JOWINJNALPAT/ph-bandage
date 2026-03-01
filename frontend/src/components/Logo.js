import React from 'react';

/**
 * pH Bandage — Professional company logo (SVG, no external deps)
 * Usage:
 *   <Logo size={48} />                  — icon only
 *   <Logo size={48} showText />         — icon + company name
 *   <Logo size={48} showText variant="light" /> — white text version
 */
function Logo({ size = 48, showText = false, variant = 'default' }) {
    const textColor = variant === 'light' ? '#ffffff' : 'var(--text-primary)';
    const subColor = variant === 'light' ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: showText ? 12 : 0, userSelect: 'none' }}>
            {/* SVG Icon */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="pH Bandage Logo"
            >
                <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#4f8ef7" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b6fd4" />
                        <stop offset="100%" stopColor="#0ea5c5" />
                    </linearGradient>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#4f8ef7" floodOpacity="0.35" />
                    </filter>
                </defs>

                {/* Outer rounded square */}
                <rect width="120" height="120" rx="28" fill="url(#grad1)" filter="url(#shadow)" />

                {/* Inner subtle highlight */}
                <rect x="6" y="6" width="108" height="54" rx="22" fill="white" opacity="0.08" />

                {/* Bandage — horizontal strip */}
                <rect x="16" y="46" width="88" height="28" rx="14" fill="white" opacity="0.96" />

                {/* Bandage — vertical strip (cross shape) */}
                <rect x="46" y="20" width="28" height="80" rx="14" fill="white" opacity="0.96" />

                {/* Centre gauze pad */}
                <rect x="40" y="40" width="40" height="40" rx="8" fill="white" />

                {/* pH text in centre pad */}
                <text
                    x="60"
                    y="67"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                    fontWeight="900"
                    fontSize="20"
                    letterSpacing="-1"
                    fill="url(#grad2)"
                >
                    pH
                </text>

                {/* Cross-hatch texture dots on bandage wings */}
                {[28, 38].map(x => [50, 60, 70].map(y => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="url(#grad1)" opacity="0.4" />
                )))}
                {[82, 92].map(x => [50, 60, 70].map(y => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="url(#grad1)" opacity="0.4" />
                )))}
            </svg>

            {/* Company name */}
            {showText && (
                <div>
                    <div style={{
                        fontWeight: 800,
                        fontSize: Math.max(14, size * 0.35),
                        color: textColor,
                        lineHeight: 1.1,
                        letterSpacing: '-0.3px',
                    }}>
                        pH Bandage
                    </div>
                    <div style={{
                        fontSize: Math.max(9, size * 0.2),
                        color: subColor,
                        fontWeight: 500,
                        letterSpacing: '0.2px',
                        lineHeight: 1.3,
                    }}>
                        Medical Platform
                    </div>
                </div>
            )}
        </div>
    );
}

export default Logo;
