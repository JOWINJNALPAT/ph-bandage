import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const roleConfig = {
    admin: {
        label: 'Administrator',
        color: '#a855f7',
        gradient: 'linear-gradient(135deg,#a855f7,#4f8ef7)',
        icon: '⚙️',
        navItems: [
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'users', label: 'Team Members', icon: '👥' },
            { id: 'create', label: 'Add Member', icon: '➕' },
        ],
    },
    doctor: {
        label: 'Physician',
        color: '#4f8ef7',
        gradient: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
        icon: '👨‍⚕️',
        navItems: [
            { id: 'patients', label: 'My Patients', icon: '🏥' },
        ],
    },
    nurse: {
        label: 'Nurse',
        color: '#22d3ee',
        gradient: 'linear-gradient(135deg,#22d3ee,#10b981)',
        icon: '👩‍⚕️',
        navItems: [
            { id: 'scan', label: 'Submit Scan', icon: '📸' },
            { id: 'history', label: 'Scan History', icon: '📋' },
        ],
    },
};

function Sidebar({ activeTab, onTabChange }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const config = roleConfig[user?.role] || roleConfig.nurse;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40,
                        background: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 20,
                    }}>🩹</div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>pH Bandage</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Medical Platform</div>
                    </div>
                </div>
            </div>

            {/* User badge */}
            <div style={{ padding: '12px 24px', marginBottom: 8 }}>
                <div style={{
                    background: `${config.color}15`,
                    border: `1px solid ${config.color}30`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <div style={{
                        width: 36, height: 36,
                        background: config.gradient,
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 16,
                        flexShrink: 0
                    }}>{config.icon}</div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'User'}
                        </div>
                        <div style={{ fontSize: 11, color: config.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {config.label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav section label */}
            <div style={{ padding: '4px 24px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Navigation
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1 }}>
                {config.navItems.map((item) => (
                    <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        onClick={() => onTabChange(item.id)}
                        className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Bottom section */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 500 }}>
                    🟢 Connected · v2.0.0
                </div>
                <button
                    id="sidebar-logout"
                    onClick={handleLogout}
                    className="btn-danger"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
