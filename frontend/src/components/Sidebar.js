import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

const roleConfig = {
    admin: {
        label: 'Administrator',
        color: '#a855f7',
        gradient: 'linear-gradient(135deg,#a855f7,#4f8ef7)',
        navItems: [
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'users', label: 'Staff Members', icon: '👥' },
            { id: 'create', label: 'Add Staff', icon: '➕' },
        ],
    },
    doctor: {
        label: 'Physician',
        color: '#4f8ef7',
        gradient: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
        navItems: [
            { id: 'patients', label: 'My Patients', icon: '🏥' },
        ],
    },
    nurse: {
        label: 'Nursing Staff',
        color: '#22d3ee',
        gradient: 'linear-gradient(135deg,#22d3ee,#10b981)',
        navItems: [
            { id: 'scan', label: 'Submit Scan', icon: '🩺' },
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

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <div className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <Logo size={34} showText={true} />
            </div>

            {/* User card */}
            <div style={{ padding: '14px 12px 8px' }}>
                <div style={{
                    background: `${config.color}0f`,
                    border: `1px solid ${config.color}22`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <div className="user-avatar" style={{ background: config.gradient, fontSize: 11 }}>
                        {initials}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{
                            fontWeight: 700, fontSize: 13,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                            {user?.name || 'Staff Member'}
                        </div>
                        <div style={{
                            fontSize: 10.5, color: config.color,
                            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                            {config.label}
                        </div>
                    </div>
                    {/* Status dot */}
                    <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: 'var(--green)',
                        boxShadow: '0 0 6px var(--green)',
                        flexShrink: 0,
                    }} />
                </div>
            </div>

            {/* Nav */}
            <div className="sidebar-section-label">Navigation</div>
            <nav style={{ flex: 1, padding: '0 0 8px' }}>
                {config.navItems.map((item) => (
                    <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        onClick={() => onTabChange(item.id)}
                        className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Bottom section */}
            <div style={{
                borderTop: '1px solid var(--border)',
                padding: '14px 12px',
            }}>
                <button
                    id="sidebar-logout"
                    onClick={handleLogout}
                    className="btn-danger"
                    style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)', padding: '9px' }}
                >
                    <span>⎋</span> Sign Out
                </button>
                <p style={{
                    fontSize: 10, color: 'var(--text-muted)',
                    textAlign: 'center', marginTop: 10, lineHeight: 1.5,
                }}>
                    © 2026 pH Bandage System
                </p>
            </div>
        </div>
    );
}

export default Sidebar;
