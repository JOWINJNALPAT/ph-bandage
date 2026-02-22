import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

const roleConfig = {
    admin: {
        label: 'Administrator',
        color: '#a855f7',
        gradient: 'linear-gradient(135deg,#a855f7,#4f8ef7)',
        initial: 'A',
        navItems: [
            { id: 'analytics', label: 'Analytics Overview', icon: '📊' },
            { id: 'users', label: 'Staff Members', icon: '👥' },
            { id: 'create', label: 'Add Staff Member', icon: '➕' },
        ],
    },
    doctor: {
        label: 'Physician',
        color: '#4f8ef7',
        gradient: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
        initial: 'Dr',
        navItems: [
            { id: 'patients', label: 'Patient List', icon: '🏥' },
        ],
    },
    nurse: {
        label: 'Nursing Staff',
        color: '#22d3ee',
        gradient: 'linear-gradient(135deg,#22d3ee,#10b981)',
        initial: 'N',
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

    // Get initials from user name
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : config.initial;

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <Logo size={38} showText={true} />
            </div>

            {/* User badge */}
            <div style={{ padding: '12px 20px', marginBottom: 8 }}>
                <div style={{
                    background: `${config.color}12`,
                    border: `1px solid ${config.color}25`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    {/* Avatar with initials */}
                    <div style={{
                        width: 36, height: 36,
                        background: config.gradient,
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12, fontWeight: 800,
                        color: '#fff', flexShrink: 0,
                        letterSpacing: '-0.5px'
                    }}>{initials}</div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'Staff Member'}
                        </div>
                        <div style={{ fontSize: 11, color: config.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {config.label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav label */}
            <div style={{ padding: '4px 20px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Menu
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

            {/* Sign Out */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                <button
                    id="sidebar-logout"
                    onClick={handleLogout}
                    className="btn-danger"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    Sign Out
                </button>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
                    © 2026 pH Bandage System
                </p>
            </div>
        </div>
    );
}

export default Sidebar;
