import React from 'react';

function Logo({ size = 40, showText = false }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#4f8ef7" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                </defs>
                {/* Background rounded square */}
                <rect width="100" height="100" rx="22" fill="url(#logoGrad)" />
                {/* Bandage body */}
                <rect x="18" y="38" width="64" height="24" rx="12" fill="white" opacity="0.95" />
                {/* Centre pad */}
                <rect x="38" y="32" width="24" height="36" rx="8" fill="white" opacity="0.95" />
                {/* pH lettering */}
                <text
                    x="50"
                    y="57"
                    textAnchor="middle"
                    fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                    fontWeight="800"
                    fontSize="16"
                    fill="#0a1628"
                    letterSpacing="-0.5"
                >
                    pH
                </text>
                {/* Cross marks on bandage */}
                <line x1="26" y1="44" x2="34" y2="56" stroke="#4f8ef7" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="34" y1="44" x2="26" y2="56" stroke="#4f8ef7" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="66" y1="44" x2="74" y2="56" stroke="#4f8ef7" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="74" y1="44" x2="66" y2="56" stroke="#4f8ef7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {showText && (
                <div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.1 }}>pH Bandage</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.3px' }}>Smart Wound Care System</div>
                </div>
            )}
        </div>
    );
}

export default Logo;
